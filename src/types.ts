// En tu archivo types.ts (o similar)

export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
}

export interface Team {
  id: string;
  name: string;
  logo?: string; // URL del logo del equipo
  // podrías añadir más detalles: shortName, city, etc.
}

export interface Match {
  id: string;
  date: string;       // Fecha en formato ISO (YYYY-MM-DD)
  time: string;       // Hora (ej: "21:00")
  round?: string;      // Jornada, Fase (ej: "Jornada 1", "Semifinal")
  homeTeam: {
    id: string;
    name: string;
    score: number | null; // null si el partido no se ha jugado o no hay resultado aún
    logo?: string;
  };
  awayTeam: {
    id: string;
    name: string;
    score: number | null;
    logo?: string;
  };
  status: 'PROGRAMADO' | 'EN VIVO' | 'FINALIZADO' | 'POSPUESTO'; // Estados del partido
  // podrías añadir: venue, referee, etc.
}

export interface StandingEntry { // Entrada en la tabla de clasificación
  position: number;
  team: { // Referencia simplificada al equipo
    id: string;
    name: string;
    logo?: string;
  };
  played: number;    // Partidos Jugados
  won: number;       // Ganados
  drawn: number;     // Empatados
  lost: number;      // Perdidos
  goalsFor: number;  // Goles a Favor
  goalsAgainst: number; // Goles en Contra
  goalDifference: number; // Diferencia de Goles
  points: number;    // Puntos
  form?: ('G' | 'E' | 'P')[]; // Forma reciente (Ganado, Empatado, Perdido) ej: ['G', 'E', 'P', 'G', 'G']
}

export interface Season {
  id: string;
  name: string;        // ej: "2024/2025"
  teams?: Team[];       // Lista de equipos participantes en esta temporada
  matches?: Match[];    // Lista de partidos de esta temporada
  standings?: StandingEntry[]; // Tabla de clasificación de esta temporada (si aplica)
  // podrías añadir: topScorers, seasonWinner, etc.
}

export interface Competition {
  id: string;
  name: string;
  image: string;        // Imagen principal de la competición
  description: string;
  startDate: string;
  endDate: string;
  seasons?: Season[];
  defaultSeasonId?: string;
}