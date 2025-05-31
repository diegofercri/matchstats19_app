import { Season } from './season';

/**
 * Interface representing a football competition
 * Contains all the information about a tournament/league including its seasons
 */
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

/**
 * Interface representing a selected competition with its active season
 * Used for managing the current competition and season context in the app
 */
export interface SelectedCompetition {
  competition: Competition;
  season: Season;
}