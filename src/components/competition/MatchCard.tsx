import { View, Text, StyleSheet, Image } from "react-native";
import { colors } from "@colors";
import { Match } from "@types";
import { useMatchStatus } from "@hooks/useMatchStatus";
import { useMatchFormatting } from "@hooks/useMatchFormatting";

/**
 * Props interface for MatchCard component
 * Defines match data and display options for individual match cards
 */
interface MatchCardProps {
  match: Match;
  showRound?: boolean;
}

/**
 * Match card component for displaying individual match information
 * Features team logos, scores, date/time, and match status with dynamic styling
 * Supports optional round display and live match highlighting
 * 
 * @param props - Match card properties including match data and display options
 * @returns JSX element containing complete match information card
 */
const MatchCard = ({ match, showRound = false }: MatchCardProps) => {
  const { statusBadgeStyle, statusText, isLiveMatch } = useMatchStatus(match);

  const { formattedDate, scoreText } = useMatchFormatting(match);

  return (
    <View style={styles.matchCard}>
      {showRound && match.round && (
        <Text style={styles.roundText}>{match.round}</Text>
      )}

      <View style={styles.matchContent}>
        <TeamSection team={match.homeTeam} />

        <MatchCenter
          date={formattedDate}
          time={match.time}
          score={scoreText}
          isLive={isLiveMatch}
          statusBadgeStyle={statusBadgeStyle}
          statusText={statusText}
        />

        <TeamSection team={match.awayTeam} />
      </View>
    </View>
  );
};

/**
 * Props interface for TeamSection component
 * Defines team information for logo and name display
 */
interface TeamSectionProps {
  team: {
    name: string;
    logo?: string;
  };
}

/**
 * Team section component displaying team logo and name
 * Shows team logo or initials placeholder with team name below
 * Features responsive design with logo fallback handling
 * 
 * @param props - Team section properties including team data
 * @returns JSX element containing team logo/placeholder and name
 */
const TeamSection = ({ team }: TeamSectionProps) => (
  <View style={styles.teamContainer}>
    <View style={styles.shieldContainer}>
      {team.logo ? (
        <Image
          source={{ uri: team.logo }}
          style={styles.teamShield}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.placeholderShield}>
          <Text style={styles.placeholderText}>
            {team.name.substring(0, 2).toUpperCase()}
          </Text>
        </View>
      )}
    </View>
    <Text style={styles.teamName} numberOfLines={2}>
      {team.name}
    </Text>
  </View>
);

/**
 * Props interface for MatchCenter component
 * Defines central match information including time, score, and status
 */
interface MatchCenterProps {
  date: string;
  time: string;
  score: string;
  isLive: boolean;
  statusBadgeStyle: any[];
  statusText: string;
}

/**
 * Match center component displaying core match information
 * Shows date, time, score, and status with dynamic styling for live matches
 * Features highlighted display for ongoing matches
 * 
 * @param props - Match center properties including timing, score, and status data
 * @returns JSX element containing central match information with status badge
 */
const MatchCenter = ({
  date,
  time,
  score,
  isLive,
  statusBadgeStyle,
  statusText,
}: MatchCenterProps) => (
  <View style={styles.centerContainer}>
    <Text style={styles.dateText}>{date}</Text>
    <Text style={styles.timeText}>{time}</Text>
    <Text style={[styles.scoreText, isLive && styles.liveScore]}>{score}</Text>
    <View style={statusBadgeStyle}>
      <Text
        style={[
          styles.statusText,
          {
            color: isLive
              ? colors.interactive.primaryText
              : colors.text.primary,
          },
        ]}
      >
        {statusText}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  matchCard: {
    marginBottom: 16,
    paddingVertical: 24,
    paddingHorizontal: 12,
    backgroundColor: colors.background.surface,
    borderRadius: 16,
    shadowColor: "#000",
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
    fontWeight: "500",
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
    fontWeight: "bold",
    color: colors.text.secondary,
  },
  teamName: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 16,
    fontWeight: "500",
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
    fontWeight: "500",
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