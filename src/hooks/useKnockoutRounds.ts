import { useMemo } from 'react';
import { KnockoutRound } from '@types';

interface UseKnockoutRoundsReturn {
  hasRounds: boolean;
  hasMatches: boolean;
}

export const useKnockoutRounds = (rounds: KnockoutRound[] | undefined): UseKnockoutRoundsReturn => {
  const hasRounds = Boolean(rounds && rounds.length > 0);

  const hasMatches = useMemo(() => {
    if (!hasRounds) return false;
    
    return rounds!.some(round => round.matches && round.matches.length > 0);
  }, [rounds, hasRounds]);

  return {
    hasRounds,
    hasMatches
  };
};