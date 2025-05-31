import { TeamInMatch } from './team';

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