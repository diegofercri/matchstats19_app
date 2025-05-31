import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { colors } from "@colors";
import { KnockoutRound } from "@types";
import { useBracketData } from "@hooks/useBracketData";
import { InterRoundConnector } from "./InterRoundConnector";
import { BracketMatchCard } from "./BracketMatchCard";
import { MATCH_SPACING_IN_COLUMN } from "@constants/bracketConstants";

/**
 * Props interface for KnockoutBrackets component
 * Defines knockout rounds data and customization options for bracket display
 */
interface KnockoutBracketsProps {
  rounds?: KnockoutRound[];
  emptyMessage?: string;
}

/**
 * Knockout brackets component for displaying tournament bracket visualization
 * Shows elimination rounds in horizontal scrollable bracket format with connectors
 * Features empty states and organized round-by-round progression display
 * 
 * @param props - Knockout brackets properties including rounds data and empty message
 * @returns JSX element containing scrollable tournament bracket or empty states
 */
const KnockoutBrackets = ({
  rounds,
  emptyMessage = "No hay brackets eliminatorios disponibles.",
}: KnockoutBracketsProps) => {
  const { hasRounds, hasMatches, activeRounds } = useBracketData(rounds);

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
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeRounds.map((roundData, index) => (
          <BracketRoundWrapper
            key={roundData.round.id}
            roundData={roundData}
            isLastRound={index === activeRounds.length - 1}
          />
        ))}
      </ScrollView>
    </View>
  );
};

/**
 * Props interface for BracketRoundWrapper component
 * Defines round data and position information for bracket round display
 */
interface BracketRoundWrapperProps {
  roundData: {
    round: KnockoutRound;
    aggregatedMatches: any[];
  };
  isLastRound: boolean;
}

/**
 * Bracket round wrapper component for individual round containers
 * Wraps round column with optional inter-round connectors
 * Manages spacing and connections between tournament rounds
 * 
 * @param props - Round wrapper properties including round data and position info
 * @returns JSX element containing round column with optional connector
 */
const BracketRoundWrapper = ({
  roundData,
  isLastRound,
}: BracketRoundWrapperProps) => (
  <View style={styles.roundWrapper}>
    <RoundColumn
      round={roundData.round}
      matches={roundData.aggregatedMatches}
    />
    {!isLastRound && (
      <InterRoundConnector
        numSourceMatches={roundData.aggregatedMatches.length}
      />
    )}
  </View>
);

/**
 * Props interface for RoundColumn component
 * Defines round information and matches for column display
 */
interface RoundColumnProps {
  round: KnockoutRound;
  matches: any[];
}

/**
 * Round column component for displaying matches within a tournament round
 * Shows round title and vertically arranged match cards with consistent spacing
 * Features centered layout with proper match organization
 * 
 * @param props - Round column properties including round data and matches
 * @returns JSX element containing round title and organized match cards
 */
const RoundColumn = ({ round, matches }: RoundColumnProps) => (
  <View style={styles.roundColumn}>
    <Text style={styles.roundTitle}>{round.name}</Text>
    <View style={styles.matchesColumn}>
      {matches.map((match) => (
        <View key={match.id} style={styles.matchContainer}>
          <BracketMatchCard match={match} />
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  scrollContent: {
    padding: 0,
    alignItems: "center",
  },
  emptyContainer: {
    padding: 16,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    margin: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: colors.text.secondary,
    textAlign: "center",
    fontSize: 14,
    fontStyle: "italic",
  },
  roundWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  roundColumn: {
    alignItems: "center",
    marginRight: 0,
  },
  roundTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 20,
    textAlign: "center",
    width: 180,
  },
  matchesColumn: {
    alignItems: "center",
    gap: MATCH_SPACING_IN_COLUMN,
  },
  matchContainer: {
    alignItems: "center",
  },
});

export default KnockoutBrackets;