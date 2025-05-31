// services/footballService.ts
import Constants from 'expo-constants';
import {
  Competition,
  Season,
  Team,
  Match,
  StandingEntry,
  GroupPhase,
  LeaguePhase,
  KnockoutPhase,
  KnockoutRound,
  Group
} from '@/types';
import {
  transformLeaguesResponse,
  transformFixturesResponse,
  transformStandingsResponse,
  transformTeamsResponse,
  transformRoundsResponse,
  mapCompetition,
  mapSeason,
  safeTransform
} from '@/mappers/apiFootballMappers';

const API_BASE_URL = 'https://v3.football.api-sports.io';

class FootballService {
  private headers: Record<string, string>;

  constructor() {
    const apiKey = Constants.expoConfig?.extra?.apiFootballKey;
    const apiHost = Constants.expoConfig?.extra?.apiFootballHost;

    if (!apiKey) {
      throw new Error('API_FOOTBALL_KEY no está configurada en variables de entorno. Verifica tu app.config.js');
    }

    this.headers = {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': apiHost || 'v3.football.api-sports.io',
      'Content-Type': 'application/json',
    };
  }

  private async makeRequest(endpoint: string, params: Record<string, any> = {}): Promise<any> {
    try {
      const queryParams = new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = String(value);
          }
          return acc;
        }, {} as Record<string, string>)
      ).toString();
      
      const url = `${API_BASE_URL}${endpoint}${queryParams ? `?${queryParams}` : ''}`;
      console.log(`🌐 API Call: ${endpoint}`, params);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ API Response: ${endpoint} - ${data.response?.length || 0} items`);
      return data;
    } catch (error) {
      console.error(`❌ Error en ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene las competiciones principales (solo Champions y LaLiga para testing)
   */
  async getMainCompetitions(): Promise<Competition[]> {
    try {
      console.log('🏆 Iniciando carga de competiciones principales...');
      
      const mainLeagueIds = [2, 140]; // Champions League, LaLiga
      const competitions: Competition[] = [];

      for (const leagueId of mainLeagueIds) {
        try {
          console.log(`⚽ Cargando liga ${leagueId}...`);
          
          const leagueResponse = await this.makeRequest('/leagues', { id: leagueId });
          
          if (leagueResponse.response && leagueResponse.response.length > 0) {
            const leagueData = leagueResponse.response[0];
            
            // Crear seasons básicas (solo la más reciente)
            const seasons = leagueData.seasons?.slice(-1).map((season: any) => 
              mapSeason(season, leagueId.toString())
            ) || [];
            
            const competition = mapCompetition(leagueData.league, seasons);
            competitions.push(competition);
            
            console.log(`✅ Liga cargada: ${competition.name} (${seasons.length} temporadas)`);
          }
        } catch (error) {
          console.warn(`⚠️ Error cargando liga ${leagueId}:`, error);
        }
      }

      console.log(`🎯 Total competiciones: ${competitions.length}`);
      return competitions;
    } catch (error) {
      console.error('❌ Error obteniendo competiciones:', error);
      throw new Error('Error al obtener las competiciones principales');
    }
  }

  /**
   * Obtiene datos completos de una competición específica
   */
  async getCompetitionData(competitionId: string): Promise<Competition | null> {
    try {
      console.log(`🔍 Obteniendo datos completos para competición: ${competitionId}`);
      
      const leagueId = parseInt(competitionId);
      if (isNaN(leagueId)) {
        throw new Error('ID de competición inválido');
      }

      // Obtener información básica de la liga
      const leagueResponse = await this.makeRequest('/leagues', { id: leagueId });
      
      if (!leagueResponse.response || leagueResponse.response.length === 0) {
        console.warn(`❌ No se encontró la liga ${leagueId}`);
        return null;
      }

      const leagueData = leagueResponse.response[0];
      console.log(`📋 Liga encontrada: ${leagueData.league.name}`);
      
      // Obtener coverage para saber qué datos están disponibles
      const coverage = leagueData.coverage || {};
      console.log(`📊 Coverage disponible:`, coverage);
      
      // Crear seasons con datos completos (solo la más reciente)
      const seasons: Season[] = [];
      
      if (leagueData.seasons && leagueData.seasons.length > 0) {
        const recentSeason = leagueData.seasons[leagueData.seasons.length - 1];
        console.log(`📅 Procesando temporada: ${recentSeason.year}`);
        
        const season = await this.buildCompleteSeasonData(leagueId, recentSeason, coverage);
        seasons.push(season);
      }

      const competition = mapCompetition(leagueData.league, seasons);
      
      // Establecer fechas de la competición
      if (seasons.length > 0) {
        const latestSeason = seasons[0];
        competition.startDate = latestSeason.startDate;
        competition.endDate = latestSeason.endDate;
      }

      console.log(`🏆 Competición completada: ${competition.name}`);
      return competition;
    } catch (error) {
      console.error('❌ Error obteniendo datos de competición:', error);
      throw new Error('Error al obtener los datos de la competición');
    }
  }

  /**
   * Construye una Season con todos sus datos completos
   */
  private async buildCompleteSeasonData(leagueId: number, seasonData: any, coverage: any): Promise<Season> {
    const season = mapSeason(seasonData, leagueId.toString());
    
    try {
      console.log(`🔨 Construyendo datos completos para ${leagueId}-${seasonData.year}`);
      
      // 1. Obtener equipos si están disponibles
      let teams: Team[] = [];
      if (coverage.standings !== false) {
        try {
          const teamsResponse = await this.makeRequest('/teams', {
            league: leagueId,
            season: seasonData.year
          });
          teams = safeTransform(transformTeamsResponse, teamsResponse);
          console.log(`👥 Equipos cargados: ${teams.length}`);
        } catch (error) {
          console.warn(`⚠️ Error cargando equipos:`, error);
        }
      }
      season.teams = teams;

      // 2. Obtener todos los partidos
      let allMatches: Match[] = [];
      try {
        const fixturesResponse = await this.makeRequest('/fixtures', {
          league: leagueId,
          season: seasonData.year
        });
        allMatches = safeTransform(transformFixturesResponse, fixturesResponse);
        console.log(`⚽ Partidos cargados: ${allMatches.length}`);
      } catch (error) {
        console.warn(`⚠️ Error cargando partidos:`, error);
      }

      // 3. Obtener clasificación si está disponible
      let standings: StandingEntry[] = [];
      if (coverage.standings !== false) {
        try {
          const standingsResponse = await this.makeRequest('/standings', {
            league: leagueId,
            season: seasonData.year
          });
          
          console.log('🔍 Raw standings response:', JSON.stringify(standingsResponse, null, 2));
          
          standings = safeTransform(transformStandingsResponse, standingsResponse);
          console.log(`📊 Clasificación cargada: ${standings.length} equipos`);
          
          // Debug adicional de standings
          if (standings.length > 0) {
            console.log('📋 Primeros 3 equipos de la clasificación:');
            standings.slice(0, 3).forEach(team => {
              console.log(`  ${team.position}. ${team.team.name} - ${team.points} pts`);
            });
          } else {
            console.warn('⚠️ No se encontraron standings después de la transformación');
          }
          
        } catch (error) {
          console.warn(`⚠️ Error cargando clasificación:`, error);
        }
      }

      // 4. Obtener rondas para organizar mejor las fases
      let rounds: string[] = [];
      try {
        const roundsResponse = await this.makeRequest('/rounds', {
          league: leagueId,
          season: seasonData.year
        });
        rounds = safeTransform(transformRoundsResponse, roundsResponse);
        console.log(`🔄 Rondas encontradas: ${rounds.length}`);
      } catch (error) {
        console.warn(`⚠️ Error cargando rondas:`, error);
      }

      // 5. Estructurar en fases según el tipo de competición
      const competitionType = this.determineCompetitionType(leagueId);
      console.log(`🏷️ Tipo de competición: ${competitionType}`);

      // Asignar datos básicos para compatibilidad
      season.matches = allMatches;
      season.standings = standings;

      // Crear fases organizadas
      season.phases = await this.buildOrganizedPhases(
        leagueId, 
        seasonData.year, 
        competitionType, 
        allMatches, 
        standings, 
        rounds,
        teams
      );

      console.log(`✅ Temporada completada con ${season.phases?.length || 0} fases`);

    } catch (error) {
      console.warn(`⚠️ Error construyendo temporada:`, error);
      // Fallback: asegurar estructura mínima
      season.matches = season.matches || [];
      season.standings = season.standings || [];
      season.teams = season.teams || [];
      season.phases = [];
    }

    return season;
  }

  /**
   * Construye fases organizadas según el tipo de competición
   */
  private async buildOrganizedPhases(
    leagueId: number,
    season: number,
    competitionType: string,
    allMatches: Match[],
    standings: StandingEntry[],
    rounds: string[],
    teams: Team[]
  ): Promise<any[]> {
    const phases: any[] = [];

    try {
      if (competitionType === 'league') {
        // Liga tradicional - una sola fase de liga
        const leaguePhase: LeaguePhase = {
          id: `${leagueId}-${season}-league`,
          name: 'Liga',
          type: 'league',
          matches: allMatches,
          standings: standings
        };
        phases.push(leaguePhase);
        
        console.log(`📊 Fase de liga creada con ${standings.length} equipos en standings`);

      } else if (competitionType === 'cup') {
        // Copa - separar en fases de liga y eliminatorias
        
        // Fase de liga (partidos de grupos o fase inicial)
        const leagueMatches = allMatches.filter(match => 
          this.isLeaguePhaseRound(match.round)
        );
        
        if (leagueMatches.length > 0 || standings.length > 0) {
          const leaguePhase: LeaguePhase = {
            id: `${leagueId}-${season}-league`,
            name: 'Fase de Liga',
            type: 'league',
            matches: leagueMatches,
            standings: standings
          };
          phases.push(leaguePhase);
          
          console.log(`📊 Fase de liga (copa) creada con ${standings.length} equipos en standings`);
        }

        // Fase de eliminatorias (filtrada sin playoffs)
        const knockoutMatches = allMatches.filter(match => 
          this.isKnockoutPhaseRound(match.round)
        );

        console.log(`🔥 Partidos de knockout encontrados: ${knockoutMatches.length}`);
        knockoutMatches.forEach(match => {
          console.log(`  - ${match.round}: ${match.homeTeam.name} vs ${match.awayTeam.name}`);
        });

        if (knockoutMatches.length > 0) {
          const knockoutRounds = this.createKnockoutRounds(knockoutMatches, rounds);
          
          if (knockoutRounds.length > 0) {
            const knockoutPhase: KnockoutPhase = {
              id: `${leagueId}-${season}-knockout`,
              name: 'Eliminatorias',
              type: 'knockout',
              rounds: knockoutRounds
            };
            phases.push(knockoutPhase);
            
            console.log(`🏆 Fase de eliminatorias creada con ${knockoutRounds.length} rondas`);
          }
        }

      } else {
        // Competición mixta o desconocida
        const leaguePhase: LeaguePhase = {
          id: `${leagueId}-${season}-mixed`,
          name: 'Competición',
          type: 'league',
          matches: allMatches,
          standings: standings
        };
        phases.push(leaguePhase);
        
        console.log(`📊 Fase mixta creada con ${standings.length} equipos en standings`);
      }

    } catch (error) {
      console.warn('⚠️ Error creando fases organizadas:', error);
    }

    return phases;
  }

  /**
   * Determina si una ronda pertenece a la fase de liga
   */
  private isLeaguePhaseRound(round: string): boolean {
    const lowerRound = round.toLowerCase();
    const leagueKeywords = ['group', 'league', 'regular', 'matchday', 'jornada'];
    return leagueKeywords.some(keyword => lowerRound.includes(keyword));
  }

  /**
   * Determina si una ronda pertenece a la fase de eliminatorias (sin playoffs)
   */
  private isKnockoutPhaseRound(round: string): boolean {
    const lowerRound = round.toLowerCase();
    
    // Para Champions League, excluir play-offs y cualificaciones
    const knockoutKeywords = [
      'round of 16', 'round of 32', '1/8', '1/4', '1/2',
      'quarter', 'semi', 'final'
    ];
    
    // Excluir explícitamente playoffs y qualificaciones
    const excludeKeywords = [
      'play-off', 'playoff', 'qualifying', 'qualification', 'qualif'
    ];
    
    // Verificar que NO contenga palabras excluidas
    const hasExcludedWords = excludeKeywords.some(keyword => lowerRound.includes(keyword));
    if (hasExcludedWords) {
      console.log(`🚫 Excluyendo ronda: ${round} (contiene: ${excludeKeywords.find(k => lowerRound.includes(k))})`);
      return false;
    }
    
    // Verificar que SÍ contenga palabras de knockout
    const hasKnockoutWords = knockoutKeywords.some(keyword => lowerRound.includes(keyword));
    if (hasKnockoutWords) {
      console.log(`✅ Incluyendo ronda knockout: ${round}`);
      return true;
    }
    
    return false;
  }

  /**
   * Crea rondas de knockout organizadas
   */
  private createKnockoutRounds(knockoutMatches: Match[], availableRounds: string[]): KnockoutRound[] {
    const rounds: KnockoutRound[] = [];
    
    try {
      // Agrupar partidos por ronda
      const matchesByRound = knockoutMatches.reduce((groups, match) => {
        const roundName = match.round;
        if (!groups[roundName]) {
          groups[roundName] = [];
        }
        groups[roundName].push(match);
        return groups;
      }, {} as Record<string, Match[]>);
      
      // Ordenar rondas según prioridad estándar
      const sortedRounds = this.sortKnockoutRounds(Object.keys(matchesByRound));
      
      sortedRounds.forEach(roundName => {
        rounds.push({
          id: this.generateRoundId(roundName),
          name: roundName,
          matches: matchesByRound[roundName]
        });
      });
      
    } catch (error) {
      console.warn('⚠️ Error creando rondas de knockout:', error);
    }
    
    return rounds;
  }

  /**
   * Ordena las rondas de knockout por prioridad
   */
  private sortKnockoutRounds(rounds: string[]): string[] {
    const priority = {
      'play-off': 1,
      'playoff': 1,
      'round of 32': 2,
      'round of 16': 3,
      '1/8': 3,
      'quarter': 4,
      '1/4': 4,
      'semi': 5,
      '1/2': 5,
      'final': 6
    };

    return rounds.sort((a, b) => {
      const getPriority = (round: string) => {
        const lower = round.toLowerCase();
        for (const [key, value] of Object.entries(priority)) {
          if (lower.includes(key)) return value;
        }
        return 999; // Rondas no reconocidas al final
      };

      return getPriority(a) - getPriority(b);
    });
  }

  /**
   * Genera ID único para una ronda
   */
  private generateRoundId(roundName: string): string {
    return roundName.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/-+/g, '-');
  }

  /**
   * Determina el tipo de competición basado en el ID de la liga
   */
  private determineCompetitionType(leagueId: number): 'league' | 'cup' | 'mixed' {
    const cupCompetitions = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; // Champions, Europa League, etc.
    const leagueCompetitions = [39, 140, 135, 78, 61]; // Premier, La Liga, etc.
    
    if (cupCompetitions.includes(leagueId)) return 'cup';
    if (leagueCompetitions.includes(leagueId)) return 'league';
    return 'mixed';
  }

  /**
   * Obtiene partidos filtrados
   */
  async getMatches(params: {
    league?: number;
    season?: number;
    team?: number;
    status?: string;
    date?: string;
    from?: string;
    to?: string;
    round?: string;
  }): Promise<Match[]> {
    try {
      const response = await this.makeRequest('/fixtures', params);
      return safeTransform(transformFixturesResponse, response);
    } catch (error) {
      console.error('❌ Error obteniendo partidos:', error);
      return [];
    }
  }

  /**
   * Obtiene partidos en vivo
   */
  async getLiveMatches(): Promise<Match[]> {
    try {
      const response = await this.makeRequest('/fixtures', { live: 'all' });
      return safeTransform(transformFixturesResponse, response);
    } catch (error) {
      console.error('❌ Error obteniendo partidos en vivo:', error);
      return [];
    }
  }

  /**
   * Obtiene clasificación de una liga
   */
  async getStandings(league: number, season: number): Promise<StandingEntry[]> {
    try {
      const response = await this.makeRequest('/standings', { league, season });
      return safeTransform(transformStandingsResponse, response);
    } catch (error) {
      console.error('❌ Error obteniendo clasificación:', error);
      return [];
    }
  }

  /**
   * Obtiene las rondas disponibles de una competición
   */
  async getRounds(league: number, season: number): Promise<string[]> {
    try {
      const response = await this.makeRequest('/rounds', { league, season });
      return safeTransform(transformRoundsResponse, response);
    } catch (error) {
      console.error('❌ Error obteniendo rondas:', error);
      return [];
    }
  }
}

export default new FootballService();