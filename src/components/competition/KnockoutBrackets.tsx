import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { colors } from "@colors";
import { KnockoutRound } from "@types";
import { useBracketData } from "@hooks/useBracketData";
import { InterRoundConnector } from "./InterRoundConnector";
import { BracketMatchCard } from "./BracketMatchCard";
import { MATCH_SPACING_IN_COLUMN } from "@constants/bracketConstants";

interface KnockoutBracketsProps {
  rounds?: KnockoutRound[];
  emptyMessage?: string;
}

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

// Separate component for bracket round wrapper
interface BracketRoundWrapperProps {
  roundData: {
    round: KnockoutRound;
    aggregatedMatches: any[];
  };
  isLastRound: boolean;
}

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

// Separate component for round column
interface RoundColumnProps {
  round: KnockoutRound;
  matches: any[];
}

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
