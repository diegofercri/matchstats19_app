import { View, Text, StyleSheet } from "react-native";
import { colors } from "@colors";
import { Match } from "@types";
import MatchCard from "./MatchCard";
import { useMatchesGrouping } from "@hooks/useMatchesGrouping";

interface MatchesProps {
  matches?: Match[];
  showRounds?: boolean;
  emptyMessage?: string;
}

const Matches = ({
  matches,
  showRounds = false,
  emptyMessage = "No hay partidos disponibles para esta temporada.",
}: MatchesProps) => {
  const { groupedMatches, hasMatches } = useMatchesGrouping(
    matches,
    showRounds
  );

  if (!hasMatches) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  // Render grouped matches by round
  if (showRounds && groupedMatches) {
    return (
      <View>
        {Object.entries(groupedMatches).map(([round, roundMatches]) => (
          <RoundSection key={round} round={round} matches={roundMatches} />
        ))}
      </View>
    );
  }

  // Render all matches without grouping
  return (
    <View>
      {matches!.map((match) => (
        <MatchCard key={match.id} match={match} showRound={!showRounds} />
      ))}
    </View>
  );
};

// Separate component for round sections
interface RoundSectionProps {
  round: string;
  matches: Match[];
}

const RoundSection = ({ round, matches }: RoundSectionProps) => (
  <View style={styles.roundSection}>
    <Text style={styles.roundTitle}>{round}</Text>
    {matches.map((match) => (
      <MatchCard key={match.id} match={match} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  emptyContainer: {
    padding: 16,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
  },
  emptyText: {
    color: colors.text.secondary,
    textAlign: "center",
    fontSize: 14,
    fontStyle: "italic",
  },
  roundSection: {
    marginBottom: 24,
  },
  roundTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
});

export default Matches;
