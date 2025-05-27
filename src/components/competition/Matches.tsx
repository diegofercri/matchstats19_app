import { View, Text, StyleSheet, Image } from "react-native";
import { colors } from "@colors";
import { Match } from "@/types";

interface MatchesProps {
  matches?: Match[];
}

const Matches = ({ matches }: MatchesProps) => {
  if (!matches || matches.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No hay partidos disponibles para esta temporada.
        </Text>
      </View>
    );
  }

  const getStatusBadgeStyle = (status: string) => {
    const isPlaying = status === "EN_VIVO" || status === "JUGANDO";
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
    if (match.status === "FINALIZADO") {
      return "Finalizado";
    } else if (match.status === "JUGANDO") {
      return "Jugando";
    } else if (match.status === "DESCANSO") {
      return "Descanso";
    } else {
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

  return (
    <View>
      {matches.map((match) => (
        <View key={match.id} style={styles.matchCard}>
          <View style={styles.matchContent}>
            {/* Equipo Local */}
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

            {/* Centro - Fecha, Resultado y Estado */}
            <View style={styles.centerContainer}>
              <Text style={styles.dateText}>
                {new Date(match.date).toLocaleDateString()}
              </Text>
              <Text style={styles.timeText}>{match.time}</Text>
              <Text style={styles.scoreText}>{getScoreText(match)}</Text>
              <View style={getStatusBadgeStyle(match.status)}>
                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        match.status === "JUGANDO" ||
                        match.status === "DESCANSO"
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
  matchCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: colors.background.surface,
    borderRadius: 16,
  },
  roundText: {
    fontSize: 12,
    color: colors.text.muted,
    marginBottom: 12,
    textAlign: "center",
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
  teamName: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 16,
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

export default Matches;
