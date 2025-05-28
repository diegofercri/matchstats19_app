// Knockouts.tsx
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@colors';
import { KnockoutRound } from '@/types';
import MatchCard from './MatchCard';

interface KnockoutsProps {
  rounds?: KnockoutRound[];
  emptyMessage?: string;
}

const Knockouts = ({ 
  rounds,
  emptyMessage = "No hay rondas eliminatorias disponibles."
}: KnockoutsProps) => {
  if (!rounds || rounds.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  // Check if there are actually matches to show
  const hasMatches = rounds.some(round => round.matches && round.matches.length > 0);
  
  if (!hasMatches) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay partidos eliminatorios disponibles.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {rounds.map((round) => (
        <View key={round.id} style={styles.roundSection}>
          <Text style={styles.roundTitle}>{round.name}</Text>
          {round.matches && round.matches.length > 0 ? (
            round.matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))
          ) : (
            <View style={styles.noMatchesContainer}>
              <Text style={styles.noMatchesText}>
                Los partidos se definirán próximamente.
              </Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
  },
  emptyContainer: {
    padding: 16,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
  },
  emptyText: {
    color: colors.text.secondary,
    textAlign: 'center',
    fontSize: 14,
    fontStyle: 'italic',
  },
  roundSection: {
    marginBottom: 24,
  },
  roundTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  noMatchesContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  noMatchesText: {
    fontSize: 14,
    color: colors.text.muted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default Knockouts;