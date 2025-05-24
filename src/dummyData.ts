import { User, Competition } from './types';

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

export const dummyCompetitions: Competition[] = [
  {
    id: '1',
    name: 'LaLiga',
    image: 'https://img.sofascore.com/api/v1/unique-tournament/8/image/dark',
    description: 'El Mafioso de Tebas',
    startDate: '2023-06-01',
    endDate: '2023-08-31',
  },
  {
    id: '2',
    name: 'Champions League',
    image: 'https://img.sofascore.com/api/v1/unique-tournament/7/image/dark',
    description: 'Ceferin Cup',
    startDate: '2023-12-01',
    endDate: '2024-02-28',
  },
  {
    id: '3',
    name: 'Copa del Rey',
    image: 'https://img.sofascore.com/api/v1/unique-tournament/329/image/dark',
    description: 'Nos Gusta el Jamón',
    startDate: '2023-03-15',
    endDate: '2023-05-15',
  },
];