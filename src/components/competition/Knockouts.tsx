import { View, Text, StyleSheet } from "react-native";
import { colors } from "@colors";
import { KnockoutRound } from "@types";
import MatchCard from "./MatchCard";
import { useKnockoutRounds } from "@hooks/useKnockoutRounds";

/**
 * Props interface for Knockouts component
 * Defines knockout rounds data and customization options
 */
interface KnockoutsProps {
  rounds?: KnockoutRound[];
  emptyMessage?: string;
}

/**
 * Knockouts component for displaying knockout phase rounds and matches
 * Shows organized knockout rounds with matches or appropriate empty states
 * Features multiple fallback states for different scenarios
 * 
 * @param props - Knockouts properties including rounds data and empty message
 * @returns JSX element containing knockout rounds or empty state messages
 */
const Knockouts = ({
  rounds,
  emptyMessage = "No hay rondas eliminatorias disponibles.",
}: KnockoutsProps) => {
  const { hasRounds, hasMatches } = useKnockoutRounds(rounds);

  if (!hasRounds) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  if (!hasMatches) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No hay partidos eliminatorios disponibles.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {rounds!.map((round) => (
        <KnockoutRoundSection key={round.id} round={round} />
      ))}
    </View>
  );
};

/**
 * Props interface for KnockoutRoundSection component
 * Defines knockout round data for individual round display
 */
interface KnockoutRoundSectionProps {
  round: KnockoutRound;
}

/**
 * Knockout round section component for displaying individual rounds
 * Shows round title and matches or placeholder for upcoming matches
 * Handles empty match states with informative messaging
 * 
 * @param props - Round section properties including round data
 * @returns JSX element containing round title and matches or placeholder
 */
const KnockoutRoundSection = ({ round }: KnockoutRoundSectionProps) => (
  <View style={styles.roundSection}>
    <Text style={styles.roundTitle}>{round.name}</Text>
    {round.matches && round.matches.length > 0 ? (
      <RoundMatches matches={round.matches} />
    ) : (
      <NoMatchesPlaceholder />
    )}
  </View>
);

/**
 * Props interface for RoundMatches component
 * Defines matches array for round match display
 */
interface RoundMatchesProps {
  matches: any[];
}

/**
 * Round matches component for displaying matches within a round
 * Renders individual match cards for all matches in the round
 * 
 * @param props - Round matches properties including matches array
 * @returns JSX fragment containing match cards
 */
const RoundMatches = ({ matches }: RoundMatchesProps) => (
  <>
    {matches.map((match) => (
      <MatchCard key={match.id} match={match} />
    ))}
  </>
);

/**
 * No matches placeholder component for rounds without defined matches
 * Shows informative message when matches are not yet available
 * 
 * @returns JSX element containing placeholder message for upcoming matches
 */
const NoMatchesPlaceholder = () => (
  <View style={styles.noMatchesContainer}>
    <Text style={styles.noMatchesText}>
      Los partidos se definirán próximamente.
    </Text>
  </View>
);

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
    textAlign: "center",
    fontSize: 14,
    fontStyle: "italic",
  },
  roundSection: {
    marginBottom: 24,
  },
  roundTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text.primary,
    textAlign: "center",
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
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default Knockouts;