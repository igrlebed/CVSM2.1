'use client';

import { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { usePermission } from '@/hooks/use-permission';
import { AccessDeniedState } from '@/components/ui/access-denied-state';
import { Search, Download } from 'lucide-react';

const SYSTEM_VERSION = '0.1.0';

const MOCK_AUDIT = [
  { id: '1', timestamp: '2026-04-11 09:15:23', user: 'ivanov', userName: 'Иванов И.И.', event: 'Вход в систему', result: 'Успешно', ip: '10.0.1.15' },
  { id: '2', timestamp: '2026-04-11 09:10:00', user: 'sidorov', userName: 'Сидоров К.В.', event: 'Вход в систему', result: 'Ошибка: неверный пароль', ip: '10.0.1.22' },
  { id: '3', timestamp: '2026-04-11 09:30:12', user: 'admin', userName: 'Голубев А.А.', event: 'Создание пользователя', result: 'Успешно', ip: '10.0.1.1' },
  { id: '4', timestamp: '2026-04-11 10:00:00', user: 'system', userName: 'Система', event: 'Блокировка учётной записи', result: '5 попыток: sidorov', ip: '\u2014' },
  { id: '5', timestamp: '2026-04-11 10:15:33', user: 'admin', userName: 'Голубев А.А.', event: 'Назначение роли', result: 'expert → petrova', ip: '10.0.1.1' },
  { id: '6', timestamp: '2026-04-11 10:30:00', user: 'petrova', userName: 'Петрова А.С.', event: 'Смена пароля', result: 'Временный → постоянный', ip: '10.0.1.30' },
];

export default function AdminAuditPage() {
  const { can } = usePermission();
  const [search, setSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('all');

  if (!can('manage:users')) {
    return <AppShell><AccessDeniedState /></AppShell>;
  }

  const filtered = MOCK_AUDIT.filter(a => {
    const matchSearch = a.userName.toLowerCase().includes(search.toLowerCase()) ||
      a.event.toLowerCase().includes(search.toLowerCase());
    const matchType = eventFilter === 'all' || a.event.includes(eventFilter);
    return matchSearch && matchType;
  });

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="px-6 py-4 border-b border-border/40 bg-card">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">Аудит пользователей</h1>
              <p className="text-sm text-muted-foreground">Попытки входа/выхода, транзакции данных, действия администратора</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Экспорт .xlsx
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 pl-9"
              />
            </div>
            <Select value={eventFilter} onValueChange={setEventFilter}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Все события" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все события</SelectItem>
                <SelectItem value="Вход">Вход / Выход</SelectItem>
                <SelectItem value="Блокировка">Блокировки</SelectItem>
                <SelectItem value="Создание">Создание / Изменение</SelectItem>
                <SelectItem value="роль">Изменение ролей</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Время</TableHead>
                    <TableHead>Пользователь</TableHead>
                    <TableHead>Событие</TableHead>
                    <TableHead>Результат</TableHead>
                    <TableHead>IP-адрес</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(entry => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-mono text-xs">{entry.timestamp}</TableCell>
                      <TableCell className="text-sm">{entry.userName}</TableCell>
                      <TableCell className="text-sm">{entry.event}</TableCell>
                      <TableCell>
                        <Badge variant={entry.result.includes('Ошибка') || entry.result.includes('Блокировка') ? 'destructive' : 'default'} className="text-[10px] bg-emerald-500">
                          {entry.result}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{entry.ip}</TableCell>
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
