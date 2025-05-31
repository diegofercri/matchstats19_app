import { useMemo } from 'react';
import { Match } from '@types';

/**
 * Return type interface for useMatchesGrouping hook
 * Defines grouped matches structure and availability indicator
 */
interface UseMatchesGroupingReturn {
  groupedMatches: Record<string, Match[]> | null;
  hasMatches: boolean;
}

/**
 * Custom hook for grouping matches by round for organized display
 * Provides conditional grouping based on display preferences
 * 
 * @param matches - Array of matches to group
 * @param showRounds - Flag to enable/disable round-based grouping
 * @returns Object containing grouped matches and availability indicator
 */
export const useMatchesGrouping = (
  matches: Match[] | undefined, 
  showRounds: boolean
): UseMatchesGroupingReturn => {
  
  const hasMatches = Boolean(matches && matches.length > 0);

  /**
   * Groups matches by round when round display is enabled
   * Returns null when grouping is disabled for flat list display
   */
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
 * Groups matches by their round property
 * Creates a record where keys are round names and values are match arrays
 * 
 * @param matches - Array of matches to group
 * @returns Record with round names as keys and match arrays as values
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