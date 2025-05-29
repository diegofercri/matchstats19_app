import { Season } from './season';

export interface Competition {
  id: string;
  name: string;
  image: string;
  description: string;
  startDate: string;
  endDate: string;
  seasons: Season[];
  defaultSeasonId?: string;
}

export interface SelectedCompetition {
  competition: Competition;
  season: Season;
}