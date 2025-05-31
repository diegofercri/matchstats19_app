// mappers/apiFootballMappers.ts
import {
  Competition,
  Season,
  Team,
  Match,
  MatchStatus,
  StandingEntry,
  TeamInMatch,
  FormResult
} from '@/types';

/**
 * Maps API-Football status to application MatchStatus
 * Handles all possible match states from the external API
 * 
 * @param apiStatus - Status code from API-Football
 * @returns Mapped MatchStatus for internal use
 */
const mapMatchStatus = (apiStatus: string): MatchStatus => {
  const statusMap: { [key: string]: MatchStatus } = {
    // Scheduled
    'TBD': 'PROGRAMADO',     // Time To Be Defined
    'NS': 'PROGRAMADO',      // Not Started
    'PST': 'PROGRAMADO',     // Match Postponed
    'CANC': 'PROGRAMADO',    // Match Cancelled
    
    // In Play
    '1H': 'JUGANDO',         // First Half
    '2H': 'JUGANDO',         // Second Half
    'ET': 'JUGANDO',         // Extra Time
    'P': 'JUGANDO',          // Penalty In Progress
    'SUSP': 'JUGANDO',       // Match Suspended
    'INT': 'JUGANDO',        // Match Interrupted
    'LIVE': 'JUGANDO',       // In Progress (rare)
    
    // Halftime / Break
    'HT': 'DESCANSO',        // Halftime
    'BT': 'DESCANSO',        // Break Time (extra time)
    
    // Finished
    'FT': 'FINALIZADO',      // Match Finished
    'AET': 'FINALIZADO',     // Match Finished After Extra Time
    'PEN': 'FINALIZADO',     // Match Finished After Penalty
    'ABD': 'FINALIZADO',     // Match Abandoned
    'AWD': 'FINALIZADO',     // Technical Loss
    'WO': 'FINALIZADO'       // WalkOver
  };
  
  return statusMap[apiStatus] || 'PROGRAMADO';
};

/**
 * Maps API-Football team to application Team interface
 * 
 * @param apiTeam - Team data from API-Football
 * @returns Mapped Team object
 */
export const mapTeam = (apiTeam: any): Team => ({
  id: apiTeam.id.toString(),
  name: apiTeam.name,
  logo: apiTeam.logo || ''
});

/**
 * Maps API-Football team in match context to TeamInMatch interface
 * 
 * @param apiTeam - Team data from API-Football
 * @param goals - Goals scored by the team
 * @returns Mapped TeamInMatch object
 */
export const mapTeamInMatch = (apiTeam: any, goals: number | null): TeamInMatch => ({
  id: apiTeam.id.toString(),
  name: apiTeam.name,
  logo: apiTeam.logo || '',
  score: goals
});

/**
 * Maps API-Football league to application Competition interface
 * 
 * @param apiLeague - League data from API-Football
 * @param seasons - Array of mapped seasons for the competition
 * @returns Mapped Competition object
 */
export const mapCompetition = (apiLeague: any, seasons: Season[] = []): Competition => ({
  id: apiLeague.id.toString(),
  name: apiLeague.name,
  image: apiLeague.logo || '',
  description: `${apiLeague.name} - ${apiLeague.country?.name || ''}`,
  startDate: '', // API-Football doesn't have this in leagues, obtained from seasons
  endDate: '',   // API-Football doesn't have this in leagues, obtained from seasons
  seasons: seasons,
  defaultSeasonId: seasons.length > 0 ? seasons[seasons.length - 1].id : undefined
});

/**
 * Maps API-Football season to application Season interface
 * 
 * @param apiSeason - Season data from API-Football
 * @param leagueId - League identifier for generating season ID
 * @returns Mapped Season object
 */
export const mapSeason = (apiSeason: any, leagueId: string): Season => ({
  id: `${leagueId}-${apiSeason.year}`,
  name: apiSeason.year.toString(),
  startDate: apiSeason.start || '',
  endDate: apiSeason.end || '',
  teams: [], // Will be filled later with another API call
  phases: [], // Will be mapped according to competition structure
  // Legacy fields for compatibility
  matches: [],
  standings: []
});

/**
 * Maps API-Football fixture to application Match interface
 * 
 * @param apiFixture - Fixture data from API-Football
 * @returns Mapped Match object
 */
export const mapMatch = (apiFixture: any): Match => {
  const fixtureDate = new Date(apiFixture.fixture.date);
  
  return {
    id: apiFixture.fixture.id.toString(),
    date: fixtureDate.toISOString().split('T')[0], // YYYY-MM-DD
    time: fixtureDate.toTimeString().slice(0, 5),  // HH:MM
    round: apiFixture.league.round || 'Jornada',
    homeTeam: mapTeamInMatch(
      apiFixture.teams.home, 
      apiFixture.goals.home
    ),
    awayTeam: mapTeamInMatch(
      apiFixture.teams.away, 
      apiFixture.goals.away
    ),
    status: mapMatchStatus(apiFixture.fixture.status.short)
  };
};

