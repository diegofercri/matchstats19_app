// services/footballService.ts
import Constants from "expo-constants";
import {
  Competition,
  Season,
  Team,
  Match,
  StandingEntry,
  LeaguePhase,
  KnockoutPhase,
  GroupPhase,
  Group,
  KnockoutRound,
} from "@/types";
import {
  transformFixturesResponse,
  transformStandingsResponse,
  transformTeamsResponse,
  transformRoundsResponse,
  mapCompetition,
  mapSeason,
  safeTransform,
} from "@/mappers/apiFootballMappers";

const API_BASE_URL = "https://v3.football.api-sports.io";

/**
 * Service class for handling football API operations
 * Provides methods to fetch competitions, matches, standings, and other football data
 */
class FootballService {
  private headers: Record<string, string>;

  constructor() {
    const apiKey = Constants.expoConfig?.extra?.apiFootballKey;
    const apiHost = Constants.expoConfig?.extra?.apiFootballHost;

    if (!apiKey) {
      throw new Error(
        "API_FOOTBALL_KEY no está configurada en variables de entorno. Verifica tu app.config.js"
      );
    }

    this.headers = {
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": apiHost || "v3.football.api-sports.io",
      "Content-Type": "application/json",
    };
  }

  /**
   * Makes HTTP request to football API with error handling
   */
  private async makeRequest(
    endpoint: string,
    params: Record<string, any> = {}
  ): Promise<any> {
    try {
      const queryParams = new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = String(value);
          }
          return acc;
        }, {} as Record<string, string>)
      ).toString();

      const url = `${API_BASE_URL}${endpoint}${
        queryParams ? `?${queryParams}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Gets main competitions
   */
  async getMainCompetitions(): Promise<Competition[]> {
    try {
      const mainLeagueIds = [2, 140, 3, 1, 143]; // Incluir más competiciones para testing
      const competitions: Competition[] = [];

      for (const leagueId of mainLeagueIds) {
        try {
          const leagueResponse = await this.makeRequest("/leagues", {
            id: leagueId,
          });

          if (leagueResponse.response && leagueResponse.response.length > 0) {
            const leagueData = leagueResponse.response[0];

            // Create basic seasons (only the most recent)
            const seasons =
              leagueData.seasons
                ?.slice(-2)
                .map((season: any) => mapSeason(season, leagueId.toString())) ||
              [];

            const competition = mapCompetition(leagueData.league, seasons, leagueData.country);
            competitions.push(competition);
          }
        } catch (error) {
          // Continue with other leagues if one fails
        }
      }

      return competitions;
    } catch (error) {
      throw new Error("Error al obtener las competiciones principales");
    }
  }

  /**
   * Gets complete data for a specific competition
   */
  async getCompetitionData(competitionId: string): Promise<Competition | null> {
    try {
      const leagueId = parseInt(competitionId);
      if (isNaN(leagueId)) {
        throw new Error("ID de competición inválido");
      }

      // Get basic league information
      const leagueResponse = await this.makeRequest("/leagues", {
        id: leagueId,
      });

      if (!leagueResponse.response || leagueResponse.response.length === 0) {
        return null;
      }

      const leagueData = leagueResponse.response[0];

      // Get coverage to know what data is available
      const coverage = leagueData.coverage || {};

      // Create seasons with complete data (only the most recent)
      const seasons: Season[] = [];

      if (leagueData.seasons && leagueData.seasons.length > 0) {
        const recentSeasons = leagueData.seasons.slice(-2); // Las 2 más recientes

        for (const seasonData of recentSeasons) {
          const season = await this.buildCompleteSeasonData(
            leagueId,
            seasonData,
            coverage
          );
          seasons.push(season);
        }
      }

      const competition = mapCompetition(leagueData.league, seasons, leagueData.country);

      // Set competition dates
      if (seasons.length > 0) {
        const latestSeason = seasons[0];
        competition.startDate = latestSeason.startDate;
        competition.endDate = latestSeason.endDate;
      }

      return competition;
    } catch (error) {
      throw new Error("Error al obtener los datos de la competición");
    }
  }

  /**
   * Builds a Season with all its complete data
   */
  private async buildCompleteSeasonData(
    leagueId: number,
    seasonData: any,
    coverage: any
  ): Promise<Season> {
    const season = mapSeason(seasonData, leagueId.toString());

    try {
      // 1. Get teams if available
      let teams: Team[] = [];
      if (coverage.standings !== false) {
        try {
          const teamsResponse = await this.makeRequest("/teams", {
            league: leagueId,
            season: seasonData.year,
          });
          teams = safeTransform(transformTeamsResponse, teamsResponse);
        } catch (error) {
          // Continue without teams if fails
        }
      }
      season.teams = teams;

      // 2. Get all matches
      let allMatches: Match[] = [];
      try {
        const fixturesResponse = await this.makeRequest("/fixtures", {
          league: leagueId,
          season: seasonData.year,
        });
        allMatches = safeTransform(transformFixturesResponse, fixturesResponse);
      } catch (error) {
        // Continue without matches if fails
      }

      // 3. Get standings if available
      let standings: StandingEntry[] = [];
      if (coverage.standings !== false) {
        try {
          const standingsResponse = await this.makeRequest("/standings", {
            league: leagueId,
            season: seasonData.year,
          });

          standings = safeTransform(
            transformStandingsResponse,
            standingsResponse
          );
        } catch (error) {
          // Continue without standings if fails
        }
      }

      // 4. Get rounds to better organize phases
      let rounds: string[] = [];
      try {
        const roundsResponse = await this.makeRequest("/rounds", {
          league: leagueId,
          season: seasonData.year,
        });
        rounds = safeTransform(transformRoundsResponse, roundsResponse);
      } catch (error) {
        // Continue without rounds if fails
      }

      // 5. ANÁLISIS DINÁMICO: Determinar qué fases crear basándose en los datos reales
      // Assign basic data for compatibility
      season.matches = allMatches;
      season.standings = standings;

      // Create organized phases DINÁMICAMENTE
      season.phases = await this.buildDynamicPhases(
        leagueId,
        seasonData.year,
        allMatches,
        standings,
        rounds,
        teams
      );
    } catch (error) {
      // Fallback: ensure minimum structure
      season.matches = season.matches || [];
      season.standings = season.standings || [];
      season.teams = season.teams || [];
      season.phases = [];
    }

    return season;
  }

  /**
   * NUEVA FUNCIÓN: Construye fases dinámicamente basándose en los datos reales
   */
  private async buildDynamicPhases(
    leagueId: number,
    season: number,
    allMatches: Match[],
    standings: StandingEntry[],
    rounds: string[],
    teams: Team[]
  ): Promise<any[]> {
    const phases: any[] = [];

    try {
      console.log(`[DEBUG] Analizando competición ${leagueId} temporada ${season}`);
      console.log(`[DEBUG] Rounds encontrados:`, rounds);
      console.log(`[DEBUG] Total matches:`, allMatches.length);
      console.log(`[DEBUG] Total standings:`, standings.length);

      // PASO 1: Analizar TODA la estructura (rounds + standings + matches)
      const analysis = this.analyzeCompetitionStructure(rounds, standings, allMatches);

      // PASO 2: Separar matches por tipo de fase
      const leagueMatches = allMatches.filter(match => 
        this.isLeagueTypeRound(match.round, analysis)
      );
      
      const knockoutMatches = allMatches.filter(match => 
        this.isKnockoutTypeRound(match.round, analysis)
      );

      console.log(`[DEBUG] League matches:`, leagueMatches.length);
      console.log(`[DEBUG] Knockout matches:`, knockoutMatches.length);

      // PASO 3: Crear fases según el análisis combinado
      
      // 3A. FASE DE GRUPOS/LIGA (si hay partidos de liga O standings)
      if (leagueMatches.length > 0 || standings.length > 0) {
        
        if (analysis.hasTraditionalGroups && analysis.standingsType === 'groups') {
          // Crear fase de grupos tradicionales SOLO si los standings lo confirman
          const groups = await this.createGroupsFromData(
            leagueMatches, 
            teams, 
            standings,
            analysis.detectedGroups
          );
          
          if (groups.length > 0) {
            const groupPhase: GroupPhase = {
              id: `${leagueId}-${season}-groups`,
              name: "Fase de Grupos",
              type: "groups",
              groups: groups,
            };
            phases.push(groupPhase);
            console.log(`[DEBUG] Creada GroupPhase con ${groups.length} grupos`);
          } else {
            // Fallback a liga si no se pudieron crear grupos
            console.log(`[DEBUG] No se pudieron crear grupos, fallback a liga`);
            const leaguePhase: LeaguePhase = {
              id: `${leagueId}-${season}-league`,
              name: "Clasificación",
              type: "league",
              matches: leagueMatches,
              standings: standings,
            };
            phases.push(leaguePhase);
          }
        } else {
          // Crear fase de liga única
          const leaguePhase: LeaguePhase = {
            id: `${leagueId}-${season}-league`,
            name: this.getLeaguePhaseName(analysis),
            type: "league",
            matches: leagueMatches,
            standings: standings,
          };
          phases.push(leaguePhase);
          console.log(`[DEBUG] Creada LeaguePhase: ${leaguePhase.name}`);
        }
      }

      // 3B. FASE ELIMINATORIA (si hay partidos knockout)
      if (knockoutMatches.length > 0) {
        const knockoutRounds = this.createKnockoutRounds(knockoutMatches, rounds);

        if (knockoutRounds.length > 0) {
          const knockoutPhase: KnockoutPhase = {
            id: `${leagueId}-${season}-knockout`,
            name: "Eliminatorias",
            type: "knockout",
            rounds: knockoutRounds,
          };
          phases.push(knockoutPhase);
          console.log(`[DEBUG] Creada KnockoutPhase con ${knockoutRounds.length} rondas`);
        }
      }

      console.log(`[DEBUG] Total fases creadas: ${phases.length}`);
      return phases;

    } catch (error) {
      console.error('Error building dynamic phases:', error);
      
      // Fallback: crear una fase básica con todos los partidos
      const fallbackPhase: LeaguePhase = {
        id: `${leagueId}-${season}-fallback`,
        name: "Competición",
        type: "league", 
        matches: allMatches,
        standings: standings,
      };
      phases.push(fallbackPhase);
      
      return phases;
    }
  }

  /**
   * NUEVA FUNCIÓN: Analiza los rounds Y standings para detectar patrones
   */
  private analyzeCompetitionStructure(
    rounds: string[], 
    standings: StandingEntry[], 
    matches: Match[]
  ): {
    hasTraditionalGroups: boolean;
    hasLeagueStage: boolean;
    hasRegularSeason: boolean;
    hasKnockoutRounds: boolean;
    groupPattern: string | null;
    leaguePattern: string | null;
    standingsType: 'groups' | 'single' | 'none';
    detectedGroups: string[];
  } {
    const analysis = {
      hasTraditionalGroups: false,
      hasLeagueStage: false,
      hasRegularSeason: false,
      hasKnockoutRounds: false,
      groupPattern: null as string | null,
      leaguePattern: null as string | null,
      standingsType: 'none' as 'groups' | 'single' | 'none',
      detectedGroups: [] as string[],
    };

    console.log(`[DEBUG] Analizando estructura:`);
    console.log(`[DEBUG] - Rounds:`, rounds.length);
    console.log(`[DEBUG] - Standings:`, standings.length);
    console.log(`[DEBUG] - Matches:`, matches.length);

    // PASO 1: Analizar STANDINGS para detectar estructura real
    if (standings.length > 0) {
      const standingsAnalysis = this.analyzeStandingsStructure(standings);
      analysis.standingsType = standingsAnalysis.type;
      analysis.detectedGroups = standingsAnalysis.groups;
      
      console.log(`[DEBUG] Standings analysis:`, standingsAnalysis);
      
      // Si los standings están por grupos, es fase de grupos real
      if (standingsAnalysis.type === 'groups' && standingsAnalysis.groups.length >= 2) {
        analysis.hasTraditionalGroups = true;
        analysis.groupPattern = "traditional";
        console.log(`[DEBUG] Grupos detectados en standings:`, standingsAnalysis.groups);
      }
    }

    // PASO 2: Analizar ROUNDS para confirmar o detectar patrones adicionales
    // Detectar grupos tradicionales en rounds (Group A, Group B, etc.)
    const traditionalGroupRounds = rounds.filter(round => {
      const lowerRound = round.toLowerCase();
      return /group\s+[a-h]\s*-\s*\d+/.test(lowerRound) || 
             /group\s+[a-h]$/.test(lowerRound);
    });

    if (traditionalGroupRounds.length > 0) {
      // Verificar que hay múltiples grupos diferentes en rounds
      const uniqueGroupsFromRounds = new Set();
      traditionalGroupRounds.forEach(round => {
        const match = round.match(/group\s+([a-h])/i);
        if (match) {
          uniqueGroupsFromRounds.add(match[1].toLowerCase());
        }
      });
      
      console.log(`[DEBUG] Grupos únicos en rounds:`, Array.from(uniqueGroupsFromRounds));
      
      // Solo confirmar grupos si hay 2 o más grupos únicos EN ROUNDS
      // Y además los standings lo confirman O no hay standings pero sí matches de grupos
      if (uniqueGroupsFromRounds.size >= 2) {
        if (analysis.standingsType === 'groups' || analysis.standingsType === 'none') {
          analysis.hasTraditionalGroups = true;
          analysis.groupPattern = "traditional";
          
          // Si no teníamos grupos detectados en standings, usar los de rounds
          if (analysis.detectedGroups.length === 0) {
            analysis.detectedGroups = Array.from(uniqueGroupsFromRounds).map(g => `Grupo ${(g as string).toUpperCase()}`);
          }
        }
      }
    }

    // PASO 3: Detectar League Stage
    analysis.hasLeagueStage = rounds.some(round => 
      round.toLowerCase().includes('league stage')
    );

    if (analysis.hasLeagueStage) {
      analysis.leaguePattern = "league_stage";
      // League Stage es incompatible con grupos tradicionales
      analysis.hasTraditionalGroups = false;
      analysis.groupPattern = null;
    }

    // PASO 4: Detectar Regular Season
    analysis.hasRegularSeason = rounds.some(round => 
      round.toLowerCase().includes('regular season')
    );

    if (analysis.hasRegularSeason) {
      analysis.leaguePattern = "regular_season";
      // Regular Season es incompatible con grupos tradicionales
      analysis.hasTraditionalGroups = false;
      analysis.groupPattern = null;
    }

    // PASO 5: Detectar eliminatorias
    const knockoutKeywords = [
      'round of', 'quarter', 'semi', 'final', 'qualifying', 'play-off',
      '1st round', '2nd round', '3rd round', 'preliminary'
    ];
    
    analysis.hasKnockoutRounds = rounds.some(round => {
      const lowerRound = round.toLowerCase();
      return knockoutKeywords.some(keyword => lowerRound.includes(keyword));
    });

    console.log(`[DEBUG] Análisis final:`, {
      hasTraditionalGroups: analysis.hasTraditionalGroups,
      hasLeagueStage: analysis.hasLeagueStage,
      hasRegularSeason: analysis.hasRegularSeason,
      standingsType: analysis.standingsType,
      detectedGroups: analysis.detectedGroups.length
    });

    return analysis;
  }

  /**
   * NUEVA FUNCIÓN: Analiza la estructura de los standings
   * Actualizada para manejar la estructura real de la API
   */
  private analyzeStandingsStructure(standings: StandingEntry[]): {
    type: 'groups' | 'single' | 'none';
    groups: string[];
    teamsPerGroup: number;
    apiGroupData?: any; // Para almacenar datos de grupos de la API
  } {
    if (standings.length === 0) {
      return { type: 'none', groups: [], teamsPerGroup: 0 };
    }

    console.log(`[DEBUG] Analizando ${standings.length} standings entries`);

    // MÉTODO 1: Verificar si hay propiedad 'group' en los standings (Champions League style)
    const standingsWithGroup = standings.filter(entry => (entry as any).group);
    
    if (standingsWithGroup.length > 0) {
      console.log(`[DEBUG] Detectadas ${standingsWithGroup.length} entradas con propiedad 'group'`);
      
      // Extraer grupos únicos
      const uniqueGroups = Array.from(new Set(
        standingsWithGroup.map(entry => (entry as any).group)
      )).sort();
      
      // Calcular equipos por grupo
      const teamsPerGroup = standings.length / uniqueGroups.length;
      
      console.log(`[DEBUG] Grupos detectados desde API:`, uniqueGroups);
      console.log(`[DEBUG] Equipos por grupo:`, teamsPerGroup);
      
      return {
        type: 'groups',
        groups: uniqueGroups.map(groupName => 
          groupName.replace('Group ', 'Grupo ')
        ),
        teamsPerGroup: Math.round(teamsPerGroup),
        apiGroupData: uniqueGroups
      };
    }

    // MÉTODO 2: Verificar posiciones duplicadas (método anterior para casos sin propiedad 'group')
    const positionCounts: Record<number, number> = {};
    standings.forEach(entry => {
      positionCounts[entry.position] = (positionCounts[entry.position] || 0) + 1;
    });

    console.log(`[DEBUG] Position counts:`, positionCounts);

    // Si hay múltiples equipos en la misma posición, probablemente son grupos diferentes
    const duplicatePositions = Object.entries(positionCounts)
      .filter(([_, count]) => count > 1)
      .map(([position, count]) => ({ position: parseInt(position), count }));

    console.log(`[DEBUG] Duplicate positions:`, duplicatePositions);

    if (duplicatePositions.length > 0) {
      // Hay múltiples equipos en las mismas posiciones = grupos diferentes
      
      // Calcular cuántos equipos por grupo (basándose en la posición más repetida)
      const maxRepeats = Math.max(...duplicatePositions.map(d => d.count));
      const teamsPerGroup = Math.max(...Object.keys(positionCounts).map(Number));
      
      // Generar nombres de grupos estimados
      const estimatedGroups: string[] = [];
      for (let i = 0; i < maxRepeats; i++) {
        const groupLetter = String.fromCharCode(65 + i); // A, B, C, etc.
        estimatedGroups.push(`Grupo ${groupLetter}`);
      }

      console.log(`[DEBUG] Estructura de grupos detectada por posiciones:`, {
        grupos: maxRepeats,
        equiposPorGrupo: teamsPerGroup,
        grupos_estimados: estimatedGroups
      });

      return {
        type: 'groups',
        groups: estimatedGroups,
        teamsPerGroup: teamsPerGroup
      };
    } else {
      // Todas las posiciones son únicas = tabla única
      console.log(`[DEBUG] Tabla única detectada con ${standings.length} equipos`);
      
      return {
        type: 'single',
        groups: [],
        teamsPerGroup: standings.length
      };
    }
  }

  /**
   * NUEVA FUNCIÓN: Determina si un round es de tipo liga basándose en el análisis
   */
  private isLeagueTypeRound(round: string, analysis: any): boolean {
    const lowerRound = round.toLowerCase();

    // Si hay grupos tradicionales, incluir solo esos
    if (analysis.hasTraditionalGroups) {
      return /group\s+[a-h](\s*-\s*\d+)?/.test(lowerRound);
    }

    // Si hay League Stage, incluir solo esos
    if (analysis.hasLeagueStage) {
      return lowerRound.includes('league stage');
    }

    // Si hay Regular Season, incluir solo esos
    if (analysis.hasRegularSeason) {
      return lowerRound.includes('regular season');
    }

    // Fallback: cualquier round que no sea claramente knockout
    const knockoutKeywords = [
      'round of', 'quarter', 'semi', 'final', 'qualifying', 
      'play-off', '1st round', '2nd round', '3rd round', 'preliminary'
    ];
    
    const isKnockout = knockoutKeywords.some(keyword => lowerRound.includes(keyword));
    return !isKnockout;
  }

  /**
   * NUEVA FUNCIÓN: Determina si un round es de tipo eliminatoria
   */
  private isKnockoutTypeRound(round: string, analysis: any): boolean {
    const lowerRound = round.toLowerCase();

    // Excluir explícitamente rounds de liga
    if (analysis.hasTraditionalGroups && /group\s+[a-h](\s*-\s*\d+)?/.test(lowerRound)) {
      return false;
    }

    if (analysis.hasLeagueStage && lowerRound.includes('league stage')) {
      return false;
    }

    if (analysis.hasRegularSeason && lowerRound.includes('regular season')) {
      return false;
    }

    // Palabras clave de eliminatorias
    const knockoutKeywords = [
      'round of', 'quarter', 'semi', 'final', 'qualifying', 
      'play-off', '1st round', '2nd round', '3rd round', 'preliminary'
    ];
    
    return knockoutKeywords.some(keyword => lowerRound.includes(keyword));
  }

  /**
   * NUEVA FUNCIÓN: Obtiene el nombre apropiado para la fase de liga
   */
  private getLeaguePhaseName(analysis: any): string {
    if (analysis.hasLeagueStage) {
      return "Fase de Liga";
    }
    
    if (analysis.hasRegularSeason) {
      return "Liga";
    }
    
    return "Clasificación";
  }

  /**
   * NUEVA FUNCIÓN: Crea grupos basándose en datos reales (standings + matches)
   */
  private async createGroupsFromData(
    matches: Match[], 
    teams: Team[], 
    standings: StandingEntry[],
    detectedGroupNames: string[]
  ): Promise<Group[]> {
    const groups: Group[] = [];

    try {
      if (detectedGroupNames.length === 0) {
        console.log(`[DEBUG] No hay nombres de grupos detectados`);
        return [];
      }

      // Método 1: Si tenemos standings con posiciones duplicadas, usarlos para dividir
      if (standings.length > 0) {
        const groupsFromStandings = this.createGroupsFromStandings(standings, detectedGroupNames);
        
        if (groupsFromStandings.length > 0) {
          // Asignar matches a cada grupo
          groupsFromStandings.forEach(group => {
            const groupTeamIds = new Set(group.teams.map(team => team.id));
            group.matches = matches.filter(match => 
              groupTeamIds.has(match.homeTeam.id) && groupTeamIds.has(match.awayTeam.id)
            );
          });
          
          console.log(`[DEBUG] Grupos creados desde standings:`, groupsFromStandings.length);
          return groupsFromStandings;
        }
      }

      // Método 2: Fallback - crear grupos desde matches si no funcionó standings
      const groupsFromMatches = this.createGroupsFromMatches(matches, teams, standings);
      console.log(`[DEBUG] Grupos creados desde matches:`, groupsFromMatches.length);
      return groupsFromMatches;

    } catch (error) {
      console.error('Error creating groups from data:', error);
      return [];
    }
  }

  /**
   * NUEVA FUNCIÓN: Crea grupos basándose en standings con propiedad 'group' de la API
   */
  private createGroupsFromStandings(standings: StandingEntry[], groupNames: string[]): Group[] {
    const groups: Group[] = [];

    try {
      // MÉTODO 1: Si los standings tienen propiedad 'group', usarla directamente
      const standingsWithGroup = standings.filter(entry => (entry as any).group);
      
      if (standingsWithGroup.length > 0) {
        console.log(`[DEBUG] Creando grupos desde propiedad 'group' de la API`);
        
        // Agrupar por la propiedad 'group'
        const standingsByGroup: Record<string, StandingEntry[]> = {};
        
        standingsWithGroup.forEach(entry => {
          const groupKey = (entry as any).group;
          if (!standingsByGroup[groupKey]) {
            standingsByGroup[groupKey] = [];
          }
          standingsByGroup[groupKey].push(entry);
        });

        // Crear grupos ordenados alfabéticamente
        const sortedGroupKeys = Object.keys(standingsByGroup).sort();
        
        sortedGroupKeys.forEach(groupKey => {
          const groupStandings = standingsByGroup[groupKey];
          const groupTeams = groupStandings.map(standing => standing.team);
          
          // Convertir nombre del grupo (Group A -> Grupo A)
          const groupName = groupKey.replace('Group ', 'Grupo ');
          
          groups.push({
            id: this.generateGroupId(groupName),
            name: groupName,
            teams: groupTeams,
            matches: [], // Se asignarán después
            standings: groupStandings,
          });
        });

        console.log(`[DEBUG] Grupos creados desde API:`, groups.map(g => `${g.name} (${g.teams.length} equipos)`));
        return groups;
      }

      // MÉTODO 2: Fallback - usar método anterior por posiciones duplicadas
      console.log(`[DEBUG] Fallback: creando grupos por posiciones duplicadas`);
      
      // Agrupar standings por posición
      const standingsByPosition: Record<number, StandingEntry[]> = {};
      standings.forEach(entry => {
        if (!standingsByPosition[entry.position]) {
          standingsByPosition[entry.position] = [];
        }
        standingsByPosition[entry.position].push(entry);
      });

      // Encontrar la posición con más repeticiones para determinar estructura
      const positionCounts = Object.entries(standingsByPosition)
        .map(([position, entries]) => ({ position: parseInt(position), count: entries.length }))
        .sort((a, b) => b.count - a.count);

      if (positionCounts.length === 0 || positionCounts[0].count === 1) {
        console.log(`[DEBUG] No hay posiciones duplicadas en standings`);
        return [];
      }

      const numGroups = positionCounts[0].count;
      const teamsPerGroup = Math.max(...Object.keys(standingsByPosition).map(Number));

      console.log(`[DEBUG] Detectados ${numGroups} grupos con ${teamsPerGroup} equipos cada uno`);

      // Crear grupos distribuyendo equipos por posición
      for (let groupIndex = 0; groupIndex < numGroups; groupIndex++) {
        const groupName = groupNames[groupIndex] || `Grupo ${String.fromCharCode(65 + groupIndex)}`;
        const groupStandings: StandingEntry[] = [];
        const groupTeams: Team[] = [];

        // Para cada posición, tomar el equipo correspondiente a este grupo
        for (let position = 1; position <= teamsPerGroup; position++) {
          const teamsAtPosition = standingsByPosition[position] || [];
          if (teamsAtPosition.length > groupIndex) {
            const standingEntry = teamsAtPosition[groupIndex];
            groupStandings.push(standingEntry);
            groupTeams.push(standingEntry.team);
          }
        }

        if (groupStandings.length > 0) {
          groups.push({
            id: this.generateGroupId(groupName),
            name: groupName,
            teams: groupTeams,
            matches: [], // Se asignarán después
            standings: groupStandings,
          });
        }
      }

      console.log(`[DEBUG] Grupos creados por posiciones:`, groups.map(g => `${g.name} (${g.teams.length} equipos)`));
      return groups;

    } catch (error) {
      console.error('Error creating groups from standings:', error);
      return [];
    }
  }

  /**
   * Crea grupos a partir de los partidos (método fallback)
   */
  private createGroupsFromMatches(
    matches: Match[], 
    teams: Team[], 
    standings: StandingEntry[]
  ): Group[] {
    const groups: Group[] = [];

    try {
      // Agrupar partidos por grupo (extraer grupo del round)
      const matchesByGroup = this.groupMatchesByGroup(matches);
      
      for (const [groupName, groupMatches] of Object.entries(matchesByGroup)) {
        // Obtener equipos de este grupo
        const groupTeamIds = new Set<string>();
        groupMatches.forEach(match => {
          groupTeamIds.add(match.homeTeam.id);
          groupTeamIds.add(match.awayTeam.id);
        });
        
        const groupTeams = teams.filter(team => groupTeamIds.has(team.id));
        
        // Obtener standings de este grupo
        const groupStandings = standings.filter(standing => 
          groupTeamIds.has(standing.team.id)
        );

        groups.push({
          id: this.generateGroupId(groupName),
          name: groupName,
          teams: groupTeams,
          matches: groupMatches,
          standings: groupStandings,
        });
      }
    } catch (error) {
      console.error('Error creating groups from matches:', error);
    }

    return groups;
  }

  /**
   * Agrupa partidos por grupo extrayendo el nombre del grupo del round
   */
  private groupMatchesByGroup(matches: Match[]): Record<string, Match[]> {
    const grouped: Record<string, Match[]> = {};

    matches.forEach(match => {
      const groupName = this.extractGroupName(match.round);
      
      if (!grouped[groupName]) {
        grouped[groupName] = [];
      }
      
      grouped[groupName].push(match);
    });

    return grouped;
  }

  /**
   * Extrae el nombre del grupo del round
   */
  private extractGroupName(round: string): string {
    // Patrones comunes para extraer grupo
    const patterns = [
      /group\s+([a-h])\s*-\s*\d+/i,     // "Group A - 1", "Group B - 2", etc.
      /group\s+([a-h])/i,               // "Group A", "Group B", etc.
    ];

    for (const pattern of patterns) {
      const match = round.match(pattern);
      if (match) {
        return `Grupo ${match[1].toUpperCase()}`;
      }
    }

    // Fallback
    return 'Grupo Único';
  }

  /**
   * Genera ID único para un grupo
   */
  private generateGroupId(groupName: string): string {
    return groupName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
      .replace(/-+/g, "-");
  }

  /**
   * Creates organized knockout rounds
   */
  private createKnockoutRounds(
    knockoutMatches: Match[],
    availableRounds: string[]
  ): KnockoutRound[] {
    const rounds: KnockoutRound[] = [];

    try {
      // Group matches by round
      const matchesByRound = knockoutMatches.reduce((groups, match) => {
        const roundName = match.round;
        if (!groups[roundName]) {
          groups[roundName] = [];
        }
        groups[roundName].push(match);
        return groups;
      }, {} as Record<string, Match[]>);

      // Sort rounds according to standard priority
      const sortedRounds = this.sortKnockoutRounds(Object.keys(matchesByRound));

      sortedRounds.forEach((roundName) => {
        rounds.push({
          id: this.generateRoundId(roundName),
          name: roundName,
          matches: matchesByRound[roundName],
        });
      });
    } catch (error) {
      // Continue with empty rounds if creation fails
    }

    return rounds;
  }

  /**
   * Sorts knockout rounds by priority
   */
  private sortKnockoutRounds(rounds: string[]): string[] {
    const priority = {
      "preliminary round": 0,
      "preliminary": 0,
      "1st qualifying round": 1,
      "1st qualifying": 1,
      "2nd qualifying round": 2,
      "2nd qualifying": 2,
      "3rd qualifying round": 3,
      "3rd qualifying": 3,
      "play-off": 4,
      "playoff": 4,
      "1st round": 5,
      "2nd round": 6,
      "3rd round": 7,
      "round of 32": 8,
      "round of 16": 9,
      "1/8": 9,
      "knockout round play-offs": 10,
      "quarter": 11,
      "quarter-finals": 11,
      "1/4": 11,
      "semi": 12,
      "semi-finals": 12,
      "1/2": 12,
      "final": 13,
    };

    return rounds.sort((a, b) => {
      const getPriority = (round: string) => {
        const lower = round.toLowerCase();
        for (const [key, value] of Object.entries(priority)) {
          if (lower.includes(key)) return value;
        }
        return 999;
      };

      return getPriority(a) - getPriority(b);
    });
  }

  /**
   * Generates unique ID for a round
   */
  private generateRoundId(roundName: string): string {
    return roundName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
      .replace(/-+/g, "-");
  }

  /**
   * Gets filtered matches
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
      const response = await this.makeRequest("/fixtures", params);
      return safeTransform(transformFixturesResponse, response);
    } catch (error) {
      return [];
    }
  }

  /**
   * Gets live matches
   */
  async getLiveMatches(): Promise<Match[]> {
    try {
      const response = await this.makeRequest("/fixtures", { live: "all" });
      return safeTransform(transformFixturesResponse, response);
    } catch (error) {
      return [];
    }
  }

  /**
   * Gets league standings
   */
  async getStandings(league: number, season: number): Promise<StandingEntry[]> {
    try {
      const response = await this.makeRequest("/standings", { league, season });
      return safeTransform(transformStandingsResponse, response);
    } catch (error) {
      return [];
    }
  }

  /**
   * Gets available rounds for a competition
   */
  async getRounds(league: number, season: number): Promise<string[]> {
    try {
      const response = await this.makeRequest("/rounds", { league, season });
      return safeTransform(transformRoundsResponse, response);
    } catch (error) {
      return [];
    }
  }
}

export default new FootballService();