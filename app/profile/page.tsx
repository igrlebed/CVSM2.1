'use client';

import { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { ROLE_LABELS } from '@/lib/auth';
import { User, Shield, Mail, Building2, Calendar, Key, CheckCircle, Save } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [position, setPosition] = useState(user?.position || '');

  if (!user) return null;

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Данные профиля обновлены');
  };

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <PageHeader
          title="Личный кабинет"
          description="Управление учётной записью и настройками"
          breadcrumbs={[
            { label: 'Главная', href: '/' },
            { label: 'Личный кабинет' },
          ]}
          actions={
            !isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Key className="h-4 w-4 mr-2" />
                Редактировать
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  Отмена
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Сохранить
                </Button>
              </div>
            )
          }
        />

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Основная информация
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">ФИО</p>
                    {isEditing ? (
                      <Input value={name} onChange={(e) => setName(e.target.value)} />
                    ) : (
                      <p className="text-sm font-medium">{user.name}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" /> Email
                    </p>
                    {isEditing ? (
                      <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                    ) : (
                      <p className="text-sm font-medium">{user.email}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Building2 className="h-3 w-3" /> Подразделение
                    </p>
                    <p className="text-sm">{user.department}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Должность</p>
                    {isEditing ? (
                      <Input value={position} onChange={(e) => setPosition(e.target.value)} />
                    ) : (
                      <p className="text-sm">{user.position}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Логин</p>
                    <p className="text-sm font-mono">{user.login}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Shield className="h-3 w-3" /> Роль
                    </p>
                    <div className="flex gap-1 flex-wrap">
                      {user.roles.map(role => (
                        <Badge key={role} variant="secondary" className="text-[10px]">
                          {ROLE_LABELS[role]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Key className="h-4 w-4 text-primary" />
                  Безопасность
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-sm font-medium">Статус учётной записи</p>
                      <p className="text-xs text-muted-foreground">Учётная запись активна</p>
                    </div>
                    <Badge className="bg-emerald-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Активна
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-sm font-medium flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        Срок действия роли
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.roleExpiryDate ? new Date(user.roleExpiryDate).toLocaleDateString('ru-RU') : '—'}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {user.roleExpiryDate
                        ? Math.ceil((new Date(user.roleExpiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) + ' дней'
                        : 'Не ограничен'}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => {
                    toast.info('Смена пароля', { description: 'Функция доступна в production-версии с бэкендом' });
                  }}>
                    <Key className="h-4 w-4 mr-2" />
                    Сменить пароль
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-2 border-t border-border/40 bg-card/50">
          <p className="text-[10px] text-muted-foreground">Цифровая модель ВСМ • Версия 0.1.0 • ОАО «РЖД»</p>
        </div>
      </div>
    </AppShell>
  );
}
