import { TeamInMatch } from './team';
import { Team } from './team'; // Assume HeadToHead might need Team directly

/**
 * Match status type with Spanish values for UI display
 */
export type MatchStatus = 'PROGRAMADO' | 'JUGANDO' | 'DESCANSO' | 'FINALIZADO';

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
 * Interface representing head-to-head statistics between two teams
 * Contains historical match data and win/loss/draw statistics
 */
export interface HeadToHead {
  team1: Team;
  team2: Team;
  matches: Match[];
  team1Wins: number;
  team2Wins: number;
  draws: number;
}