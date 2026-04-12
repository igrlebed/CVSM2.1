'use client';

import { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { usePermission } from '@/hooks/use-permission';
import { AccessDeniedState } from '@/components/ui/access-denied-state';
import { Search, Download, FileText, Lock, LogIn, LogOut, Settings, Database } from 'lucide-react';
import { PageHeader } from '@/components/page-header';

const SYSTEM_VERSION = '0.1.0';

const MOCK_JOURNAL = [
  { id: '1', timestamp: '2026-04-11 09:15:23', user: 'Иванов И.И.', action: 'Вход в систему', type: 'auth', details: 'Успешная авторизация' },
  { id: '2', timestamp: '2026-04-11 09:20:45', user: 'Иванов И.И.', action: 'Изменение сценария', type: 'data', details: 'Редактирование «Альтернатива 1»' },
  { id: '3', timestamp: '2026-04-11 09:30:12', user: 'Голубев А.А.', action: 'Создание пользователя', type: 'admin', details: 'Создан пользователь petrova' },
  { id: '4', timestamp: '2026-04-11 10:00:00', user: 'Система', action: 'Блокировка учётной записи', type: 'security', details: '5 неверных попыток: sidorov' },
  { id: '5', timestamp: '2026-04-11 10:15:33', user: 'Голубев А.А.', action: 'Назначение роли', type: 'admin', details: 'Роль «Эксперт» → petrova' },
  { id: '6', timestamp: '2026-04-11 10:30:00', user: 'Петрова А.С.', action: 'Первый вход', type: 'auth', details: 'Смена временного пароля' },
  { id: '7', timestamp: '2026-04-11 11:00:00', user: 'Иванов И.И.', action: 'Экспорт данных', type: 'data', details: 'Выгрузка сценариев в .xlsx' },
  { id: '8', timestamp: '2026-04-11 11:15:00', user: 'Голубев А.А.', action: 'Выход из системы', type: 'auth', details: 'Завершение сессии' },
];

function getTypeIcon(type: string) {
  switch (type) {
    case 'auth': return <LogIn className="h-4 w-4 text-blue-500" />;
    case 'data': return <Database className="h-4 w-4 text-emerald-500" />;
    case 'admin': return <Settings className="h-4 w-4 text-amber-500" />;
    case 'security': return <Lock className="h-4 w-4 text-destructive" />;
    default: return <FileText className="h-4 w-4" />;
  }
}

export default function AdminJournalPage() {
  const { can } = usePermission();
  const [search, setSearch] = useState('');

  if (!can('manage:users')) {
    return <AppShell><AccessDeniedState /></AppShell>;
  }

  const filtered = MOCK_JOURNAL.filter(j =>
    j.user.toLowerCase().includes(search.toLowerCase()) ||
    j.action.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <PageHeader
          title="Журнал событий"
          description="Хронология действий в системе (только для чтения)"
          breadcrumbs={[
            { label: 'Администрирование', href: '/admin/users' },
            { label: 'Журнал событий' },
          ]}
          actions={
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Экспорт .xlsx
            </Button>
          }
        />

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск по пользователю или действию..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 pl-9 max-w-md"
              />
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Время</TableHead>
                    <TableHead>Пользователь</TableHead>
                    <TableHead>Действие</TableHead>
                    <TableHead>Подробности</TableHead>
                    <TableHead>Тип</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(entry => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-mono text-xs">{entry.timestamp}</TableCell>
                      <TableCell className="text-sm">{entry.user}</TableCell>
                      <TableCell className="text-sm flex items-center gap-2">
                        {getTypeIcon(entry.type)}
                        {entry.action}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{entry.details}</TableCell>
                      <TableCell>
                        <Badge variant={entry.type === 'security' ? 'destructive' : 'secondary'} className="text-[10px]">
                          {entry.type}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="px-6 py-2 border-t border-border/40 bg-card/50">
          <p className="text-[10px] text-muted-foreground">Цифровая модель ВСМ • Версия {SYSTEM_VERSION} • ОАО «РЖД»</p>
        </div>
      </div>
    </AppShell>
  );
}
