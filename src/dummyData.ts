import { User, Competition, Season, Team, Match, StandingEntry } from './types';

export const dummyUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
];

const teamsData: { [key: string]: Team } = {
  // LaLiga
  't1': { id: 't1', name: 'Real Madrid', logo: 'https://img.sofascore.com/api/v1/team/2829/image' },
  't2': { id: 't2', name: 'FC Barcelona', logo: 'https://img.sofascore.com/api/v1/team/2817/image' },
  't3': { id: 't3', name: 'Atlético Madrid', logo: 'https://img.sofascore.com/api/v1/team/2836/image' },
  't4': { id: 't4', name: 'Sevilla FC', logo: 'https://img.sofascore.com/api/v1/team/2819/image' },
  't_val': {id: 't_val', name: 'Valencia CF', logo: 'https://img.sofascore.com/api/v1/team/2820/image'},
  't_rsoc': {id: 't_rsoc', name: 'Real Sociedad', logo: 'https://img.sofascore.com/api/v1/team/2824/image'},


  // Equipos Internacionales (UCL)
  't5': { id: 't5', name: 'Manchester City', logo: 'https://img.sofascore.com/api/v1/team/17/image' },
  't6': { id: 't6', name: 'Bayern München', logo: 'https://img.sofascore.com/api/v1/team/2672/image' },
  't7': { id: 't7', name: 'Paris Saint-Germain', logo: 'https://img.sofascore.com/api/v1/team/1644/image' },
  't8': { id: 't8', name: 'Inter', logo: 'https://img.sofascore.com/api/v1/team/2697/image' },
  't_liv': {id: 't_liv', name: 'Liverpool', logo: 'https://img.sofascore.com/api/v1/team/44/image'},
  't_juv': {id: 't_juv', name: 'Juventus', logo: 'https://img.sofascore.com/api/v1/team/2687/image'},

};

