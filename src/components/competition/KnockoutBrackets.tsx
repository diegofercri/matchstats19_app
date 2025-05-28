// KnockoutBrackets.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, StatusBar } from 'react-native';
import { colors } from '@colors';
import { KnockoutRound, Match, Team } from '@/types';

// --- Constants for new connector style ---
const CONNECTOR_THICKNESS = 2;
const CONNECTOR_HORIZONTAL_SEGMENT_LENGTH = 20; 
const EFFECTIVE_MATCH_CARD_HEIGHT = 115; // IMPORTANT: Adjust this based on your BracketMatchCard's actual rendered height!
const MATCH_SPACING_IN_COLUMN = 24; 

interface KnockoutBracketsProps {
  rounds?: KnockoutRound[];
  emptyMessage?: string;
}

interface AggregatedMatch {
  id: string;
  homeTeam: {
    id: string;
    name: string;
    logo?: string;
    totalScore: number;
    awayGoals?: number;
  };
  awayTeam: {
    id: string;
    name: string;
    logo?: string;
    totalScore: number;
    awayGoals?: number;
  };
  status: string;
  winner?: string;
  matches: Match[]; // Original matches for this tie
}

// --- Helper: New InterRoundConnector Component ---
interface InterRoundConnectorProps {
  numSourceMatches: number; 
}

const InterRoundConnector: React.FC<InterRoundConnectorProps> = ({ numSourceMatches }) => {
  const numTargetConnectorUnits = Math.floor(numSourceMatches / 2);

  if (numSourceMatches === 1 && numTargetConnectorUnits === 0) {
    return (
      <View style={styles.interRoundConnectorContainer}>
        <View style={{
          height: EFFECTIVE_MATCH_CARD_HEIGHT,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <View style={{ 
            width: CONNECTOR_HORIZONTAL_SEGMENT_LENGTH * 2, 
            height: CONNECTOR_THICKNESS,
            backgroundColor: colors.background.tertiary,
          }}/>
        </View>
      </View>
    );
  }

  if (numTargetConnectorUnits === 0) {
    return null; 
  }

  return (
    <View style={styles.interRoundConnectorContainer}>
      {Array.from({ length: numTargetConnectorUnits }).map((_, i) => {
        // Calculamos la posición vertical para centrar el conector con las tarjetas
        const totalHeightPerPair = (EFFECTIVE_MATCH_CARD_HEIGHT * 2) + MATCH_SPACING_IN_COLUMN;
        const verticalOffsetToFirstCardCenter = EFFECTIVE_MATCH_CARD_HEIGHT / 1.47;
        const verticalDistanceBetweenCardCenters = EFFECTIVE_MATCH_CARD_HEIGHT + MATCH_SPACING_IN_COLUMN;
        const verticalOffsetToSecondCardCenter = verticalOffsetToFirstCardCenter + verticalDistanceBetweenCardCenters;
        const midPointBetweenCards = (verticalOffsetToFirstCardCenter + verticalOffsetToSecondCardCenter) / 2;

        return (
          <View
            key={`connector-unit-${i}`}
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start', 
              height: totalHeightPerPair,
            }}
          >
            <View style={{
              position: 'relative', 
              width: CONNECTOR_HORIZONTAL_SEGMENT_LENGTH,
              height: '100%', 
            }}>
              {/* Línea horizontal desde la primera tarjeta */}
              <View style={{
                position: 'absolute',
                backgroundColor: colors.background.tertiary,
                width: CONNECTOR_HORIZONTAL_SEGMENT_LENGTH,
                height: CONNECTOR_THICKNESS,
                top: verticalOffsetToFirstCardCenter - (CONNECTOR_THICKNESS / 2),
                left: 0,
              }} />
              
              {/* Línea vertical conectando ambas tarjetas */}
              <View style={{
                position: 'absolute',
                backgroundColor: colors.background.tertiary,
                width: CONNECTOR_THICKNESS,
                height: verticalDistanceBetweenCardCenters,
                top: verticalOffsetToFirstCardCenter - (CONNECTOR_THICKNESS / 2),
                left: CONNECTOR_HORIZONTAL_SEGMENT_LENGTH - CONNECTOR_THICKNESS, 
              }} />
              
              {/* Línea horizontal desde la segunda tarjeta */}
              <View style={{
                position: 'absolute',
                backgroundColor: colors.background.tertiary,
                width: CONNECTOR_HORIZONTAL_SEGMENT_LENGTH,
                height: CONNECTOR_THICKNESS,
                top: verticalOffsetToSecondCardCenter - (CONNECTOR_THICKNESS / 2),
                left: 0,
              }} />
            </View>
            
            {/* Línea horizontal hacia la siguiente ronda (desde el punto medio) */}
            <View style={{
              width: CONNECTOR_HORIZONTAL_SEGMENT_LENGTH,
              height: CONNECTOR_THICKNESS,
              backgroundColor: colors.background.tertiary,
              marginTop: midPointBetweenCards - (CONNECTOR_THICKNESS / 2),
            }} />
          </View>
        );
      })}
    </View>
  );
};

