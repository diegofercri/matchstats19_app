import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@colors';
import { Match } from '@/types';

interface MatchesProps {
  matches?: Match[];
}

const Matches = ({ matches }: MatchesProps) => {
  if (!matches || matches.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay partidos disponibles para esta temporada.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {matches.map((match) => (
        <View key={match.id} style={styles.matchCard}>
          <Text style={styles.dateText}>
            {new Date(match.date).toLocaleDateString()} - {match.time}
          </Text>
          {match.round && (
            <Text style={styles.roundText}>{match.round}</Text>
          )}
          <View style={styles.matchInfo}>
            <Text style={styles.teamsText}>
              {match.homeTeam.name} vs {match.awayTeam.name}
            </Text>
            <Text style={styles.statusText}>
              {match.status === 'FINALIZADO' 
                ? `${match.homeTeam.score} - ${match.awayTeam.score}` 
                : match.status === 'PROGRAMADO' 
                ? 'VS' 
                : 'En Vivo'
              }
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  emptyContainer: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.text.primary,
  },
  emptyText: {
    color: colors.text.secondary,
  },
  matchCard: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: colors.background.surface,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  roundText: {
    fontSize: 12,
    color: colors.text.muted,
    marginBottom: 4,
  },
  matchInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  teamsText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
});

export default Matches;