export const dummyCompetitions: Competition[] = [
  {
    id: '1',
    name: 'LaLiga',
    image: 'https://img.sofascore.com/api/v1/unique-tournament/8/image/dark',
    description: 'El Mafioso de Tebas',
    startDate: '2023-08-11', // Ajusto fechas para que tengan más sentido con las temporadas
    endDate: '2024-05-26',
    seasons: [
      { 
        id: 'laliga-s2025-26', name: '2025/2026',
        teams: [teamsData['t1'], teamsData['t2'], teamsData['t3'], teamsData['t4'], teamsData['t_val'], teamsData['t_rsoc']],
        matches: [
          { id: 'll_2526_m1', date: '2025-08-16', time: '21:00', round: 'Jornada 1', homeTeam: {id: teamsData['t1'].id, name: teamsData['t1'].name, logo: teamsData['t1'].logo, score: null}, awayTeam: {id: teamsData['t4'].id, name: teamsData['t4'].name, logo: teamsData['t4'].logo, score: null}, status: 'PROGRAMADO'},
        ],
        standings: [], // Clasificación vacía al inicio
      },
      { 
        id: 'laliga-s2024-25', name: '2024/2025',
        teams: [teamsData['t1'], teamsData['t2'], teamsData['t3'], teamsData['t4'], teamsData['t_val'], teamsData['t_rsoc']],
        matches: [
          { id: 'll_2425_m1', date: '2025-05-18', time: '21:00', round: 'Jornada 38', homeTeam: {id: teamsData['t1'].id, name: teamsData['t1'].name, logo: teamsData['t1'].logo, score: 2}, awayTeam: {id: teamsData['t2'].id, name: teamsData['t2'].name, logo: teamsData['t2'].logo, score: 2}, status: 'FINALIZADO'},
          { id: 'll_2425_m2', date: '2025-05-18', time: '21:00', round: 'Jornada 38', homeTeam: {id: teamsData['t3'].id, name: teamsData['t3'].name, logo: teamsData['t3'].logo, score: 1}, awayTeam: {id: teamsData['t4'].id, name: teamsData['t4'].name, logo: teamsData['t4'].logo, score: 0}, status: 'FINALIZADO'},
        ],
        standings: [
          { position: 1, team: {id: teamsData['t1'].id, name: teamsData['t1'].name, logo: teamsData['t1'].logo}, played: 38, won: 29, drawn: 6, lost: 3, goalsFor: 87, goalsAgainst: 26, goalDifference: 61, points: 93, form: ['G','G','G','E','G']},
          { position: 2, team: {id: teamsData['t2'].id, name: teamsData['t2'].name, logo: teamsData['t2'].logo}, played: 38, won: 26, drawn: 7, lost: 5, goalsFor: 79, goalsAgainst: 44, goalDifference: 35, points: 85, form: ['G','G','E','G','P']},
          { position: 3, team: {id: teamsData['t_val'].id, name: teamsData['t_val'].name, logo: teamsData['t_val'].logo}, played: 38, won: 20, drawn: 9, lost: 9, goalsFor: 55, goalsAgainst: 30, goalDifference: 25, points: 69, form: ['G','P','G','E','G']},
          { position: 4, team: {id: teamsData['t3'].id, name: teamsData['t3'].name, logo: teamsData['t3'].logo}, played: 38, won: 20, drawn: 8, lost: 10, goalsFor: 60, goalsAgainst: 40, goalDifference: 20, points: 68, form: ['P','G','P','G','E']},
        ],
      },
      { 
        id: 'laliga-s2023-24', name: '2023/2024',
        teams: [teamsData['t1'], teamsData['t2'], teamsData['t3'], teamsData['t4']],
        matches: [
          { id: 'll_2324_m1', date: '2024-05-20', time: '21:00', round: 'Jornada 38', homeTeam: {id: teamsData['t1'].id, name: teamsData['t1'].name, logo: teamsData['t1'].logo, score: 3}, awayTeam: {id: teamsData['t4'].id, name: teamsData['t4'].name, logo: teamsData['t4'].logo, score: 1}, status: 'FINALIZADO'},
        ],
        standings: [
          { position: 1, team: {id: teamsData['t1'].id, name: teamsData['t1'].name, logo: teamsData['t1'].logo}, played: 38, won: 30, drawn: 5, lost: 3, goalsFor: 90, goalsAgainst: 25, goalDifference: 65, points: 95},
          { position: 2, team: {id: teamsData['t2'].id, name: teamsData['t2'].name, logo: teamsData['t2'].logo}, played: 38, won: 28, drawn: 4, lost: 6, goalsFor: 85, goalsAgainst: 30, goalDifference: 55, points: 88},
        ],
      },
    ],
    defaultSeasonId: 'laliga-s2024-25',
  },
  {
    id: '2',
    name: 'Champions League',
    image: 'https://img.sofascore.com/api/v1/unique-tournament/7/image/dark',
    description: 'Ceferin Cup',
    startDate: '2023-09-19', // Ajusto fechas
    endDate: '2024-06-01',
    seasons: [
      { 
        id: 'ucl-s2025-26', name: '2025/2026',
        teams: [teamsData['t1'], teamsData['t5'], teamsData['t6'], teamsData['t7'], teamsData['t8'], teamsData['t_liv'], teamsData['t_juv']],
        matches: [
          { id: 'ucl_2526_m1', date: '2025-09-16', time: '21:00', round: 'Fase de Grupos - J1', homeTeam: {id: teamsData['t5'].id, name: teamsData['t5'].name, logo: teamsData['t5'].logo, score: null}, awayTeam: {id: teamsData['t6'].id, name: teamsData['t6'].name, logo: teamsData['t6'].logo, score: null}, status: 'PROGRAMADO'},
        ],
        // Standings en UCL son por grupo, aquí simplificado o mostrando una "clasificación general" teórica
        standings: [],
      },
      { 
        id: 'ucl-s2024-25', name: '2024/2025',
        teams: [teamsData['t1'], teamsData['t5'], teamsData['t6'], teamsData['t7'], teamsData['t8'], teamsData['t_liv']],
        matches: [
          { id: 'ucl_2425_final', date: '2025-05-31', time: '21:00', round: 'Final', homeTeam: {id: teamsData['t1'].id, name: teamsData['t1'].name, logo: teamsData['t1'].logo, score: 2}, awayTeam: {id: teamsData['t5'].id, name: teamsData['t5'].name, logo: teamsData['t5'].logo, score: 1}, status: 'FINALIZADO'},
          { id: 'ucl_2425_sf1', date: '2025-05-07', time: '21:00', round: 'Semifinal', homeTeam: {id: teamsData['t6'].id, name: teamsData['t6'].name, logo: teamsData['t6'].logo, score: 0}, awayTeam: {id: teamsData['t1'].id, name: teamsData['t1'].name, logo: teamsData['t1'].logo, score: 1}, status: 'FINALIZADO'},
        ],
        // Podríamos indicar el ganador aquí en lugar de una tabla completa
        // standings: [{ team: teamsData['t1'], status: 'Campeón'}] 
      },
    ],
    defaultSeasonId: 'ucl-s2024-25',
  },
  {
    id: '3',
    name: 'Copa del Rey',
    image: 'https://img.sofascore.com/api/v1/unique-tournament/329/image/dark',
    description: 'Nos Gusta el Jamón',
    startDate: '2023-11-01', // Ajusto fechas
    endDate: '2024-04-06',
    seasons: [
      { 
        id: 'cdr-s2024-25', name: '2024/2025',
        teams: [teamsData['t1'], teamsData['t2'], teamsData['t3'], teamsData['t4']], // Equipos que suelen llegar lejos
        matches: [
          { id: 'cdr_2425_final', date: '2025-04-26', time: '22:00', round: 'Final', homeTeam: {id: teamsData['t2'].id, name: teamsData['t2'].name, logo: teamsData['t2'].logo, score: 2}, awayTeam: {id: teamsData['t3'].id, name: teamsData['t3'].name, logo: teamsData['t3'].logo, score: 1}, status: 'FINALIZADO'},
          { id: 'cdr_2425_sf', date: '2025-04-02', time: '21:00', round: 'Semifinal', homeTeam: {id: teamsData['t1'].id, name: teamsData['t1'].name, logo: teamsData['t1'].logo, score: 0}, awayTeam: {id: teamsData['t2'].id, name: teamsData['t2'].name, logo: teamsData['t2'].logo, score: 1}, status: 'FINALIZADO'},
        ],
        // Para la Copa, una tabla de clasificación completa no es común. 
        // Podrías listar fases, o el ganador. Dejaré standings vacío o con info del ganador.
        // standings: [{ details: 'Ganador: FC Barcelona' }] 
      },
      { 
        id: 'cdr-s2023-24', name: '2023/2024',
        teams: [teamsData['t1'], teamsData['t2'], teamsData['t_rsoc'], teamsData['t_val']],
        matches: [
          { id: 'cdr_2324_final', date: '2024-04-06', time: '22:00', round: 'Final', homeTeam: {id: teamsData['t_val'].id, name: teamsData['t_val'].name, logo: teamsData['t_val'].logo, score: 1}, awayTeam: {id: teamsData['t_rsoc'].id, name: teamsData['t_rsoc'].name, logo: teamsData['t_rsoc'].logo, score: 2}, status: 'FINALIZADO'},
        ],
      },
    ],
    defaultSeasonId: 'cdr-s2024-25',
  },
];