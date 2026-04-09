export type Role = 'operator' | 'analyst' | 'approver' | 'admin';

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar?: string;
}

export const ROLE_LABELS: Record<Role, string> = {
  operator: 'Оператор',
  analyst: 'Аналитик',
  approver: 'Согласующий',
  admin: 'Администратор',
};

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Иванов И.И.',
    role: 'operator',
    avatar: '/placeholder-user.jpg',
  },
  {
    id: '2',
    name: 'Петрова А.С.',
    role: 'analyst',
    avatar: '/placeholder-user.jpg',
  },
  {
    id: '3',
    name: 'Сидоров К.В.',
    role: 'approver',
    avatar: '/placeholder-user.jpg',
  },
  {
    id: '4',
    name: 'Голубев А.А.',
    role: 'admin',
    avatar: '/placeholder-user.jpg',
  },
];