// --- Main KnockoutBrackets Component ---
const KnockoutBrackets = ({ 
  rounds,
  emptyMessage = "No hay brackets eliminatorios disponibles."
}: KnockoutBracketsProps) => {
  if (!rounds || rounds.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  const activeRounds = rounds.filter(round => round.matches && round.matches.length > 0);
  
  if (activeRounds.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay partidos eliminatorios disponibles.</Text>
      </View>
    );
  }

  const groupMatchesByTie = (matches: Match[]): AggregatedMatch[] => {
    const tieGroups: { [key: string]: Match[] } = {};
    matches.forEach(match => {
      const teams = [match.homeTeam.id, match.awayTeam.id].sort();
      const tieKey = teams.join('-');
      if (!tieGroups[tieKey]) {
        tieGroups[tieKey] = [];
      }
      tieGroups[tieKey].push(match);
    });

    return Object.entries(tieGroups).map(([tieKey, tieMatches]) => {
      const sortedMatches = tieMatches.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const firstMatch = sortedMatches[0];
      const homeTeamIdActual = firstMatch.homeTeam.id; 
      const awayTeamIdActual = firstMatch.awayTeam.id;

      let homeTotal = 0;
      let awayTotal = 0;
      let homeLegAwayGoals = 0; 
      let awayLegAwayGoals = 0; 
      let allFinished = true;
      let currentStatus: string = 'PENDIENTE';
      
      sortedMatches.forEach((match, index) => {
        if (match.status === 'FINALIZADO') {
          if (match.homeTeam.id === homeTeamIdActual) { 
            homeTotal += match.homeTeam.score || 0;
            awayTotal += match.awayTeam.score || 0;
            awayLegAwayGoals += match.awayTeam.score || 0;
          } else { 
            homeTotal += match.awayTeam.score || 0; 
            awayTotal += match.homeTeam.score || 0; 
            homeLegAwayGoals += match.awayTeam.score || 0;
          }
        } else {
          allFinished = false;
        }
        // Determine overall status (more nuanced)
        if (index === 0) currentStatus = match.status; // Default to first match status
        if (match.status === 'JUGANDO') currentStatus = 'JUGANDO'; // If any match is playing, tie is playing
      });
      if (allFinished) currentStatus = 'FINALIZADO';


      let winner: string | undefined;
      if (allFinished) {
        if (homeTotal > awayTotal) {
          winner = homeTeamIdActual;
        } else if (awayTotal > homeTotal) {
          winner = awayTeamIdActual;
        } else {
          if (sortedMatches.length === 2) { 
            if (homeLegAwayGoals > awayLegAwayGoals) {
              winner = homeTeamIdActual;
            } else if (awayLegAwayGoals > homeLegAwayGoals) {
              winner = awayTeamIdActual;
            }
          }
        }
      }
      
      const homeTeamInfoForTie = firstMatch.homeTeam.id === homeTeamIdActual ? firstMatch.homeTeam : firstMatch.awayTeam;
      const awayTeamInfoForTie = firstMatch.awayTeam.id === awayTeamIdActual ? firstMatch.awayTeam : firstMatch.homeTeam;

      return {
        id: `tie-${tieKey}`,
        homeTeam: {
          id: homeTeamIdActual,
          name: homeTeamInfoForTie.name,
          logo: homeTeamInfoForTie.logo,
          totalScore: homeTotal,
          awayGoals: homeLegAwayGoals,
        },
        awayTeam: {
          id: awayTeamIdActual,
          name: awayTeamInfoForTie.name,
          logo: awayTeamInfoForTie.logo,
          totalScore: awayTotal,
          awayGoals: awayLegAwayGoals,
        },
        status: currentStatus,
        winner,
        matches: sortedMatches,
      };
    });
  };

  const BracketMatchCard = ({ match }: { match: AggregatedMatch }) => {
    const isFinished = match.status === 'FINALIZADO';
    
    let statusDisplay = 'Por jugar';
    if (match.status === 'FINALIZADO') {
        // No specific status text needed if finished, scores show result
    } else if (match.status === 'JUGANDO') {
        statusDisplay = 'En vivo';
    } else if (match.matches.length === 2) {
        statusDisplay = 'Eliminatoria en curso';
    } else if (match.status && match.status !== 'PROGRAMADO' && match.status !== 'PENDIENTE') {
        statusDisplay = match.status; // Show other specific statuses
    }
    
    return (
      <View style={styles.matchCard}>
        <View style={[ styles.teamRow, match.winner === match.homeTeam.id && styles.winnerRow ]}>
          <View style={styles.teamInfo}>
            {match.homeTeam.logo ? (
              <Image source={{ uri: match.homeTeam.logo }} style={styles.teamLogo} resizeMode="contain" />
            ) : (
              <View style={styles.placeholderLogo}><Text style={styles.placeholderText}>{match.homeTeam.name.substring(0, 2).toUpperCase()}</Text></View>
            )}
            <Text style={[styles.teamName, match.winner === match.homeTeam.id && styles.winnerText]} numberOfLines={1}>
              {match.homeTeam.name}
            </Text>
          </View>
          <View style={[styles.scoreContainer, match.winner === match.homeTeam.id && styles.winnerScore]}>
            <Text style={[styles.scoreText, match.winner === match.homeTeam.id && styles.winnerScoreText]}>
              {isFinished ? match.homeTeam.totalScore : '-'}
            </Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={[styles.teamRow, match.winner === match.awayTeam.id && styles.winnerRow]}>
          <View style={styles.teamInfo}>
            {match.awayTeam.logo ? (
              <Image source={{ uri: match.awayTeam.logo }} style={styles.teamLogo} resizeMode="contain" />
            ) : (
              <View style={styles.placeholderLogo}><Text style={styles.placeholderText}>{match.awayTeam.name.substring(0, 2).toUpperCase()}</Text></View>
            )}
            <Text style={[styles.teamName, match.winner === match.awayTeam.id && styles.winnerText]} numberOfLines={1}>
              {match.awayTeam.name}
            </Text>
          </View>
          <View style={[styles.scoreContainer, match.winner === match.awayTeam.id && styles.winnerScore]}>
            <Text style={[styles.scoreText, match.winner === match.awayTeam.id && styles.winnerScoreText]}>
              {isFinished ? match.awayTeam.totalScore : '-'}
            </Text>
          </View>
        </View>

        {match.status !== 'FINALIZADO' && (
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>
              {statusDisplay}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const RoundColumn = ({ round }: { round: KnockoutRound }) => {
    const aggregatedMatches = groupMatchesByTie(round.matches);
    
    return (
      <View style={styles.roundColumn}>
        <Text style={styles.roundTitle}>{round.name}</Text>
        <View style={styles.matchesColumn}>
          {aggregatedMatches.map((match) => (
            <View key={match.id} style={styles.matchContainer}>
              <BracketMatchCard match={match} />
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeRounds.map((round, index) => {
          const aggregatedMatchesCurrentRound = groupMatchesByTie(round.matches);
          const numMatchesInCurrentRound = aggregatedMatchesCurrentRound.length;

          return (
            <View key={round.id} style={styles.roundWrapper}>
              <RoundColumn round={round} />
              {index < activeRounds.length - 1 && (
                <InterRoundConnector
                  numSourceMatches={numMatchesInCurrentRound}
                />
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 0,
    alignItems: 'center', 
  },
  emptyContainer: {
    padding: 16,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    margin: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: {
    color: colors.text.secondary,
    textAlign: 'center',
    fontSize: 14,
    fontStyle: 'italic',
  },
  roundWrapper: {
    flexDirection: 'row',
    alignItems: 'center', 
  },
  roundColumn: {
    alignItems: 'center',
    // Add some margin to the right of the column before connectors start
    marginRight: CONNECTOR_HORIZONTAL_SEGMENT_LENGTH > 10 ? 0 : 5, // Only if connectors are very short
  },
  roundTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 20,
    textAlign: 'center',
    width: 180, // Consider making this dynamic or larger if round names are long
  },
  matchesColumn: {
    alignItems: 'center',
    gap: MATCH_SPACING_IN_COLUMN, 
  },
  matchContainer: {
    alignItems: 'center',
  },
  matchCard: {
    width: 250, // Or make it a prop/constant
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
    backgroundColor: colors.interactive.primary + '1A', // Slightly more subtle
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
    flexShrink: 1, // Allow text to shrink if too long
    fontWeight: '500',
  },
  winnerText: {
    color: colors.text.primary,
    fontWeight: '700', // Bolder for winner
  },
  scoreContainer: {
    minWidth: 24, // Slightly wider for scores like "10"
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
    fontWeight: '700', // Bolder scores
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
    paddingBottom: 4, // Add some padding if status is present
    alignItems: 'center',
  },
  statusText: {
    fontSize: 10,
    color: colors.text.muted,
    fontStyle: 'italic',
  },
  interRoundConnectorContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 0, // Horizontal space is handled by segments now
    // This view itself should not have much horizontal space, segments define it
    // marginRight is important to space out from the next round column
    marginHorizontal: CONNECTOR_HORIZONTAL_SEGMENT_LENGTH > 10 ? 5 : 10, 
  },
});

export default KnockoutBrackets;