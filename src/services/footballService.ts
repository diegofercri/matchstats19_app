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
   *
   * @param endpoint - API endpoint to call
   * @param params - Query parameters for the request
   * @returns Promise with API response data
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
   * Gets main competitions (Champions League and LaLiga for testing)
   *
   * @returns Promise with array of main competitions
   */
  async getMainCompetitions(): Promise<Competition[]> {
    try {
      const mainLeagueIds = [2, 140]; // Champions League, LaLiga
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

            const competition = mapCompetition(leagueData.league, seasons);
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
   *
   * @param competitionId - Competition ID to fetch data for
   * @returns Promise with complete competition data or null if not found
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

      const competition = mapCompetition(leagueData.league, seasons);

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
   *
   * @param leagueId - League ID
   * @param seasonData - Season raw data from API
   * @param coverage - Coverage information for the league
   * @returns Promise with complete season data
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

      // 5. Structure into phases according to competition type
      const competitionType = this.determineCompetitionType(leagueId);

      // Assign basic data for compatibility
      season.matches = allMatches;
      season.standings = standings;

      // Create organized phases
      season.phases = await this.buildOrganizedPhases(
        leagueId,
        seasonData.year,
        competitionType,
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
   * Builds organized phases according to competition type
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
      if (competitionType === "league") {
        // Liga tradicional - todos los partidos van a la fase de liga
        const leaguePhase: LeaguePhase = {
          id: `${leagueId}-${season}-league`,
          name: "Liga",
          type: "league",
          matches: allMatches,
          standings: standings,
        };
        phases.push(leaguePhase);
        
      } else if (competitionType === "cup") {
        // Copa - separar en fases de grupos/liga y eliminatorias

        // Fase de grupos/liga
        const leagueMatches = allMatches.filter((match) =>
          this.isLeaguePhaseRound(match.round)
        );

        // Agregar fase de liga solo si hay partidos o clasificación
        if (leagueMatches.length > 0 || standings.length > 0) {
          const leaguePhase: LeaguePhase = {
            id: `${leagueId}-${season}-league`,
            name: "Fase de Liga",
            type: "league",
            matches: leagueMatches,
            standings: standings,
          };
          phases.push(leaguePhase);
        }

        // Fase eliminatoria
        const knockoutMatches = allMatches.filter((match) =>
          this.isKnockoutPhaseRound(match.round)
        );

        if (knockoutMatches.length > 0) {
          const knockoutRounds = this.createKnockoutRounds(
            knockoutMatches,
            rounds
          );

          if (knockoutRounds.length > 0) {
            const knockoutPhase: KnockoutPhase = {
              id: `${leagueId}-${season}-knockout`,
              name: "Eliminatorias",
              type: "knockout",
              rounds: knockoutRounds,
            };
            phases.push(knockoutPhase);
          }
        }
        
      } else {
        // Competición mixta o desconocida
        const mixedPhase: LeaguePhase = {
          id: `${leagueId}-${season}-mixed`,
          name: "Competición",
          type: "league",
          matches: allMatches,
          standings: standings,
        };
        phases.push(mixedPhase);
      }
    } catch (error) {
      // Fallback: crear una fase básica con todos los partidos
      const fallbackPhase: LeaguePhase = {
        id: `${leagueId}-${season}-fallback`,
        name: "Todos los Partidos",
        type: "league", 
        matches: allMatches,
        standings: standings,
      };
      phases.push(fallbackPhase);
    }

    return phases;
  }

  /**
   * Determines if a round belongs to league phase
   */
  private isLeaguePhaseRound(round: string): boolean {
    const lowerRound = round.toLowerCase();
    const leagueKeywords = [
      "group",
      "league", 
      "regular",
      "regular season",
      "matchday",
      "jornada",
      "gameweek",
      "week",
    ];
    
    // Para La Liga y ligas similares
    if (lowerRound.includes("regular season")) {
      return true;
    }
    
    // Para grupos de Champions League
    if (lowerRound.includes("group") || lowerRound.includes("league stage")) {
      return true;
    }
    
    // Para ligas que usan solo números
    const isSimpleNumber = /^(round\s+)?\d+$/.test(lowerRound.trim());
    if (isSimpleNumber) {
      return true;
    }
    
    return leagueKeywords.some((keyword) => lowerRound.includes(keyword));
  }

  /**
   * Determines if a round belongs to knockout phase
   */
  private isKnockoutPhaseRound(round: string): boolean {
    const lowerRound = round.toLowerCase();

    const knockoutKeywords = [
      "round of 16",
      "round of 32", 
      "1st qualifying",
      "2nd qualifying", 
      "3rd qualifying",
      "play-off",
      "playoff",
      "1/8",
      "1/4", 
      "1/2",
      "quarter",
      "semi",
      "final",
      "qualifying round",
    ];

    // Patrones específicos para qualifying rounds
    const qualifyingPatterns = [
      /\d+(st|nd|rd|th)\s+qualifying/,
      /qualifying\s+round/,
      /play-off/
    ];

    // Verificar patrones de qualifying
    const hasQualifyingPattern = qualifyingPatterns.some(pattern => 
      pattern.test(lowerRound)
    );
    
    if (hasQualifyingPattern) {
      return true;
    }

    // Verificar keywords normales de knockout
    const hasKnockoutWords = knockoutKeywords.some((keyword) =>
      lowerRound.includes(keyword)
    );
    
    return hasKnockoutWords;
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
      "1st qualifying": 1,
      "2nd qualifying": 2,
      "3rd qualifying": 3,
      "play-off": 4,
      playoff: 4,
      "round of 32": 5,
      "round of 16": 6,
      "1/8": 6,
      quarter: 7,
      "1/4": 7,
      semi: 8,
      "1/2": 8,
      final: 9,
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
   * Determines competition type based on league ID
   */
  private determineCompetitionType(
    leagueId: number
  ): "league" | "cup" | "mixed" {
    // Copas europeas y nacionales
    const cupCompetitions = [
      2,   // Champions League
      3,   // Europa League 
      4,   // Europa Conference League
      5,   // UEFA Nations League
      6,   // UEFA Super Cup
      7,   // UEFA Euro Championship
      8,   // World Cup
      9,   // Copa América
      10,  // African Cup of Nations
      11,  // Asian Cup
      12,  // CONCACAF Gold Cup
      14,  // Copa del Rey (España)
      15,  // Coupe de France
      16,  // FA Cup (Inglaterra)
      17,  // DFB Pokal (Alemania)
      18,  // Coppa Italia
    ];
    
    // Ligas nacionales principales
    const leagueCompetitions = [
      39,  // Premier League
      140, // La Liga
      135, // Serie A
      78,  // Bundesliga
      61,  // Ligue 1
      94,  // Primeira Liga
      88,  // Eredivisie
      144, // Belgian Pro League
      203, // Turkish Süper Lig
      218, // Saudi Pro League
    ];

    if (cupCompetitions.includes(leagueId)) return "cup";
    if (leagueCompetitions.includes(leagueId)) return "league";
    return "mixed";
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