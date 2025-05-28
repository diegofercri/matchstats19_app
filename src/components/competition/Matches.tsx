// Matches.tsx
import { View, Text, StyleSheet } from "react-native";
import { colors } from "@colors";
import { Match } from "@/types";
import MatchCard from "./MatchCard";

interface MatchesProps {
  matches?: Match[];
  showRounds?: boolean;
  emptyMessage?: string;
}

const Matches = ({ 
  matches, 
  showRounds = false,
  emptyMessage = "No hay partidos disponibles para esta temporada."
}: MatchesProps) => {
  if (!matches || matches.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  // Group matches by round if showRounds is true
  const groupedMatches = showRounds ? groupMatchesByRound(matches) : null;

  const renderGroupedMatches = () => {
    if (!groupedMatches) return null;

    return (
      <View>
        {Object.entries(groupedMatches).map(([round, roundMatches]) => (
          <View key={round} style={styles.roundSection}>
            <Text style={styles.roundTitle}>{round}</Text>
            {roundMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </View>
        ))}
      </View>
    );
  };

  if (showRounds && groupedMatches) {
    return renderGroupedMatches();
  }

  return (
    <View>
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} showRound={!showRounds} />
      ))}
    </View>
  );
};

const groupMatchesByRound = (matches: Match[]): Record<string, Match[]> => {
  return matches.reduce((groups, match) => {
    const round = match.round || "Sin Clasificar";
    if (!groups[round]) {
      groups[round] = [];
    }
    groups[round].push(match);
    return groups;
  }, {} as Record<string, Match[]>);
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
    fontSize: 14,
    fontStyle: 'italic',
  },
  roundSection: {
    marginBottom: 24,
  },
  roundTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
});

export default Matches;