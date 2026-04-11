'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_USERS, ROLE_LABELS, User } from '@/lib/auth';
import { usePermission } from '@/hooks/use-permission';
import { AccessDeniedState } from '@/components/ui/access-denied-state';
import { ArrowLeft, Ban, CheckCircle, Shield, Mail, Building, UserCircle } from 'lucide-react';

const SYSTEM_VERSION = '0.1.0';

export default function UserCardPage({ params }: { params: Promise<{ id: string }> }) {
  const { can } = usePermission();
  const router = useRouter();
  const { id } = use(params);

  if (!can('manage:users')) {
    return <AppShell><AccessDeniedState /></AppShell>;
  }

  const user = MOCK_USERS.find(u => u.id === id);

  if (!user) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
          <p className="text-lg text-muted-foreground mb-4">Пользователь не найден</p>
          <Button onClick={() => router.push('/admin/users')}><ArrowLeft className="h-4 w-4 mr-2" />Назад к списку</Button>
        </div>
      </AppShell>
    );
  }

  const isExpired = user.roleExpiryDate ? new Date(user.roleExpiryDate) < new Date() : false;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '\u2014';
    return new Date(dateStr).toLocaleDateString('ru-RU');
  };

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border/40 bg-card">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.push('/admin/users')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Карточка пользователя</h1>
              <p className="text-sm text-muted-foreground">{user.name}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl space-y-4">
            {/* Main info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Основная информация</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">ФИО</p>
                    <p className="text-sm font-medium">{user.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Логин</p>
                    <p className="text-sm font-mono">{user.login}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Building className="h-3 w-3" /> Подразделение</p>
                    <p className="text-sm">{user.department}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Должность</p>
                    <p className="text-sm">{user.position}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" /> Email</p>
                    <p className="text-sm">{user.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Статус</p>
                    <div>
                      {user.isActive && !isExpired ? (
                        <Badge className="bg-emerald-500"><CheckCircle className="h-3 w-3 mr-1" /> Активна</Badge>
                      ) : (
                        <Badge variant="destructive"><Ban className="h-3 w-3 mr-1" /> Заблокирована</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Roles */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2"><Shield className="h-4 w-4" /> Роли и права</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {user.roles.map(role => (
                    <div key={role} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="text-sm font-medium">{ROLE_LABELS[role]}</p>
                        <p className="text-xs text-muted-foreground">Принцип минимально необходимых полномочий</p>
                      </div>
                      <Badge variant="secondary">{role === 'admin' ? 'Полный доступ' : 'Эксперт'}</Badge>
                    </div>
                  ))}
                </div>
                {user.roleExpiryDate && (
                  <div className="mt-3 p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Дата окончания ролей</p>
                    <p className={isExpired ? 'text-sm text-destructive font-medium' : 'text-sm font-medium'}>
                      {formatDate(user.roleExpiryDate)} {isExpired && '(истекла)'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => router.push(`/admin/users/${user.id}/edit`)}>
                Редактировать
              </Button>
              {user.isActive ? (
                <Button variant="destructive"><Ban className="h-4 w-4 mr-2" />Заблокировать</Button>
              ) : (
                <Button className="bg-emerald-500 hover:bg-emerald-500/90"><CheckCircle className="h-4 w-4 mr-2" />Разблокировать</Button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-2 border-t border-border/40 bg-card/50">
          <p className="text-[10px] text-muted-foreground">Цифровая модель ВСМ • Версия {SYSTEM_VERSION} • ОАО «РЖД»</p>
        </div>
      </div>
    </AppShell>
  );
}
