import { TeamInMatch } from './team';
import { Team } from './team'; // Asumo que HeadToHead podría necesitar Team directamente

export type MatchStatus = 'PROGRAMADO' | 'JUGANDO' | 'DESCANSO' | 'FINALIZADO';

export interface Match {
  id: string;
  date: string;
  time: string;
  round: string;
  homeTeam: TeamInMatch;
  awayTeam: TeamInMatch;
  status: MatchStatus;
}

export interface MatchFilters {
  teamId?: string;
  status?: MatchStatus;
  dateFrom?: string;
  dateTo?: string;
  round?: string;
}

export interface HeadToHead {
  team1: Team;
  team2: Team;
  matches: Match[];
  team1Wins: number;
  team2Wins: number;
  draws: number;
}