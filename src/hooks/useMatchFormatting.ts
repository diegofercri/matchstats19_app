import { useMemo } from 'react';
import { Match } from '@types';

/**
 * Return type interface for useMatchFormatting hook
 * Defines formatted display properties for match data
 */
interface UseMatchFormattingReturn {
  formattedDate: string;
  scoreText: string;
}

/**
 * Custom hook for formatting match data for display
 * Provides formatted dates and score text based on match status
 * 
 * @param match - Match object containing date, teams, and status information
 * @returns Object containing formatted date and score text for UI display
 */
export const useMatchFormatting = (match: Match): UseMatchFormattingReturn => {
  /**
   * Formats match date to Spanish locale format
   * Handles invalid dates gracefully with fallback text
   */
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

  /**
   * Generates score text based on match status
   * Shows actual scores for finished/live matches, "VS" for scheduled matches
   */
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