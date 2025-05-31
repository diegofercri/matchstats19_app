import { useMemo } from 'react';
import { KnockoutRound, Match } from '@types';
import { groupMatchesByTie } from '@utils/bracketUtils';

/**
 * Interface for bracket round data structure
 * Contains round information and aggregated match data for bracket display
 */
export interface BracketRoundData {
  round: KnockoutRound;
  aggregatedMatches: any[];
}

/**
 * Return type interface for useBracketData hook
 * Defines bracket data availability and processed round information
 */
interface UseBracketDataReturn {
  hasRounds: boolean;
  hasMatches: boolean;
  activeRounds: BracketRoundData[];
}

/**
 * Custom hook for processing knockout rounds data for bracket visualization
 * Transforms knockout rounds into bracket-friendly format with aggregated matches
 * Filters rounds to include only those with actual match data
 * 
 * @param rounds - Array of knockout rounds to process
 * @returns Object containing availability indicators and processed bracket data
 */
export const useBracketData = (rounds: KnockoutRound[] | undefined): UseBracketDataReturn => {
  const hasRounds = Boolean(rounds && rounds.length > 0);

  /**
   * Processes rounds into bracket-ready format
   * Filters rounds with matches and groups matches by ties for bracket display
   */
  const activeRounds = useMemo(() => {
    if (!hasRounds) return [];
    
    return rounds!
      .filter(round => round.matches && round.matches.length > 0)
      .map(round => ({
        round,
        aggregatedMatches: groupMatchesByTie(round.matches)
      }));
  }, [rounds, hasRounds]);

  const hasMatches = activeRounds.length > 0;

  return {
    hasRounds,
    hasMatches,
    activeRounds
  };
};