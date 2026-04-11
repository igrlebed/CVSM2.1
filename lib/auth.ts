export type Role = 'expert' | 'admin';

export const ROLE_LABELS: Record<Role, string> = {
  expert: 'Эксперт',
  admin: 'Администратор',
};

// Extended User по ТЗ: ФИО, логин, подразделение, роль/роли, дата окончания роли, должность, email
export interface User {
  id: string;
  login: string;           // логин
  name: string;            // ФИО
  department: string;      // структурное подразделение
  position: string;        // должность
  email: string;           // email
  roles: Role[];           // несколько ролей
  roleExpiryDate?: string; // дата окончания роли (ISO date)
  isActive: boolean;       // активна ли учётка
  avatar?: string;
  isTemporaryPassword: boolean; // флаг первого входа
}

export const MOCK_USERS: User[] = [
  {
    id: '1',
    login: 'ivanov',
    name: 'Иванов Иван Иванович',
    department: 'Центр организации скоростного и высокоскоростного сообщения',
    position: 'Ведущий аналитик',
    email: 'ivanov@rzd.ru',
    roles: ['expert'],
    roleExpiryDate: '2027-12-31',
    isActive: true,
    isTemporaryPassword: false,
  },
  {
    id: '2',
    login: 'admin',
    name: 'Голубев Андрей Александрович',
    department: 'Департамент управления информационной безопасностью',
    position: 'Начальник отдела',
    email: 'golubev@rzd.ru',
    roles: ['admin'],
    roleExpiryDate: '2027-12-31',
    isActive: true,
    isTemporaryPassword: false,
  },
  {
    id: '3',
    login: 'petrova',
    name: 'Петрова Анна Сергеевна',
    department: 'Центр организации скоростного и высокоскоростного сообщения',
    position: 'Аналитик',
    email: 'petrova@rzd.ru',
    roles: ['expert'],
    roleExpiryDate: '2026-06-30',
    isActive: true,
    isTemporaryPassword: true, // первый вход
  },
  {
    id: '4',
    login: 'sidorov',
    name: 'Сидоров К.В.',
    department: 'Главный вычислительный центр',
    position: 'Инженер',
    email: 'sidorov@rzd.ru',
    roles: ['expert'],
    roleExpiryDate: '2026-01-01', // истекла
    isActive: false, // заблокирован
    isTemporaryPassword: false,
  },
];

// Mock passwords for login screen
export const MOCK_PASSWORDS: Record<string, string> = {
  ivanov: 'expert123',
  admin: 'admin123',
  petrova: 'tempPass2026!', // временный пароль
  sidorov: 'expert123',
};

// Auth error codes (ТЗ: код ошибки + расшифровка)
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: { code: 'ERR-AUTH-001', message: 'Неверный логин или пароль' },
  ACCOUNT_LOCKED: { code: 'ERR-AUTH-002', message: 'Учётная запись заблокирована после 5 неверных попыток. Попробуйте через 30 минут' },
  ACCOUNT_EXPIRED: { code: 'ERR-AUTH-003', message: 'Срок действия ролей истёк. Обратитесь к администратору' },
  ACCOUNT_DISABLED: { code: 'ERR-AUTH-004', message: 'Учётная запись отключена администратором' },
  TEMPORARY_PASSWORD: { code: 'ERR-AUTH-005', message: 'Требуется смена временного пароля' },
  TOO_MANY_ATTEMPTS: { code: 'ERR-AUTH-006', message: 'Превышено количество попыток. Осталось блокировки через {attempts} попыток' },
} as const;

// Login attempt tracking (in-memory mock)
export interface LoginAttemptState {
  attempts: number;
  lockedUntil: number | null; // timestamp
}
