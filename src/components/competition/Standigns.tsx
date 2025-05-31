import { View, Text, StyleSheet } from "react-native";
import { StandingEntry } from "@types";
import { colors } from "@colors";

/**
 * Props interface for Standings component
 * Defines optional standings data for table display
 */
interface StandingsProps {
  standings?: StandingEntry[];
}

/**
 * Standings table component for displaying league/competition standings
 * Features complete table with position, team names, statistics, and points
 * Shows empty state when no standings data is available
 * 
 * @param props - Standings properties containing optional standings data
 * @returns JSX element containing standings table or empty state message
 */
const Standings = ({ standings }: StandingsProps) => {
  if (!standings || standings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No hay datos de clasificación disponibles para esta temporada.
        </Text>
      </View>
    );
  }

  return (
    <View>
      {/* Table header */}
      <View style={styles.header}>
        <Text style={styles.headerPosition}>#</Text>
        <Text style={styles.headerTeam}>Equipo</Text>
        <Text style={styles.headerStat}>G</Text>
        <Text style={styles.headerStat}>E</Text>
        <Text style={styles.headerStat}>P</Text>
        <Text style={styles.headerStat}>DIF</Text>
        <Text style={styles.headerStat}>PTS</Text>
      </View>

      {/* Table rows */}
      <View style={styles.tableBody}>
        {standings.map((entry) => (
          <View key={entry.team.id} style={styles.row}>
            <Text style={styles.position}>{entry.position}</Text>
            <Text
              style={styles.teamName}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {entry.team.name}
            </Text>
            <Text style={styles.stat}>{entry.won}</Text>
            <Text style={styles.stat}>{entry.drawn}</Text>
            <Text style={styles.stat}>{entry.lost}</Text>
            <Text style={styles.stat}>
              {entry.goalDifference > 0
                ? `+${entry.goalDifference}`
                : entry.goalDifference}
            </Text>
            <Text style={styles.points}>{entry.points}</Text>
          </View>
        ))}
      </View>
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
    textAlign: "center",
    fontSize: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.tertiary,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 8,
  },
  headerPosition: {
    width: 32,
    fontSize: 12,
    fontWeight: "bold",
    color: colors.text.secondary,
    textAlign: "center",
  },
  headerTeam: {
    flex: 1,
    fontSize: 12,
    fontWeight: "bold",
    color: colors.text.secondary,
    marginLeft: 8,
  },
  headerStat: {
    width: 36,
    fontSize: 12,
    fontWeight: "bold",
    color: colors.text.secondary,
    textAlign: "center",
  },
  tableBody: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
  },
  position: {
    width: 32,
    fontSize: 12,
    color: colors.text.primary,
    textAlign: "center",
    fontWeight: "600",
  },
  teamName: {
    flex: 1,
    fontSize: 12,
    color: colors.text.primary,
    marginLeft: 8,
  },
  stat: {
    width: 36,
    fontSize: 12,
    color: colors.text.primary,
    textAlign: "center",
  },
  points: {
    width: 36,
    fontSize: 12,
    color: colors.interactive.primary,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default Standings;