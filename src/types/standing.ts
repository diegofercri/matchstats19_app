import { Team } from './team';
import { FormResult } from './team';

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
  form?: FormResult[];
}