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

// Mapear status de API-Football a tu MatchStatus (actualizado con documentación completa)
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

// Mapear team de API-Football a tu Team
export const mapTeam = (apiTeam: any): Team => ({
  id: apiTeam.id.toString(),
  name: apiTeam.name,
  logo: apiTeam.logo || ''
});

// Mapear team en match de API-Football a tu TeamInMatch
export const mapTeamInMatch = (apiTeam: any, goals: number | null): TeamInMatch => ({
  id: apiTeam.id.toString(),
  name: apiTeam.name,
  logo: apiTeam.logo || '',
  score: goals
});

// Mapear liga de API-Football a tu Competition
export const mapCompetition = (apiLeague: any, seasons: Season[] = []): Competition => ({
  id: apiLeague.id.toString(),
  name: apiLeague.name,
  image: apiLeague.logo || '',
  description: `${apiLeague.name} - ${apiLeague.country?.name || ''}`,
  startDate: '', // API-Football no tiene esto en leagues, se obtiene de seasons
  endDate: '',   // API-Football no tiene esto en leagues, se obtiene de seasons
  seasons: seasons,
  defaultSeasonId: seasons.length > 0 ? seasons[seasons.length - 1].id : undefined
});

// Mapear temporada de API-Football a tu Season
export const mapSeason = (apiSeason: any, leagueId: string): Season => ({
  id: `${leagueId}-${apiSeason.year}`,
  name: apiSeason.year.toString(),
  startDate: apiSeason.start || '',
  endDate: apiSeason.end || '',
  teams: [], // Se llenarán después con otra llamada a la API
  phases: [], // Se mapearán según la estructura de tu competición
  // Campos legacy para compatibilidad
  matches: [],
  standings: []
});

// Mapear fixture de API-Football a tu Match
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

// Mapear forma de equipo (últimos resultados)
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

// Mapear standing de API-Football a tu StandingEntry
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
  
  console.log(`🔄 Mapeando: ${mapped.team.name} - Pos: ${mapped.position} - Pts: ${mapped.points}`);
  return mapped;
};

// Funciones de transformación completas para respuestas de la API

export const transformLeaguesResponse = (apiResponse: any): Competition[] => {
  if (!apiResponse.response) return [];
  
  return apiResponse.response.map((item: any) => {
    // Crear seasons básicas (se pueden expandir después)
    const seasons = item.seasons?.map((season: any) => 
      mapSeason(season, item.league.id)
    ) || [];
    
    return mapCompetition(item.league, seasons);
  });
};

export const transformFixturesResponse = (apiResponse: any): Match[] => {
  if (!apiResponse.response) return [];
  
  return apiResponse.response.map((fixture: any) => mapMatch(fixture));
};

export const transformStandingsResponse = (apiResponse: any): StandingEntry[] => {
  if (!apiResponse.response || !apiResponse.response[0]?.league?.standings) {
    return [];
  }
  
  // API-Football devuelve un array de leagues, cada league tiene un array de standings
  // Cada standing puede tener múltiples grupos (para competiciones con grupos)
  const league = apiResponse.response[0];
  const standingsGroups = league.league.standings; // Array de grupos
  
  // Para ligas normales, tomar el primer grupo
  // Para competiciones con grupos, podríamos expandir esto
  if (standingsGroups && standingsGroups.length > 0) {
    const firstGroup = standingsGroups[0]; // Primer grupo (liga principal)
    
    console.log(`🔄 Transformando ${firstGroup.length} equipos de clasificación`);
    
    return firstGroup.map((standing: any) => {
      const transformed = mapStandingEntry(standing);
      console.log(`📊 Equipo: ${transformed.team.name} - Pos: ${transformed.position} - Pts: ${transformed.points}`);
      return transformed;
    });
  }
  
  return [];
};

export const transformTeamsResponse = (apiResponse: any): Team[] => {
  if (!apiResponse.response) return [];
  
  return apiResponse.response.map((item: any) => mapTeam(item.team));
};

// Función helper para manejar errores de transformación
export const safeTransform = <T>(
  transformer: (data: any) => T[], 
  apiResponse: any,
  fallback: T[] = []
): T[] => {
  try {
    return transformer(apiResponse);
  } catch (error) {
    console.error('Error transforming API response:', error);
    return fallback;
  }
};

// Nuevo transformer para rounds
export const transformRoundsResponse = (apiResponse: any): string[] => {
  if (!apiResponse.response) return [];
  
  return apiResponse.response.map((round: string) => round);
};