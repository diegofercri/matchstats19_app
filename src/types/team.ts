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