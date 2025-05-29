import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { colors } from '@colors';
import { Match } from '@types';

interface UseMatchStatusReturn {
  statusBadgeStyle: any[];
  statusText: string;
  isLiveMatch: boolean;
}

export const useMatchStatus = (match: Match): UseMatchStatusReturn => {
  const isLiveMatch = match.status === "JUGANDO" || match.status === "DESCANSO";

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