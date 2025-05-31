import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { colors } from '@colors';
import { Match } from '@types';

/**
 * Return type interface for useMatchStatus hook
 * Defines match status styling and display properties
 */
interface UseMatchStatusReturn {
  statusBadgeStyle: any[];
  statusText: string;
  isLiveMatch: boolean;
}

/**
 * Custom hook for managing match status display and styling
 * Provides status badges, text labels, and live match detection
 * 
 * @param match - Match object containing status information
 * @returns Object containing status styling, text, and live match indicator
 */
export const useMatchStatus = (match: Match): UseMatchStatusReturn => {
  const isLiveMatch = match.status === "JUGANDO" || match.status === "DESCANSO";

  /**
   * Generates status badge styling based on match state
   * Uses different colors for live vs non-live matches
   */
  const statusBadgeStyle = useMemo(() => {
    return [
      styles.statusBadge,
      {
        backgroundColor: isLiveMatch
          ? colors.interactive.primary
          : colors.background.tertiary,
      },
    ];
  }, [isLiveMatch]);

  /**
   * Converts match status to user-friendly display text
   * Maps internal status codes to Spanish labels for UI
   */
  const statusText = useMemo(() => {
    switch (match.status) {
      case "FINALIZADO":
        return "Finalizado";
      case "JUGANDO":
        return "Jugando";
      case "DESCANSO":
        return "Descanso";
      default:
        return "Programado";
    }
  }, [match.status]);

  return {
    statusBadgeStyle,
    statusText,
    isLiveMatch
  };
};

const styles = StyleSheet.create({
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
  },
});