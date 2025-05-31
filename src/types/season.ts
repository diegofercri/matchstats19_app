import { Team } from './team';
import { Match } from './match';
import { StandingEntry } from './standing';
import { CompetitionPhase } from './phase';

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