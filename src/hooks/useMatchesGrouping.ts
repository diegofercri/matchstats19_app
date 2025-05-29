import { useMemo } from 'react';
import { Match } from '@types';

interface UseMatchesGroupingReturn {
  groupedMatches: Record<string, Match[]> | null;
  hasMatches: boolean;
}

export const useMatchesGrouping = (
  matches: Match[] | undefined, 
  showRounds: boolean
): UseMatchesGroupingReturn => {
  
  const hasMatches = Boolean(matches && matches.length > 0);

  const groupedMatches = useMemo(() => {
    if (!showRounds || !matches) return null;
    
    return groupMatchesByRound(matches);
  }, [matches, showRounds]);

  return {
    groupedMatches,
    hasMatches
  };
};

/**
 * Groups matches by round
 */
const groupMatchesByRound = (matches: Match[]): Record<string, Match[]> => {
  return matches.reduce((groups, match) => {
    const round = match.round || "Sin Clasificar";
    if (!groups[round]) {
      groups[round] = [];
    }
    groups[round].push(match);
    return groups;
  }, {} as Record<string, Match[]>);
};