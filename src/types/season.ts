import { Team } from './team';
import { Match } from './match';
import { StandingEntry } from './standing';
import { CompetitionPhase } from './phase';

export interface Season {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  teams: Team[];
  phases?: CompetitionPhase[];
  // Campos legacy para compatibilidad
  matches?: Match[];
  standings?: StandingEntry[];
}