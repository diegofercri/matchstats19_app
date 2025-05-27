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
  status: 'PROGRAMADO' | 'JUGANDO' | 'DESCANSO' | 'FINALIZADO'; // Estados del partido
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

// Nuevo: Grupo dentro de una fase de grupos
export interface Group {
  id: string;
  name: string;        // ej: "Grupo A", "Grupo B"
  teams: Team[];       // Equipos del grupo
  matches: Match[];    // Partidos del grupo
  standings: StandingEntry[]; // Clasificación del grupo
}

// Nuevo: Ronda dentro de una fase eliminatoria
export interface KnockoutRound {
  id: string;
  name: string;        // ej: "Octavos de Final", "Cuartos de Final"
  matches: Match[];    // Partidos de esta ronda
}

// Nuevo: Fase de una temporada
export interface Phase {
  id: string;
  name: string;        // ej: "Fase de Grupos", "Fase Eliminatoria"
  type: 'groups' | 'knockout'; // Tipo de fase
  
  // Para fases de grupos
  groups?: Group[];
  
  // Para fases eliminatorias
  rounds?: KnockoutRound[];
}

export interface Season {
  id: string;
  name: string;        // ej: "2024/2025"
  teams?: Team[];       // Lista de equipos participantes en esta temporada
  
  // Nuevo sistema de fases
  phases?: Phase[];     // Fases de la temporada (grupos, eliminatorias, etc.)
  
  // Sistema legacy (para competiciones sin fases como LaLiga)
  matches?: Match[];    // Lista de partidos de esta temporada
  standings?: StandingEntry[]; // Clasificación general
  
  startDate: string;
  endDate: string;
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