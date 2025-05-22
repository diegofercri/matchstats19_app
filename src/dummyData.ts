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
    name: 'Summer Tournament 2023',
    image: 'https://example.com/tournament1.jpg',
    description: 'Annual summer sports competition',
    startDate: '2023-06-01',
    endDate: '2023-08-31',
  },
  {
    id: '2',
    name: 'Winter League 2023',
    image: 'https://example.com/tournament2.jpg',
    description: 'Winter championship series',
    startDate: '2023-12-01',
    endDate: '2024-02-28',
  },
  {
    id: '3',
    name: 'Spring Cup 2023',
    image: 'https://example.com/tournament3.jpg',
    description: 'Spring seasonal tournament',
    startDate: '2023-03-15',
    endDate: '2023-05-15',
  },
];