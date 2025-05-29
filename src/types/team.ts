export interface Team {
  id: string;
  name: string;
  logo: string;
}

export interface TeamInMatch {
  id: string;
  name: string;
  logo: string;
  score: number | null;
}

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

export type FormResult = 'G' | 'E' | 'P'; // Ganado, Empatado, Perdido