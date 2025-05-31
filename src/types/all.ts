/**
 * Interface representing a football competition
 * Contains all the information about a tournament/league including its seasons
 */
export interface Competition {
  id: string;
  name: string;
  image: string;
  description: string;
  startDate: string;
  endDate: string;
  seasons: Season[];
  defaultSeasonId?: string;
}

/**
 * Interface representing a selected competition with its active season
 * Used for managing the current competition and season context in the app
 */
export interface SelectedCompetition {
  competition: Competition;
  season: Season;
}

/**
 * Match status type with Spanish values for UI display
 */
export type MatchStatus = "PROGRAMADO" | "JUGANDO" | "DESCANSO" | "FINALIZADO";

/**
 * Interface representing a football match
 * Contains all match information including teams, timing, and current status
 */
export interface Match {
  id: string;
  date: string;
  time: string;
  round: string;
  homeTeam: TeamInMatch;
  awayTeam: TeamInMatch;
  status: MatchStatus;
}

/**
 * Interface for filtering matches based on various criteria
 * Used for search and filtering functionality in match lists
 */
export interface MatchFilters {
  teamId?: string;
  status?: MatchStatus;
  dateFrom?: string;
  dateTo?: string;
  round?: string;
}

/**
 * Type representing different phase formats in a competition
 */
export type PhaseType = "groups" | "knockout" | "league";

/**
 * Base interface for a competition phase
 * Contains common properties shared by all phase types
 */
export interface Phase {
  id: string;
  name: string;
  type: PhaseType;
}

/**
 * Interface representing a group within a group phase
 * Contains teams, their matches, and current standings
 */
export interface Group {
  id: string;
  name: string;
  teams: Team[];
  matches: Match[];
  standings: StandingEntry[];
}

/**
 * Interface for group phase of a competition
 * Extends base Phase with groups-specific properties
 */
export interface GroupPhase extends Phase {
  type: "groups";
  groups: Group[];
}

/**
 * Interface representing a single round in knockout phase
 * Contains all matches for that specific knockout round
 */
export interface KnockoutRound {
  id: string;
  name: string;
  matches: Match[];
}

/**
 * Interface for knockout phase of a competition
 * Extends base Phase with knockout-specific properties
 */
export interface KnockoutPhase extends Phase {
  type: "knockout";
  rounds: KnockoutRound[];
}

/**
 * Interface for league phase of a competition
 * Extends base Phase with league-specific properties
 */
export interface LeaguePhase extends Phase {
  type: "league";
  matches: Match[];
  standings: StandingEntry[];
}

/**
 * Union type representing any type of competition phase
 * Used for type-safe handling of different phase formats
 */
export type CompetitionPhase = GroupPhase | KnockoutPhase | LeaguePhase;

/**
 * Interface representing a user profile
 * Contains personal information and identification data for app users
 */
export interface Profile {
  id: string;
  name: string;
  surname: string;
  email: string;
  image: string;
}

/**
 * Interface representing a season within a competition
 * Contains all teams, phases, and legacy support for backwards compatibility
 */
export interface Season {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  teams: Team[];
  phases?: CompetitionPhase[];
  // Legacy fields for backwards compatibility
  matches?: Match[];
  standings?: StandingEntry[];
}

/**
 * Interface representing a single entry in competition standings/table
 * Contains team position, statistics, and recent form data
 */
export interface StandingEntry {
  position: number;
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

/**
 * Interface representing a football team
 * Contains basic team information used throughout the application
 */
export interface Team {
  id: string;
  name: string;
  logo: string;
}

/**
 * Interface representing a team within a specific match context
 * Extends basic team info with match-specific score data
 */
export interface TeamInMatch {
  id: string;
  name: string;
  logo: string;
  score: number | null;
}
