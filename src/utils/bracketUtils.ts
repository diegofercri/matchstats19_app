import { Match } from '@types';

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
 * Groups matches by tie (home vs away team pair)
 */
export const groupMatchesByTie = (matches: Match[]): AggregatedMatch[] => {
  const tieGroups: { [key: string]: Match[] } = {};
  
  matches.forEach(match => {
    const teams = [match.homeTeam.id, match.awayTeam.id].sort();
    const tieKey = teams.join('-');
    if (!tieGroups[tieKey]) {
      tieGroups[tieKey] = [];
    }
    tieGroups[tieKey].push(match);
  });

  return Object.entries(tieGroups).map(([tieKey, tieMatches]) => {
    return processMatchTie(tieKey, tieMatches);
  });
};

/**
 * Processes a single match tie to create aggregated match data
 */
const processMatchTie = (tieKey: string, tieMatches: Match[]): AggregatedMatch => {
  const sortedMatches = tieMatches.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const firstMatch = sortedMatches[0];
  const homeTeamIdActual = firstMatch.homeTeam.id; 
  const awayTeamIdActual = firstMatch.awayTeam.id;

  const { homeTotal, awayTotal, homeLegAwayGoals, awayLegAwayGoals, currentStatus } = 
    calculateMatchTotals(sortedMatches, homeTeamIdActual);

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
 * Calculates match totals and status
 */
const calculateMatchTotals = (matches: Match[], homeTeamIdActual: string) => {
  let homeTotal = 0;
  let awayTotal = 0;
  let homeLegAwayGoals = 0; 
  let awayLegAwayGoals = 0; 
  let allFinished = true;
  let currentStatus: string = 'PENDIENTE';

  matches.forEach((match, index) => {
    if (match.status === 'FINALIZADO') {
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
    
    if (index === 0) currentStatus = match.status;
    if (match.status === 'JUGANDO') currentStatus = 'JUGANDO';
  });

  if (allFinished) currentStatus = 'FINALIZADO';

  return { homeTotal, awayTotal, homeLegAwayGoals, awayLegAwayGoals, currentStatus };
};

/**
 * Determines the winner of a tie
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
  if (currentStatus !== 'FINALIZADO') return undefined;

  if (homeTotal > awayTotal) {
    return homeTeamIdActual;
  } else if (awayTotal > homeTotal) {
    return awayTeamIdActual;
  } else {
    // Tie - check away goals rule for two-leg ties
    if (numMatches === 2) { 
      if (homeLegAwayGoals > awayLegAwayGoals) {
        return homeTeamIdActual;
      } else if (awayLegAwayGoals > homeLegAwayGoals) {
        return awayTeamIdActual;
      }
    }
  }
  
  return undefined;
};

/**
 * Gets status display text for a match
 */
export const getMatchStatusDisplay = (match: AggregatedMatch): string => {
  if (match.status === 'FINALIZADO') {
    return '';
  } else if (match.status === 'JUGANDO') {
    return 'En vivo';
  } else if (match.matches.length === 2) {
    return 'Eliminatoria en curso';
  } else if (match.status && match.status !== 'PROGRAMADO' && match.status !== 'PENDIENTE') {
    return match.status;
  }
  
  return 'Por jugar';
};