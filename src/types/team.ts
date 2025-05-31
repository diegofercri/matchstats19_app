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

/**
 * Interface containing comprehensive team statistics
 * Includes match record, goals, points, and recent form
 */
export interface TeamStats {
  team: Team;
  totalMatches: number;
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
  points: number;
  recentForm: FormResult[];
}

/**
 * Type representing match results for team form tracking
 * G = Ganado (Won), E = Empatado (Draw), P = Perdido (Lost)
 */
export type FormResult = 'G' | 'E' | 'P'; // Ganado, Empatado, Perdido