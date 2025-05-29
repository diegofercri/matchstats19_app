// dummyData.ts
import {
  User,
  Competition,
  Team,
} from "@types";

export const dummyUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
  },
];

const teamsData: { [key: string]: Team } = {
  // LaLiga
  t1: {
    id: "t1",
    name: "Real Madrid",
    logo: "https://img.sofascore.com/api/v1/team/2829/image",
  },
  t2: {
    id: "t2",
    name: "FC Barcelona",
    logo: "https://img.sofascore.com/api/v1/team/2817/image",
  },
  t3: {
    id: "t3",
    name: "Atlético Madrid",
    logo: "https://img.sofascore.com/api/v1/team/2836/image",
  },
  t4: {
    id: "t4",
    name: "Sevilla FC",
    logo: "https://img.sofascore.com/api/v1/team/2819/image",
  },
  t_val: {
    id: "t_val",
    name: "Valencia CF",
    logo: "https://img.sofascore.com/api/v1/team/2820/image",
  },
  t_rsoc: {
    id: "t_rsoc",
    name: "Real Sociedad",
    logo: "https://img.sofascore.com/api/v1/team/2824/image",
  },

  // Equipos Internacionales (UCL)
  t5: {
    id: "t5",
    name: "Manchester City",
    logo: "https://img.sofascore.com/api/v1/team/17/image",
  },
  t6: {
    id: "t6",
    name: "Bayern München",
    logo: "https://img.sofascore.com/api/v1/team/2672/image",
  },
  t7: {
    id: "t7",
    name: "Paris Saint-Germain",
    logo: "https://img.sofascore.com/api/v1/team/1644/image",
  },
  t8: {
    id: "t8",
    name: "Inter",
    logo: "https://img.sofascore.com/api/v1/team/2697/image",
  },
  t_liv: {
    id: "t_liv",
    name: "Liverpool",
    logo: "https://img.sofascore.com/api/v1/team/44/image",
  },
  t_juv: {
    id: "t_juv",
    name: "Juventus",
    logo: "https://img.sofascore.com/api/v1/team/2687/image",
  },
  // Equipos adicionales para completar grupos
  t_arsenal: {
    id: "t_arsenal",
    name: "Arsenal",
    logo: "https://img.sofascore.com/api/v1/team/42/image",
  },
  t_milan: {
    id: "t_milan",
    name: "AC Milan",
    logo: "https://img.sofascore.com/api/v1/team/2692/image",
  },
};

