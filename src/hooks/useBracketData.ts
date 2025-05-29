import { useMemo } from 'react';
import { KnockoutRound, Match } from '@types';
import { groupMatchesByTie } from '@utils/bracketUtils';

export interface BracketRoundData {
  round: KnockoutRound;
  aggregatedMatches: any[];
}

interface UseBracketDataReturn {
  hasRounds: boolean;
  hasMatches: boolean;
  activeRounds: BracketRoundData[];
}

export const useBracketData = (rounds: KnockoutRound[] | undefined): UseBracketDataReturn => {
  const hasRounds = Boolean(rounds && rounds.length > 0);

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