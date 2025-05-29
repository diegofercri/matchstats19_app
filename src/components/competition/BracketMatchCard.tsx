import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '@colors';
import { AggregatedMatch, getMatchStatusDisplay } from '@utils/bracketUtils';

interface BracketMatchCardProps {
  match: AggregatedMatch;
}

export const BracketMatchCard = ({ match }: BracketMatchCardProps) => {
  const isFinished = match.status === 'FINALIZADO';
  const statusDisplay = getMatchStatusDisplay(match);
  
  return (
    <View style={styles.matchCard}>
      <TeamRow 
        team={match.homeTeam}
        isWinner={match.winner === match.homeTeam.id}
        isFinished={isFinished}
      />

      <View style={styles.separator} />

      <TeamRow 
        team={match.awayTeam}
        isWinner={match.winner === match.awayTeam.id}
        isFinished={isFinished}
      />

      {match.status !== 'FINALIZADO' && statusDisplay && (
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{statusDisplay}</Text>
        </View>
      )}
    </View>
  );
};

// Separate component for team row
interface TeamRowProps {
  team: {
    id: string;
    name: string;
    logo?: string;
    totalScore: number;
  };
  isWinner: boolean;
  isFinished: boolean;
}

const TeamRow = ({ team, isWinner, isFinished }: TeamRowProps) => (
  <View style={[styles.teamRow, isWinner && styles.winnerRow]}>
    <View style={styles.teamInfo}>
      <TeamLogo team={team} />
      <Text style={[styles.teamName, isWinner && styles.winnerText]} numberOfLines={1}>
        {team.name}
      </Text>
    </View>
    <View style={[styles.scoreContainer, isWinner && styles.winnerScore]}>
      <Text style={[styles.scoreText, isWinner && styles.winnerScoreText]}>
        {isFinished ? team.totalScore : '-'}
      </Text>
    </View>
  </View>
);

// Separate component for team logo
interface TeamLogoProps {
  team: {
    name: string;
    logo?: string;
  };
}

const TeamLogo = ({ team }: TeamLogoProps) => (
  <>
    {team.logo ? (
      <Image source={{ uri: team.logo }} style={styles.teamLogo} resizeMode="contain" />
    ) : (
      <View style={styles.placeholderLogo}>
        <Text style={styles.placeholderText}>
          {team.name.substring(0, 2).toUpperCase()}
        </Text>
      </View>
    )}
  </>
);

const styles = StyleSheet.create({
  matchCard: {
    width: 250,
    backgroundColor: colors.background.surface,
    borderRadius: 12,
    padding: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    borderRadius: 8,
  },
  winnerRow: {
    backgroundColor: colors.interactive.primary + '1A',
  },
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, 
    marginRight: 8,
  },
  teamLogo: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  placeholderLogo: {
    width: 24,
    height: 24,
    backgroundColor: colors.background.tertiary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  placeholderText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: colors.text.secondary,
  },
  teamName: {
    fontSize: 12,
    color: colors.text.secondary,
    flexShrink: 1,
    fontWeight: '500',
  },
  winnerText: {
    color: colors.text.primary,
    fontWeight: '700',
  },
  scoreContainer: {
    minWidth: 24,
    height: 24,
    backgroundColor: colors.background.secondary,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  winnerScore: {
    backgroundColor: colors.interactive.primary,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text.secondary,
  },
  winnerScoreText: {
    color: colors.interactive.primaryText,
  },
  separator: {
    height: 1,
    backgroundColor: colors.background.tertiary,
    marginVertical: 8,
  },
  statusContainer: {
    marginTop: 8,
    paddingBottom: 4,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 10,
    color: colors.text.muted,
    fontStyle: 'italic',
  },
});