export const dummyCompetitions: Competition[] = [
  {
    id: "1",
    name: "LaLiga",
    image: "https://img.sofascore.com/api/v1/unique-tournament/8/image/dark",
    description: "El Mafioso de Tebas",
    startDate: "2023-08-11",
    endDate: "2024-05-26",
    seasons: [
      {
        id: "laliga-s2025-26",
        name: "2025/2026",
        startDate: "2025-08-15",
        endDate: "2026-05-24",
        teams: [
          teamsData["t1"],
          teamsData["t2"],
          teamsData["t3"],
          teamsData["t4"],
          teamsData["t_val"],
          teamsData["t_rsoc"],
        ],
        matches: [
          {
            id: "ll_2526_m1",
            date: "2025-08-16",
            time: "21:00",
            round: "Jornada 1",
            homeTeam: {
              id: teamsData["t1"].id,
              name: teamsData["t1"].name,
              logo: teamsData["t1"].logo,
              score: null,
            },
            awayTeam: {
              id: teamsData["t4"].id,
              name: teamsData["t4"].name,
              logo: teamsData["t4"].logo,
              score: null,
            },
            status: "PROGRAMADO",
          },
        ],
        standings: [],
      },
      {
        startDate: "2024-08-16",
        endDate: "2025-05-25",
        id: "laliga-s2024-25",
        name: "2024/2025",
        teams: [
          teamsData["t1"],
          teamsData["t2"],
          teamsData["t3"],
          teamsData["t4"],
          teamsData["t_val"],
          teamsData["t_rsoc"],
        ],
        matches: [
          {
            id: "ll_2425_m1",
            date: "2025-05-18",
            time: "21:00",
            round: "Jornada 38",
            homeTeam: {
              id: teamsData["t1"].id,
              name: teamsData["t1"].name,
              logo: teamsData["t1"].logo,
              score: 2,
            },
            awayTeam: {
              id: teamsData["t2"].id,
              name: teamsData["t2"].name,
              logo: teamsData["t2"].logo,
              score: 2,
            },
            status: "FINALIZADO",
          },
          {
            id: "ll_2425_m2",
            date: "2025-05-18",
            time: "21:00",
            round: "Jornada 38",
            homeTeam: {
              id: teamsData["t3"].id,
              name: teamsData["t3"].name,
              logo: teamsData["t3"].logo,
              score: 1,
            },
            awayTeam: {
              id: teamsData["t4"].id,
              name: teamsData["t4"].name,
              logo: teamsData["t4"].logo,
              score: 0,
            },
            status: "FINALIZADO",
          },
        ],
        standings: [
          {
            position: 1,
            team: {
              id: teamsData["t1"].id,
              name: teamsData["t1"].name,
              logo: teamsData["t1"].logo,
            },
            played: 38,
            won: 29,
            drawn: 6,
            lost: 3,
            goalsFor: 87,
            goalsAgainst: 26,
            goalDifference: 61,
            points: 93,
            form: ["G", "G", "G", "E", "G"],
          },
          {
            position: 2,
            team: {
              id: teamsData["t2"].id,
              name: teamsData["t2"].name,
              logo: teamsData["t2"].logo,
            },
            played: 38,
            won: 26,
            drawn: 7,
            lost: 5,
            goalsFor: 79,
            goalsAgainst: 44,
            goalDifference: 35,
            points: 85,
            form: ["G", "G", "E", "G", "P"],
          },
          {
            position: 3,
            team: {
              id: teamsData["t_val"].id,
              name: teamsData["t_val"].name,
              logo: teamsData["t_val"].logo,
            },
            played: 38,
            won: 20,
            drawn: 9,
            lost: 9,
            goalsFor: 55,
            goalsAgainst: 30,
            goalDifference: 25,
            points: 69,
            form: ["G", "P", "G", "E", "G"],
          },
          {
            position: 4,
            team: {
              id: teamsData["t3"].id,
              name: teamsData["t3"].name,
              logo: teamsData["t3"].logo,
            },
            played: 38,
            won: 20,
            drawn: 8,
            lost: 10,
            goalsFor: 60,
            goalsAgainst: 40,
            goalDifference: 20,
            points: 68,
            form: ["P", "G", "P", "G", "E"],
          },
        ],
      },
      {
        startDate: "2023-08-11",
        endDate: "2024-05-26",
        id: "laliga-s2023-24",
        name: "2023/2024",
        teams: [
          teamsData["t1"],
          teamsData["t2"],
          teamsData["t3"],
          teamsData["t4"],
        ],
        matches: [
          {
            id: "ll_2324_m1",
            date: "2024-05-20",
            time: "21:00",
            round: "Jornada 38",
            homeTeam: {
              id: teamsData["t1"].id,
              name: teamsData["t1"].name,
              logo: teamsData["t1"].logo,
              score: 3,
            },
            awayTeam: {
              id: teamsData["t4"].id,
              name: teamsData["t4"].name,
              logo: teamsData["t4"].logo,
              score: 1,
            },
            status: "FINALIZADO",
          },
        ],
        standings: [
          {
            position: 1,
            team: {
              id: teamsData["t1"].id,
              name: teamsData["t1"].name,
              logo: teamsData["t1"].logo,
            },
            played: 38,
            won: 30,
            drawn: 5,
            lost: 3,
            goalsFor: 90,
            goalsAgainst: 25,
            goalDifference: 65,
            points: 95,
          },
          {
            position: 2,
            team: {
              id: teamsData["t2"].id,
              name: teamsData["t2"].name,
              logo: teamsData["t2"].logo,
            },
            played: 38,
            won: 28,
            drawn: 4,
            lost: 6,
            goalsFor: 85,
            goalsAgainst: 30,
            goalDifference: 55,
            points: 88,
          },
        ],
      },
    ],
    defaultSeasonId: "laliga-s2024-25",
  },
  // Champions League coherent data - Add this to your dummyData.ts

  // Update the Champions League competition in dummyCompetitions array:
  {
    id: "2",
    name: "Champions League",
    image: "https://img.sofascore.com/api/v1/unique-tournament/7/image/dark",
    description: "Ceferin Cup",
    startDate: "2023-09-19",
    endDate: "2024-06-01",
    seasons: [
      // 2024/2025 Season with coherent data
      {
        startDate: "2024-09-17",
        endDate: "2025-05-31",
        id: "ucl-s2024-25",
        name: "2024/2025",
        teams: [
          teamsData["t1"], // Real Madrid
          teamsData["t5"], // Manchester City
          teamsData["t6"], // Bayern München
          teamsData["t7"], // Paris Saint-Germain
          teamsData["t8"], // Inter
          teamsData["t_liv"], // Liverpool
          teamsData["t_juv"], // Juventus
          teamsData["t_arsenal"], // Arsenal
        ],
        phases: [
          {
            id: "ucl_2425_groups",
            name: "Fase de Grupos",
            type: "groups",
            groups: [
              {
                id: "group_a_2425",
                name: "Grupo A",
                teams: [
                  teamsData["t1"], // Real Madrid
                  teamsData["t5"], // Manchester City
                  teamsData["t8"], // Inter
                  teamsData["t_juv"], // Juventus
                ],
                matches: [
                  // Jornada 1
                  {
                    id: "ucl_2425_ga_m1",
                    date: "2024-09-17",
                    time: "21:00",
                    round: "J1",
                    homeTeam: {
                      id: teamsData["t1"].id,
                      name: teamsData["t1"].name,
                      logo: teamsData["t1"].logo,
                      score: 2,
                    },
                    awayTeam: {
                      id: teamsData["t8"].id,
                      name: teamsData["t8"].name,
                      logo: teamsData["t8"].logo,
                      score: 1,
                    },
                    status: "FINALIZADO",
                  },
                  {
                    id: "ucl_2425_ga_m2",
                    date: "2024-09-18",
                    time: "21:00",
                    round: "J1",
                    homeTeam: {
                      id: teamsData["t5"].id,
                      name: teamsData["t5"].name,
                      logo: teamsData["t5"].logo,
                      score: 3,
                    },
                    awayTeam: {
                      id: teamsData["t_juv"].id,
                      name: teamsData["t_juv"].name,
                      logo: teamsData["t_juv"].logo,
                      score: 0,
                    },
                    status: "FINALIZADO",
                  },
                  // Jornada 2
                  {
                    id: "ucl_2425_ga_m3",
                    date: "2024-10-01",
                    time: "21:00",
                    round: "J2",
                    homeTeam: {
                      id: teamsData["t8"].id,
                      name: teamsData["t8"].name,
                      logo: teamsData["t8"].logo,
                      score: 1,
                    },
                    awayTeam: {
                      id: teamsData["t5"].id,
                      name: teamsData["t5"].name,
                      logo: teamsData["t5"].logo,
                      score: 1,
                    },
                    status: "FINALIZADO",
                  },
                  {
                    id: "ucl_2425_ga_m4",
                    date: "2024-10-02",
                    time: "21:00",
                    round: "J2",
                    homeTeam: {
                      id: teamsData["t_juv"].id,
                      name: teamsData["t_juv"].name,
                      logo: teamsData["t_juv"].logo,
                      score: 0,
                    },
                    awayTeam: {
                      id: teamsData["t1"].id,
                      name: teamsData["t1"].name,
                      logo: teamsData["t1"].logo,
                      score: 3,
                    },
                    status: "FINALIZADO",
                  },
                  // Jornada 3
                  {
                    id: "ucl_2425_ga_m5",
                    date: "2024-10-22",
                    time: "21:00",
                    round: "J3",
                    homeTeam: {
                      id: teamsData["t1"].id,
                      name: teamsData["t1"].name,
                      logo: teamsData["t1"].logo,
                      score: 1,
                    },
                    awayTeam: {
                      id: teamsData["t5"].id,
                      name: teamsData["t5"].name,
                      logo: teamsData["t5"].logo,
                      score: 2,
                    },
                    status: "FINALIZADO",
                  },
                  {
                    id: "ucl_2425_ga_m6",
                    date: "2024-10-23",
                    time: "21:00",
                    round: "J3",
                    homeTeam: {
                      id: teamsData["t_juv"].id,
                      name: teamsData["t_juv"].name,
                      logo: teamsData["t_juv"].logo,
                      score: 2,
                    },
                    awayTeam: {
                      id: teamsData["t8"].id,
                      name: teamsData["t8"].name,
                      logo: teamsData["t8"].logo,
                      score: 2,
                    },
                    status: "FINALIZADO",
                  },
                ],
                standings: [
                  {
                    position: 1,
                    team: {
                      id: teamsData["t5"].id,
                      name: teamsData["t5"].name,
                      logo: teamsData["t5"].logo,
                    },
                    played: 3,
                    won: 2,
                    drawn: 1,
                    lost: 0,
                    goalsFor: 6,
                    goalsAgainst: 2,
                    goalDifference: 4,
                    points: 7,
                    form: ["G", "E", "G"],
                  },
                  {
                    position: 2,
                    team: {
                      id: teamsData["t1"].id,
                      name: teamsData["t1"].name,
                      logo: teamsData["t1"].logo,
                    },
                    played: 3,
                    won: 2,
                    drawn: 0,
                    lost: 1,
                    goalsFor: 6,
                    goalsAgainst: 3,
                    goalDifference: 3,
                    points: 6,
                    form: ["G", "G", "P"],
                  },
                  {
                    position: 3,
                    team: {
                      id: teamsData["t8"].id,
                      name: teamsData["t8"].name,
                      logo: teamsData["t8"].logo,
                    },
                    played: 3,
                    won: 0,
                    drawn: 2,
                    lost: 1,
                    goalsFor: 4,
                    goalsAgainst: 5,
                    goalDifference: -1,
                    points: 2,
                    form: ["P", "E", "E"],
                  },
                  {
                    position: 4,
                    team: {
                      id: teamsData["t_juv"].id,
                      name: teamsData["t_juv"].name,
                      logo: teamsData["t_juv"].logo,
                    },
                    played: 3,
                    won: 0,
                    drawn: 1,
                    lost: 2,
                    goalsFor: 2,
                    goalsAgainst: 8,
                    goalDifference: -6,
                    points: 1,
                    form: ["P", "P", "E"],
                  },
                ],
              },
              {
                id: "group_b_2425",
                name: "Grupo B",
                teams: [
                  teamsData["t6"], // Bayern München
                  teamsData["t7"], // Paris Saint-Germain
                  teamsData["t_liv"], // Liverpool
                  teamsData["t_arsenal"], // Arsenal
                ],
                matches: [
                  // Jornada 1
                  {
                    id: "ucl_2425_gb_m1",
                    date: "2024-09-17",
                    time: "21:00",
                    round: "J1",
                    homeTeam: {
                      id: teamsData["t6"].id,
                      name: teamsData["t6"].name,
                      logo: teamsData["t6"].logo,
                      score: 2,
                    },
                    awayTeam: {
                      id: teamsData["t_arsenal"].id,
                      name: teamsData["t_arsenal"].name,
                      logo: teamsData["t_arsenal"].logo,
                      score: 0,
                    },
                    status: "FINALIZADO",
                  },
                  {
                    id: "ucl_2425_gb_m2",
                    date: "2024-09-18",
                    time: "21:00",
                    round: "J1",
                    homeTeam: {
                      id: teamsData["t7"].id,
                      name: teamsData["t7"].name,
                      logo: teamsData["t7"].logo,
                      score: 1,
                    },
                    awayTeam: {
                      id: teamsData["t_liv"].id,
                      name: teamsData["t_liv"].name,
                      logo: teamsData["t_liv"].logo,
                      score: 3,
                    },
                    status: "FINALIZADO",
                  },
                  // Jornada 2
                  {
                    id: "ucl_2425_gb_m3",
                    date: "2024-10-01",
                    time: "21:00",
                    round: "J2",
                    homeTeam: {
                      id: teamsData["t_arsenal"].id,
                      name: teamsData["t_arsenal"].name,
                      logo: teamsData["t_arsenal"].logo,
                      score: 2,
                    },
                    awayTeam: {
                      id: teamsData["t7"].id,
                      name: teamsData["t7"].name,
                      logo: teamsData["t7"].logo,
                      score: 2,
                    },
                    status: "FINALIZADO",
                  },
                  {
                    id: "ucl_2425_gb_m4",
                    date: "2024-10-02",
                    time: "21:00",
                    round: "J2",
                    homeTeam: {
                      id: teamsData["t_liv"].id,
                      name: teamsData["t_liv"].name,
                      logo: teamsData["t_liv"].logo,
                      score: 0,
                    },
                    awayTeam: {
                      id: teamsData["t6"].id,
                      name: teamsData["t6"].name,
                      logo: teamsData["t6"].logo,
                      score: 1,
                    },
                    status: "FINALIZADO",
                  },
                  // Jornada 3
                  {
                    id: "ucl_2425_gb_m5",
                    date: "2024-10-22",
                    time: "21:00",
                    round: "J3",
                    homeTeam: {
                      id: teamsData["t6"].id,
                      name: teamsData["t6"].name,
                      logo: teamsData["t6"].logo,
                      score: 3,
                    },
                    awayTeam: {
                      id: teamsData["t7"].id,
                      name: teamsData["t7"].name,
                      logo: teamsData["t7"].logo,
                      score: 1,
                    },
                    status: "FINALIZADO",
                  },
                  {
                    id: "ucl_2425_gb_m6",
                    date: "2024-10-23",
                    time: "21:00",
                    round: "J3",
                    homeTeam: {
                      id: teamsData["t_arsenal"].id,
                      name: teamsData["t_arsenal"].name,
                      logo: teamsData["t_arsenal"].logo,
                      score: 1,
                    },
                    awayTeam: {
                      id: teamsData["t_liv"].id,
                      name: teamsData["t_liv"].name,
                      logo: teamsData["t_liv"].logo,
                      score: 2,
                    },
                    status: "FINALIZADO",
                  },
                ],
                standings: [
                  {
                    position: 1,
                    team: {
                      id: teamsData["t6"].id,
                      name: teamsData["t6"].name,
                      logo: teamsData["t6"].logo,
                    },
                    played: 3,
                    won: 3,
                    drawn: 0,
                    lost: 0,
                    goalsFor: 6,
                    goalsAgainst: 1,
                    goalDifference: 5,
                    points: 9,
                    form: ["G", "G", "G"],
                  },
                  {
                    position: 2,
                    team: {
                      id: teamsData["t_liv"].id,
                      name: teamsData["t_liv"].name,
                      logo: teamsData["t_liv"].logo,
                    },
                    played: 3,
                    won: 2,
                    drawn: 0,
                    lost: 1,
                    goalsFor: 5,
                    goalsAgainst: 2,
                    goalDifference: 3,
                    points: 6,
                    form: ["G", "P", "G"],
                  },
                  {
                    position: 3,
                    team: {
                      id: teamsData["t7"].id,
                      name: teamsData["t7"].name,
                      logo: teamsData["t7"].logo,
                    },
                    played: 3,
                    won: 0,
                    drawn: 1,
                    lost: 2,
                    goalsFor: 4,
                    goalsAgainst: 6,
                    goalDifference: -2,
                    points: 1,
                    form: ["P", "E", "P"],
                  },
                  {
                    position: 4,
                    team: {
                      id: teamsData["t_arsenal"].id,
                      name: teamsData["t_arsenal"].name,
                      logo: teamsData["t_arsenal"].logo,
                    },
                    played: 3,
                    won: 0,
                    drawn: 1,
                    lost: 2,
                    goalsFor: 3,
                    goalsAgainst: 9,
                    goalDifference: -6,
                    points: 1,
                    form: ["P", "E", "P"],
                  },
                ],
              },
            ],
          },
          {
            id: "ucl_2425_knockout",
            name: "Fase Eliminatoria",
            type: "knockout",
            rounds: [
              {
                id: "semi_finals_2425",
                name: "Semifinales",
                matches: [
                  // Semifinal 1 - Ida
                  {
                    id: "ucl_2425_sf1_ida",
                    date: "2025-04-29",
                    time: "21:00",
                    round: "Semifinal - Ida",
                    homeTeam: {
                      id: teamsData["t5"].id, // Manchester City (1° Grupo A)
                      name: teamsData["t5"].name,
                      logo: teamsData["t5"].logo,
                      score: 2,
                    },
                    awayTeam: {
                      id: teamsData["t_liv"].id, // Liverpool (2° Grupo B)
                      name: teamsData["t_liv"].name,
                      logo: teamsData["t_liv"].logo,
                      score: 1,
                    },
                    status: "FINALIZADO",
                  },
                  // Semifinal 1 - Vuelta
                  {
                    id: "ucl_2425_sf1_vuelta",
                    date: "2025-05-06",
                    time: "21:00",
                    round: "Semifinal - Vuelta",
                    homeTeam: {
                      id: teamsData["t_liv"].id, // Liverpool
                      name: teamsData["t_liv"].name,
                      logo: teamsData["t_liv"].logo,
                      score: 1,
                    },
                    awayTeam: {
                      id: teamsData["t5"].id, // Manchester City
                      name: teamsData["t5"].name,
                      logo: teamsData["t5"].logo,
                      score: 1,
                    },
                    status: "FINALIZADO",
                  },
                  // Semifinal 2 - Ida
                  {
                    id: "ucl_2425_sf2_ida",
                    date: "2025-04-30",
                    time: "21:00",
                    round: "Semifinal - Ida",
                    homeTeam: {
                      id: teamsData["t6"].id, // Bayern München (1° Grupo B)
                      name: teamsData["t6"].name,
                      logo: teamsData["t6"].logo,
                      score: 1,
                    },
                    awayTeam: {
                      id: teamsData["t1"].id, // Real Madrid (2° Grupo A)
                      name: teamsData["t1"].name,
                      logo: teamsData["t1"].logo,
                      score: 2,
                    },
                    status: "FINALIZADO",
                  },
                  // Semifinal 2 - Vuelta
                  {
                    id: "ucl_2425_sf2_vuelta",
                    date: "2025-05-07",
                    time: "21:00",
                    round: "Semifinal - Vuelta",
                    homeTeam: {
                      id: teamsData["t1"].id, // Real Madrid
                      name: teamsData["t1"].name,
                      logo: teamsData["t1"].logo,
                      score: 1,
                    },
                    awayTeam: {
                      id: teamsData["t6"].id, // Bayern München
                      name: teamsData["t6"].name,
                      logo: teamsData["t6"].logo,
                      score: 0,
                    },
                    status: "FINALIZADO",
                  },
                ],
              },
              {
                id: "final_2425",
                name: "Final",
                matches: [
                  {
                    id: "ucl_2425_final",
                    date: "2025-05-31",
                    time: "21:00",
                    round: "Final",
                    homeTeam: {
                      id: teamsData["t5"].id, // Manchester City (ganador SF1: 3-2 global)
                      name: teamsData["t5"].name,
                      logo: teamsData["t5"].logo,
                      score: 1,
                    },
                    awayTeam: {
                      id: teamsData["t1"].id, // Real Madrid (ganador SF2: 3-1 global)
                      name: teamsData["t1"].name,
                      logo: teamsData["t1"].logo,
                      score: 2,
                    },
                    status: "FINALIZADO",
                  },
                ],
              },
            ],
          },
        ],
        matches: [], // Deprecated
        standings: [], // Deprecated
      },
    ],
    defaultSeasonId: "ucl-s2024-25",
  },
  {
    id: "3",
    name: "Copa del Rey",
    image: "https://img.sofascore.com/api/v1/unique-tournament/329/image/dark",
    description: "Nos Gusta el Jamón",
    startDate: "2023-11-01",
    endDate: "2024-04-06",
    seasons: [
      {
        id: "cdr-s2024-25",
        name: "2024/2025",
        startDate: "2024-10-30",
        endDate: "2025-04-26",
        teams: [
          teamsData["t1"],
          teamsData["t2"],
          teamsData["t3"],
          teamsData["t4"],
        ],
        phases: [
          {
            id: "cdr_2425_knockout",
            name: "Fase Eliminatoria",
            type: "knockout",
            rounds: [
              {
                id: "cdr_quarterfinals",
                name: "Cuartos de Final",
                matches: [
                  {
                    id: "cdr_2425_qf1",
                    date: "2025-03-05",
                    time: "21:00",
                    round: "Cuartos - Ida",
                    homeTeam: {
                      id: teamsData["t1"].id,
                      name: teamsData["t1"].name,
                      logo: teamsData["t1"].logo,
                      score: 1,
                    },
                    awayTeam: {
                      id: teamsData["t4"].id,
                      name: teamsData["t4"].name,
                      logo: teamsData["t4"].logo,
                      score: 2,
                    },
                    status: "FINALIZADO",
                  },
                ],
              },
              {
                id: "cdr_semifinals",
                name: "Semifinales",
                matches: [
                  {
                    id: "cdr_2425_sf",
                    date: "2025-04-02",
                    time: "21:00",
                    round: "Semifinal",
                    homeTeam: {
                      id: teamsData["t1"].id,
                      name: teamsData["t1"].name,
                      logo: teamsData["t1"].logo,
                      score: 0,
                    },
                    awayTeam: {
                      id: teamsData["t2"].id,
                      name: teamsData["t2"].name,
                      logo: teamsData["t2"].logo,
                      score: 1,
                    },
                    status: "FINALIZADO",
                  },
                ],
              },
              {
                id: "cdr_final",
                name: "Final",
                matches: [
                  {
                    id: "cdr_2425_final",
                    date: "2025-04-26",
                    time: "22:00",
                    round: "Final",
                    homeTeam: {
                      id: teamsData["t2"].id,
                      name: teamsData["t2"].name,
                      logo: teamsData["t2"].logo,
                      score: 2,
                    },
                    awayTeam: {
                      id: teamsData["t3"].id,
                      name: teamsData["t3"].name,
                      logo: teamsData["t3"].logo,
                      score: 1,
                    },
                    status: "FINALIZADO",
                  },
                ],
              },
            ],
          },
        ],
        matches: [], // Deprecated
        standings: [], // Deprecated
      },
      {
        startDate: "2023-11-01",
        endDate: "2024-04-06",
        id: "cdr-s2023-24",
        name: "2023/2024",
        teams: [
          teamsData["t1"],
          teamsData["t2"],
          teamsData["t_rsoc"],
          teamsData["t_val"],
        ],
        phases: [
          {
            id: "cdr_2324_knockout",
            name: "Fase Eliminatoria",
            type: "knockout",
            rounds: [
              {
                id: "cdr_final_2324",
                name: "Final",
                matches: [
                  {
                    id: "cdr_2324_final",
                    date: "2024-04-06",
                    time: "22:00",
                    round: "Final",
                    homeTeam: {
                      id: teamsData["t_val"].id,
                      name: teamsData["t_val"].name,
                      logo: teamsData["t_val"].logo,
                      score: 1,
                    },
                    awayTeam: {
                      id: teamsData["t_rsoc"].id,
                      name: teamsData["t_rsoc"].name,
                      logo: teamsData["t_rsoc"].logo,
                      score: 2,
                    },
                    status: "FINALIZADO",
                  },
                ],
              },
            ],
          },
        ],
        matches: [], // Deprecated
        standings: [], // Deprecated
      },
    ],
    defaultSeasonId: "cdr-s2024-25",
  },
];
