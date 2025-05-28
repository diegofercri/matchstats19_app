// MatchCard.tsx
import { View, Text, StyleSheet, Image } from "react-native";
import { colors } from "@colors";
import { Match } from "@/types";

interface MatchCardProps {
  match: Match;
  showRound?: boolean;
}

const MatchCard = ({ match, showRound = false }: MatchCardProps) => {
  const getStatusBadgeStyle = (status: string) => {
    const isPlaying = status === "JUGANDO" || status === "DESCANSO";
    return [
      styles.statusBadge,
      {
        backgroundColor: isPlaying
          ? colors.interactive.primary
          : colors.background.tertiary,
      },
    ];
  };

  const getStatusText = (match: Match) => {
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
  };

  const getScoreText = (match: Match) => {
    if (match.status === "FINALIZADO") {
      return `${match.homeTeam.score} - ${match.awayTeam.score}`;
    } else if (match.status === "JUGANDO" || match.status === "DESCANSO") {
      return `${match.homeTeam.score || 0} - ${match.awayTeam.score || 0}`;
    } else {
      return "VS";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const isLiveMatch = match.status === "JUGANDO" || match.status === "DESCANSO";

  return (
    <View style={styles.matchCard}>
      {showRound && match.round && (
        <Text style={styles.roundText}>{match.round}</Text>
      )}
      
      <View style={styles.matchContent}>
        {/* Equipo Local */}
        <View style={styles.teamContainer}>
          <View style={styles.shieldContainer}>
            {match.homeTeam.logo ? (
              <Image
                source={{ uri: match.homeTeam.logo }}
                style={styles.teamShield}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.placeholderShield}>
                <Text style={styles.placeholderText}>
                  {match.homeTeam.name.substring(0, 2).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.teamName} numberOfLines={2}>
            {match.homeTeam.name}
          </Text>
        </View>

        {/* Centro - Fecha, Resultado y Estado */}
        <View style={styles.centerContainer}>
          <Text style={styles.dateText}>
            {formatDate(match.date)}
          </Text>
          <Text style={styles.timeText}>{match.time}</Text>
          <Text style={[styles.scoreText, isLiveMatch && styles.liveScore]}>
            {getScoreText(match)}
          </Text>
          <View style={getStatusBadgeStyle(match.status)}>
            <Text
              style={[
                styles.statusText,
                {
                  color: isLiveMatch
                    ? colors.interactive.primaryText
                    : colors.text.primary,
                },
              ]}
            >
              {getStatusText(match)}
            </Text>
          </View>
        </View>

        {/* Equipo Visitante */}
        <View style={styles.teamContainer}>
          <View style={styles.shieldContainer}>
            {match.awayTeam.logo ? (
              <Image
                source={{ uri: match.awayTeam.logo }}
                style={styles.teamShield}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.placeholderShield}>
                <Text style={styles.placeholderText}>
                  {match.awayTeam.name.substring(0, 2).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.teamName} numberOfLines={2}>
            {match.awayTeam.name}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  matchCard: {
    marginBottom: 16,
    paddingVertical: 24,
    paddingHorizontal: 12,
    backgroundColor: colors.background.surface,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roundText: {
    fontSize: 12,
    color: colors.text.muted,
    marginBottom: 12,
    textAlign: "center",
    fontWeight: '500',
  },
  matchContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  teamContainer: {
    flex: 1,
    alignItems: "center",
  },
  shieldContainer: {
    width: 80,
    height: 80,
    backgroundColor: colors.background.secondary,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  teamShield: {
    width: 70,
    height: 70,
  },
  placeholderShield: {
    width: 70,
    height: 70,
    backgroundColor: colors.background.tertiary,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.secondary,
  },
  teamName: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 16,
    fontWeight: '500',
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dateText: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginBottom: 2,
    fontWeight: '500',
  },
  timeText: {
    fontSize: 11,
    color: colors.text.muted,
    marginBottom: 12,
  },
  scoreText: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 16,
  },
  liveScore: {
    color: colors.interactive.primary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
  },
});

export default MatchCard;