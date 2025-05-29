import { useMemo } from 'react';
import { Match } from '@types';

interface UseMatchFormattingReturn {
  formattedDate: string;
  scoreText: string;
}

export const useMatchFormatting = (match: Match): UseMatchFormattingReturn => {
  const formattedDate = useMemo(() => {
    try {
      return new Date(match.date).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  }, [match.date]);

  const scoreText = useMemo(() => {
    if (match.status === "FINALIZADO") {
      return `${match.homeTeam.score} - ${match.awayTeam.score}`;
    } else if (match.status === "JUGANDO" || match.status === "DESCANSO") {
      return `${match.homeTeam.score || 0} - ${match.awayTeam.score || 0}`;
    } else {
      return "VS";
    }
  }, [match.status, match.homeTeam.score, match.awayTeam.score]);

  return {
    formattedDate,
    scoreText
  };
};