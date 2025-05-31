import { useMemo } from 'react';
import { KnockoutRound } from '@types';

/**
 * Return type interface for useKnockoutRounds hook
 * Defines availability indicators for knockout rounds and matches
 */
interface UseKnockoutRoundsReturn {
  hasRounds: boolean;
  hasMatches: boolean;
}

/**
 * Custom hook for analyzing knockout rounds data availability
 * Provides boolean indicators for rounds existence and match content
 * Optimized with memoization for performance
 * 
 * @param rounds - Array of knockout rounds to analyze
 * @returns Object containing availability indicators for rounds and matches
 */
export const useKnockoutRounds = (rounds: KnockoutRound[] | undefined): UseKnockoutRoundsReturn => {
  const hasRounds = Boolean(rounds && rounds.length > 0);

  /**
   * Checks if any knockout round contains matches
   * Searches through all rounds to find at least one with match data
   */
  const hasMatches = useMemo(() => {
    if (!hasRounds) return false;
    
    return rounds!.some(round => round.matches && round.matches.length > 0);
  }, [rounds, hasRounds]);

  return {
    hasRounds,
    hasMatches
  };
};