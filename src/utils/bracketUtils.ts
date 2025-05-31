import { Match } from '@types';

/**
 * Interface representing an aggregated match (complete knockout tie)
 * Contains consolidated information from all matches between two teams
 */
export interface AggregatedMatch {
  id: string;
  homeTeam: {
    id: string;
    name: string;
    logo?: string;
    totalScore: number;
    awayGoals?: number;
  };
  awayTeam: {
    id: string;
    name: string;
    logo?: string;
    totalScore: number;
    awayGoals?: number;
  };
  status: string;
  winner?: string;
  matches: Match[];
}

/**
 * Groups individual matches by knockout tie (matchup between two teams)
 * 
 * @param matches - Array of individual matches to group
 * @returns Array of aggregated matches (complete knockout ties)
 */
export const groupMatchesByTie = (matches: Match[]): AggregatedMatch[] => {
  const tieGroups: { [key: string]: Match[] } = {};
  
  // Group matches by team pairs
  matches.forEach(match => {
    const teams = [match.homeTeam.id, match.awayTeam.id].sort();
    const tieKey = teams.join('-');
    
    if (!tieGroups[tieKey]) {
      tieGroups[tieKey] = [];
    }
    
    tieGroups[tieKey].push(match);
  });

  // Process each match group to create aggregated knockout tie
  return Object.entries(tieGroups).map(([tieKey, tieMatches]) => {
    return processMatchTie(tieKey, tieMatches);
  });
};

/**
 * Processes an individual knockout tie to create aggregated data
 * 
 * @param tieKey - Unique key for the knockout tie (format: "teamId1-teamId2")
 * @param tieMatches - Array of matches that make up the knockout tie
 * @returns Aggregated match with all consolidated information
 */
const processMatchTie = (tieKey: string, tieMatches: Match[]): AggregatedMatch => {
  // Sort matches by date to maintain consistency
  const sortedMatches = tieMatches.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const firstMatch = sortedMatches[0];
  const homeTeamIdActual = firstMatch.homeTeam.id; 
  const awayTeamIdActual = firstMatch.awayTeam.id;

  // Calculate totals and current status of the knockout tie
  const { 
    homeTotal, 
    awayTotal, 
    homeLegAwayGoals, 
    awayLegAwayGoals, 
    currentStatus 
  } = calculateMatchTotals(sortedMatches, homeTeamIdActual);

  // Determine winner based on knockout tie rules
  const winner = determineWinner(
    homeTotal, 
    awayTotal, 
    homeLegAwayGoals, 
    awayLegAwayGoals, 
    currentStatus, 
    homeTeamIdActual, 
    awayTeamIdActual,
    sortedMatches.length
  );

  // Get correct information for each team
  const homeTeamInfoForTie = firstMatch.homeTeam.id === homeTeamIdActual ? 
    firstMatch.homeTeam : firstMatch.awayTeam;
  const awayTeamInfoForTie = firstMatch.awayTeam.id === awayTeamIdActual ? 
    firstMatch.awayTeam : firstMatch.homeTeam;

  return {
    id: `tie-${tieKey}`,
    homeTeam: {
      id: homeTeamIdActual,
      name: homeTeamInfoForTie.name,
      logo: homeTeamInfoForTie.logo,
      totalScore: homeTotal,
      awayGoals: homeLegAwayGoals,
    },
    awayTeam: {
      id: awayTeamIdActual,
      name: awayTeamInfoForTie.name,
      logo: awayTeamInfoForTie.logo,
      totalScore: awayTotal,
      awayGoals: awayLegAwayGoals,
    },
    status: currentStatus,
    winner,
    matches: sortedMatches,
  };
};

/**
 * Calculates accumulated goal totals and determines current status of knockout tie
 * 
 * @param matches - Array of matches in the knockout tie
 * @param homeTeamIdActual - ID of the team considered home in the knockout tie
 * @returns Object with goal totals, away goals, and current status
 */
const calculateMatchTotals = (matches: Match[], homeTeamIdActual: string) => {
  let homeTotal = 0;
  let awayTotal = 0;
  let homeLegAwayGoals = 0; // Away goals for home team
  let awayLegAwayGoals = 0; // Away goals for away team
  let allFinished = true;
  let currentStatus: string = 'PENDIENTE';

  matches.forEach((match, index) => {
    if (match.status === 'FINALIZADO') {
      // Accumulate goals based on whether team played home or away
      if (match.homeTeam.id === homeTeamIdActual) { 
        homeTotal += match.homeTeam.score || 0;
        awayTotal += match.awayTeam.score || 0;
        awayLegAwayGoals += match.awayTeam.score || 0;
      } else { 
        homeTotal += match.awayTeam.score || 0; 
        awayTotal += match.homeTeam.score || 0; 
        homeLegAwayGoals += match.awayTeam.score || 0;
      }
    } else {
      allFinished = false;
    }
    
    // Set status based on first match or if there's one in progress
    if (index === 0) {
      currentStatus = match.status;
    }
    
    if (match.status === 'JUGANDO') {
      currentStatus = 'JUGANDO';
    }
  });

  // If all matches finished, mark knockout tie as completed
  if (allFinished) {
    currentStatus = 'FINALIZADO';
  }

  return { 
    homeTotal, 
    awayTotal, 
    homeLegAwayGoals, 
    awayLegAwayGoals, 
    currentStatus 
  };
};

/**
 * Determines the winner of a knockout tie applying football rules
 * Includes away goals rule for two-leg knockout ties
 * 
 * @param homeTotal - Total goals for home team
 * @param awayTotal - Total goals for away team
 * @param homeLegAwayGoals - Away goals for home team
 * @param awayLegAwayGoals - Away goals for away team
 * @param currentStatus - Current status of knockout tie
 * @param homeTeamIdActual - Home team ID
 * @param awayTeamIdActual - Away team ID
 * @param numMatches - Number of matches in knockout tie
 * @returns Winner team ID or undefined if no winner is determined
 */
const determineWinner = (
  homeTotal: number,
  awayTotal: number,
  homeLegAwayGoals: number,
  awayLegAwayGoals: number,
  currentStatus: string,
  homeTeamIdActual: string,
  awayTeamIdActual: string,
  numMatches: number
): string | undefined => {
  // Only determine winner if knockout tie has finished
  if (currentStatus !== 'FINALIZADO') {
    return undefined;
  }

  // Check winner by goal difference
  if (homeTotal > awayTotal) {
    return homeTeamIdActual;
  } 
  
  if (awayTotal > homeTotal) {
    return awayTeamIdActual;
  }
  
  // In case of tie, apply away goals rule (only for two-leg ties)
  if (numMatches === 2) { 
    if (homeLegAwayGoals > awayLegAwayGoals) {
      return homeTeamIdActual;
    }
    
    if (awayLegAwayGoals > homeLegAwayGoals) {
      return awayTeamIdActual;
    }
  }
  
  // No winner determined (total tie)
  return undefined;
};

/**
 * Gets descriptive status text for a knockout tie to display to user
 * 
 * @param match - Aggregated match to get status from
 * @returns Descriptive text of current status
 */
export const getMatchStatusDisplay = (match: AggregatedMatch): string => {
  if (match.status === 'FINALIZADO') {
    return '';
  }
  
  if (match.status === 'JUGANDO') {
    return 'En vivo';
  }
  
  if (match.matches.length === 2) {
    return 'Eliminatoria en curso';
  }
  
  if (match.status && match.status !== 'PROGRAMADO' && match.status !== 'PENDIENTE') {
    return match.status;
  }
  
  return 'Por jugar';
};