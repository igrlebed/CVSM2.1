'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MOCK_USERS, ROLE_LABELS, User } from '@/lib/auth';
import { useAuth } from '@/contexts/auth-context';

export function LoginScreen() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">ВСМ-Дашборд</h1>
          <p className="text-muted-foreground">Выберите пользователя для входа в систему</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_USERS.map((user) => (
            <Card key={user.id} className="flex flex-col hover:shadow-md transition-shadow">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-lg">{user.name}</CardTitle>
                <CardDescription>
                  <Badge variant="secondary" className="mt-1">
                    {ROLE_LABELS[user.role]}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 text-center text-sm text-muted-foreground">
                {getRoleDescription(user.role)}
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => login(user)}>
                  Войти
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function getRoleDescription(role: string) {
  switch (role) {
    case 'operator': return 'Просмотр дашбордов, карт и проектов';
    case 'analyst': return 'Создание и редактирование сценариев';
    case 'approver': return 'Согласование и отклонение сценариев';
    case 'admin': return 'Полный доступ и управление пользователями';
    default: return '';
  }
}
