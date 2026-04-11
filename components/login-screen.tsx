'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, ShieldCheck, Users, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { MOCK_USERS, ROLE_LABELS } from '@/lib/auth';

/**
 * Тестовый экран входа — выбор роли одним кликом.
 * Для быстрой демонстрации без ввода пароля.
 */
export function LoginScreen() {
  const { login } = useAuth();

  // Берём по одному представителю на каждую роль (без expired/disabled)
  const demoUsers = MOCK_USERS.filter(u => u.isActive && !u.isTemporaryPassword);

  const handleLogin = (userId: string) => {
    const user = MOCK_USERS.find(u => u.id === userId);
    if (user) {
      login(user.login, '');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-2xl">
        {/* Logo and title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
            <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-primary-foreground" stroke="currentColor" strokeWidth="2">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
              <line x1="4" x2="4" y1="22" y2="15" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Цифровая модель ВСМ</h1>
          <p className="text-muted-foreground text-sm">Выберите роль для входа в систему</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Эксперт */}
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 border-border/40 hover:border-primary/40"
                onClick={() => handleLogin('1')}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">{ROLE_LABELS.expert}</CardTitle>
                  <CardDescription className="text-xs">Основной пользователь</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground">Доступ:</p>
                <div className="flex flex-wrap gap-1">
                  {['Проекты', 'Карта', 'Аналитика', 'Конструктор'].map(item => (
                    <Badge key={item} variant="secondary" className="text-[10px]">{item}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                <span>{demoUsers.find(u => u.roles.includes('expert'))?.name}</span>
              </div>
              <Button className="w-full mt-2">Войти как Эксперт</Button>
            </CardContent>
          </Card>

          {/* Администратор */}
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 border-border/40 hover:border-primary/40"
                onClick={() => handleLogin('2')}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
                  <ShieldCheck className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <CardTitle className="text-base">{ROLE_LABELS.admin}</CardTitle>
                  <CardDescription className="text-xs">Полный доступ</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground">Доступ:</p>
                <div className="flex flex-wrap gap-1">
                  {['Проекты', 'Аналитика', 'Конструктор', 'Администрирование'].map(item => (
                    <Badge key={item} variant="secondary" className="text-[10px]">{item}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                <span>{demoUsers.find(u => u.roles.includes('admin'))?.name}</span>
              </div>
              <Button className="w-full mt-2">Войти как Администратор</Button>
            </CardContent>
          </Card>
        </div>

        {/* Сценарии для тестирования */}
        <Card className="mt-4 border-dashed">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              Сценарии для тестирования
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button
                variant="ghost"
                className="justify-start text-xs h-8"
                onClick={() => handleLogin('3')}
              >
                Петрова А.С. — первый вход (смена пароля)
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-xs h-8 text-destructive"
                onClick={() => handleLogin('4')}
              >
                Сидоров К.В. — заблокирован (роль истекла)
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Версия системы 0.1.0 • Тестовый режим
        </p>
      </div>
    </div>
  );
}
