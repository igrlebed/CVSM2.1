'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, MOCK_USERS, MOCK_PASSWORDS, LoginAttemptState, AUTH_ERRORS } from '@/lib/auth';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  login: (login: string, password: string) => { success: boolean; error?: typeof AUTH_ERRORS[keyof typeof AUTH_ERRORS] };
  logout: () => void;
  changePassword: (newPassword: string) => void;
  isAuthenticated: boolean;
  needsPasswordChange: boolean;
}

const AUTH_STORAGE_KEY = 'cvsm_auth_user';
const ATTEMPTS_KEY = 'cvsm_login_attempts';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 30 * 60 * 1000; // 30 минут

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getStoredAttempts(): LoginAttemptState {
  try {
    const data = localStorage.getItem(ATTEMPTS_KEY);
    if (data) return JSON.parse(data);
  } catch (_e) {
    // ignore parse errors
  }
  return { attempts: 0, lockedUntil: null };
}

function saveAttempts(state: LoginAttemptState) {
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(state));
}

function clearAttempts() {
  localStorage.removeItem(ATTEMPTS_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Восстановление сессии из localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as User;
        // Проверка не истёк ли срок ролей
        if (parsed.roleExpiryDate && new Date(parsed.roleExpiryDate) < new Date()) {
          parsed.isActive = false;
        }
        if (parsed.isActive) {
          setUser(parsed);
        } else {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      }
    } catch (_e) {
      // ignore corrupted storage
    }
    setIsLoading(false);
  }, []);

  const login = (loginValue: string, password: string) => {
    const attempts = getStoredAttempts();

    // Проверка блокировки по времени
    if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
      toast.error('Учётная запись заблокирована. Попробуйте позже.', { description: AUTH_ERRORS.ACCOUNT_LOCKED.description });
      return {
        success: false,
        error: AUTH_ERRORS.ACCOUNT_LOCKED,
      };
    }

    const mockUser = MOCK_USERS.find(u => u.login === loginValue);

    if (!mockUser) {
      const newAttempts = attempts.attempts + 1;
      if (newAttempts >= MAX_ATTEMPTS) {
        saveAttempts({ attempts: newAttempts, lockedUntil: Date.now() + LOCKOUT_DURATION_MS });
        toast.error('Учётная запись заблокирована', { description: 'Превышено количество неверных попыток входа (5)' });
        return { success: false, error: AUTH_ERRORS.ACCOUNT_LOCKED };
      }
      const remaining = MAX_ATTEMPTS - newAttempts;
      toast.warning(`Неверный логин. Осталось попыток: ${remaining}`);
      saveAttempts({ attempts: newAttempts, lockedUntil: null });
      return { success: false, error: AUTH_ERRORS.INVALID_CREDENTIALS };
    }

    // Проверка активности
    if (!mockUser.isActive) {
      if (mockUser.roleExpiryDate && new Date(mockUser.roleExpiryDate) < new Date()) {
        return { success: false, error: AUTH_ERRORS.ACCOUNT_EXPIRED };
      }
      return { success: false, error: AUTH_ERRORS.ACCOUNT_DISABLED };
    }

    // Проверка пароля (пустой пароль = тестовый быстрый вход)
    if (password !== '' && MOCK_PASSWORDS[mockUser.login] !== password) {
      const newAttempts = attempts.attempts + 1;
      if (newAttempts >= MAX_ATTEMPTS) {
        saveAttempts({ attempts: newAttempts, lockedUntil: Date.now() + LOCKOUT_DURATION_MS });
        toast.error('Учётная запись заблокирована', { description: 'Превышено количества неверных попыток входа (5)' });
        return { success: false, error: AUTH_ERRORS.ACCOUNT_LOCKED };
      }
      const remaining = MAX_ATTEMPTS - newAttempts;
      toast.warning(`Неверный пароль. Осталось попыток: ${remaining}`);
      saveAttempts({ attempts: newAttempts, lockedUntil: null });
      return { success: false, error: AUTH_ERRORS.INVALID_CREDENTIALS };
    }

    // Успешный вход — сброс попыток
    clearAttempts();
    setUser(mockUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
    toast.success(`Добро пожаловать, ${mockUser.name}!`);

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const changePassword = (_newPassword: string) => {
    if (!user) return;
    const updated = { ...user, isTemporaryPassword: false };
    setUser(updated);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    changePassword,
    isAuthenticated: !!user,
    needsPasswordChange: !!user?.isTemporaryPassword,
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-muted/40">
      <p className="text-muted-foreground">Загрузка системы...</p>
    </div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
