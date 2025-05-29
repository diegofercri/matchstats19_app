import { Team } from './team';
import { Match } from './match';
import { StandingEntry } from './standing';

export type PhaseType = 'groups' | 'knockout' | 'league';

export interface Phase {
  id: string;
  name: string;
  type: PhaseType;
}

export interface Group {
  id: string;
  name: string;
  teams: Team[];
  matches: Match[];
  standings: StandingEntry[];
}

export interface GroupPhase extends Phase {
  type: 'groups';
  groups: Group[];
}

export interface KnockoutRound {
  id: string;
  name: string;
  matches: Match[];
}

export interface KnockoutPhase extends Phase {
  type: 'knockout';
  rounds: KnockoutRound[];
}

export interface LeaguePhase extends Phase {
  type: 'league';
  matches: Match[];
  standings: StandingEntry[];
}

export type CompetitionPhase = GroupPhase | KnockoutPhase | LeaguePhase;