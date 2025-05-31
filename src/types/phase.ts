import { Team } from './team';
import { Match } from './match';
import { StandingEntry } from './standing';

/**
 * Type representing different phase formats in a competition
 */
export type PhaseType = 'groups' | 'knockout' | 'league';

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
  type: 'groups';
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
  type: 'knockout';
  rounds: KnockoutRound[];
}

/**
 * Interface for league phase of a competition
 * Extends base Phase with league-specific properties
 */
export interface LeaguePhase extends Phase {
  type: 'league';
  matches: Match[];
  standings: StandingEntry[];
}

/**
 * Union type representing any type of competition phase
 * Used for type-safe handling of different phase formats
 */
export type CompetitionPhase = GroupPhase | KnockoutPhase | LeaguePhase;