/**
 * Maps team form string to FormResult array
 * Converts W/D/L format to Spanish G/E/P format
 * 
 * @param formString - Form string from API (e.g., "WWDLL")
 * @returns Array of FormResult values
 */
const mapForm = (formString: string): FormResult[] => {
  if (!formString) return [];
  
  return formString.split('').map(char => {
    switch (char) {
      case 'W': return 'G'; // Win -> Ganado
      case 'D': return 'E'; // Draw -> Empatado
      case 'L': return 'P'; // Loss -> Perdido
      default: return 'E';
    }
  });
};

/**
 * Maps API-Football standing to application StandingEntry interface
 * 
 * @param apiStanding - Standing data from API-Football
 * @returns Mapped StandingEntry object
 */
export const mapStandingEntry = (apiStanding: any): StandingEntry => {
  const mapped = {
    position: apiStanding.rank,
    team: mapTeam(apiStanding.team),
    played: apiStanding.all.played,
    won: apiStanding.all.win,
    drawn: apiStanding.all.draw,
    lost: apiStanding.all.lose,
    goalsFor: apiStanding.all.goals.for,
    goalsAgainst: apiStanding.all.goals.against,
    goalDifference: apiStanding.goalsDiff,
    points: apiStanding.points,
    form: mapForm(apiStanding.form)
  };
  
  return mapped;
};

/**
 * Complete transformation functions for API responses
 */

/**
 * Transforms API-Football leagues response to Competition array
 * 
 * @param apiResponse - Raw API response for leagues
 * @returns Array of mapped Competition objects
 */
export const transformLeaguesResponse = (apiResponse: any): Competition[] => {
  if (!apiResponse.response) return [];
  
  return apiResponse.response.map((item: any) => {
    // Create basic seasons (can be expanded later)
    const seasons = item.seasons?.map((season: any) => 
      mapSeason(season, item.league.id)
    ) || [];
    
    return mapCompetition(item.league, seasons);
  });
};

/**
 * Transforms API-Football fixtures response to Match array
 * 
 * @param apiResponse - Raw API response for fixtures
 * @returns Array of mapped Match objects
 */
export const transformFixturesResponse = (apiResponse: any): Match[] => {
  if (!apiResponse.response) return [];
  
  return apiResponse.response.map((fixture: any) => mapMatch(fixture));
};

/**
 * Transforms API-Football standings response to StandingEntry array
 * Handles group-based standings structure from the API
 * 
 * @param apiResponse - Raw API response for standings
 * @returns Array of mapped StandingEntry objects
 */
export const transformStandingsResponse = (apiResponse: any): StandingEntry[] => {
  if (!apiResponse.response || !apiResponse.response[0]?.league?.standings) {
    return [];
  }
  
  // API-Football returns an array of leagues, each league has an array of standings
  // Each standing can have multiple groups (for competitions with groups)
  const league = apiResponse.response[0];
  const standingsGroups = league.league.standings; // Array of groups
  
  // For normal leagues, take the first group
  // For competitions with groups, we could expand this
  if (standingsGroups && standingsGroups.length > 0) {
    const firstGroup = standingsGroups[0]; // First group (main league)
    
    return firstGroup.map((standing: any) => {
      const transformed = mapStandingEntry(standing);
      return transformed;
    });
  }
  
  return [];
};

/**
 * Transforms API-Football teams response to Team array
 * 
 * @param apiResponse - Raw API response for teams
 * @returns Array of mapped Team objects
 */
export const transformTeamsResponse = (apiResponse: any): Team[] => {
  if (!apiResponse.response) return [];
  
  return apiResponse.response.map((item: any) => mapTeam(item.team));
};

/**
 * Helper function to handle transformation errors safely
 * Provides fallback behavior when transformation fails
 * 
 * @param transformer - Transformation function to execute
 * @param apiResponse - Raw API response to transform
 * @param fallback - Fallback value if transformation fails
 * @returns Transformed data or fallback value
 */
export const safeTransform = <T>(
  transformer: (data: any) => T[], 
  apiResponse: any,
  fallback: T[] = []
): T[] => {
  try {
    return transformer(apiResponse);
  } catch (error) {
    return fallback;
  }
};

/**
 * Transforms API-Football rounds response to string array
 * 
 * @param apiResponse - Raw API response for rounds
 * @returns Array of round names
 */
export const transformRoundsResponse = (apiResponse: any): string[] => {
  if (!apiResponse.response) return [];
  
  return apiResponse.response.map((round: string) => round);
};