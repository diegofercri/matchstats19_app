import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '@colors';
import { KnockoutRound } from '@/types';

interface KnockoutsProps {
  rounds?: KnockoutRound[];
}

const Knockouts = ({ rounds }: KnockoutsProps) => {
  if (!rounds || rounds.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay rondas eliminatorias disponibles.</Text>
      </View>
    );
  }

  const getStatusBadgeStyle = (status: string) => {
    const isPlaying = status === 'EN_VIVO';
    return [
      styles.statusBadge,
      { backgroundColor: isPlaying ? colors.interactive.primary : colors.text.muted }
    ];
  };

  const getStatusText = (status: string) => {
    if (status === 'FINALIZADO') {
      return 'Finalizado';
    } else if (status === 'EN_VIVO') {
      return 'En Vivo';
    } else if (status === 'POSPUESTO') {
      return 'Pospuesto';
    } else {
      return 'Programado';
    }
  };

  const getScoreText = (match: any) => {
    if (match.status === 'FINALIZADO') {
      return `${match.homeTeam.score} - ${match.awayTeam.score}`;
    } else if (match.status === 'EN_VIVO') {
      return `${match.homeTeam.score || 0} - ${match.awayTeam.score || 0}`;
    } else {
      return 'VS';
    }
  };

  return (
    <View>
      {rounds.map((round) => (
        <View key={round.id} style={styles.roundCard}>
          <Text style={styles.roundTitle}>{round.name}</Text>
          
          {round.matches && round.matches.length > 0 ? (
            <View style={styles.matchesContainer}>
              {round.matches.map((match) => (
                <View key={match.id} style={styles.matchCard}>
                  {match.round && (
                    <Text style={styles.roundText}>{match.round}</Text>
                  )}
                  
                  <View style={styles.matchContent}>
                    <View style={styles.teamContainer}>
                      <View style={styles.shieldContainer}>
                        <Image 
                          source={{ uri: match.homeTeam.logo }} 
                          style={styles.teamShield}
                          resizeMode="contain"
                        />
                      </View>
                      <Text style={styles.teamName} numberOfLines={2}>
                        {match.homeTeam.name}
                      </Text>
                    </View>

                    <View style={styles.centerContainer}>
                      <Text style={styles.dateText}>
                        {new Date(match.date).toLocaleDateString()}
                      </Text>
                      <Text style={styles.timeText}>
                        {match.time}
                      </Text>
                      <Text style={styles.scoreText}>
                        {getScoreText(match)}
                      </Text>
                      <View style={getStatusBadgeStyle(match.status)}>
                        <Text style={[
                          styles.statusText,
                          { color: match.status === 'JUGANDO' 
                            ? colors.interactive.primaryText 
                            : colors.text.primary 
                          }
                        ]}>
                          {getStatusText(match.status)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.teamContainer}>
                      <View style={styles.shieldContainer}>
                        <Image 
                          source={{ uri: match.awayTeam.logo }} 
                          style={styles.teamShield}
                          resizeMode="contain"
                        />
                      </View>
                      <Text style={styles.teamName} numberOfLines={2}>
                        {match.awayTeam.name}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noMatchesText}>
              Los partidos se definirán próximamente.
            </Text>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    padding: 16,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
  },
  emptyText: {
    color: colors.text.secondary,
    textAlign: 'center',
    fontSize: 12,
  },
  roundCard: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: colors.background.surface,
    borderRadius: 8,
  },
  roundTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  matchesContainer: {
    gap: 12,
  },
  matchCard: {
    padding: 12,
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
  },
  roundText: {
    fontSize: 12,
    color: colors.text.muted,
    marginBottom: 8,
    textAlign: 'center',
  },
  matchContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamContainer: {
    flex: 1,
    alignItems: 'center',
  },
  shieldContainer: {
    width: 40,
    height: 40,
    backgroundColor: colors.background.tertiary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  teamShield: {
    width: 28,
    height: 28,
  },
  teamName: {
    fontSize: 11,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 14,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  dateText: {
    fontSize: 11,
    color: colors.text.tertiary,
    marginBottom: 2,
  },
  timeText: {
    fontSize: 10,
    color: colors.text.muted,
    marginBottom: 6,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  noMatchesText: {
    fontSize: 14,
    color: colors.text.muted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default Knockouts;