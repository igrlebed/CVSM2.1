'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { MOCK_USERS, ROLE_LABELS, User } from '@/lib/auth';
import { usePermission } from '@/hooks/use-permission';
import { AccessDeniedState } from '@/components/ui/access-denied-state';
import {
  Search, Plus, Download, Ban, CheckCircle, Eye, Edit, Shield
} from 'lucide-react';

const SYSTEM_VERSION = '0.1.0';

export default function AdminUsersPage() {
  const { can } = usePermission();
  const router = useRouter();
  const [search, setSearch] = useState('');

  if (!can('manage:users')) {
    return (
      <AppShell>
        <AccessDeniedState />
      </AppShell>
    );
  }

  const filteredUsers = MOCK_USERS.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.login.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '\u2014';
    return new Date(dateStr).toLocaleDateString('ru-RU');
  };

  const isExpired = (user: User) => {
    if (user.roleExpiryDate) {
      return new Date(user.roleExpiryDate) < new Date();
    }
    return false;
  };

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border/40 bg-card">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">Управление пользователями</h1>
              <p className="text-sm text-muted-foreground">Создание, редактирование и блокировка учётных записей</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Экспорт
              </Button>
              <Button size="sm" className="gap-2" onClick={() => router.push('/admin/users/new')}>
                <Plus className="h-4 w-4" />
                Создать пользователя
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск по ФИО, логину, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 pl-9 max-w-md"
              />
            </div>
          </div>

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Логин</TableHead>
                    <TableHead>ФИО</TableHead>
                    <TableHead>Подразделение</TableHead>
                    <TableHead>Роли</TableHead>
                    <TableHead>Истекает</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-mono text-sm">{user.login}</TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{user.department}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {user.roles.map(role => (
                            <Badge key={role} variant="secondary" className="text-[10px]">
                              <Shield className="h-3 w-3 mr-1" />
                              {ROLE_LABELS[role]}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {isExpired(user) ? (
                          <span className="text-destructive">{formatDate(user.roleExpiryDate)}</span>
                        ) : (
                          formatDate(user.roleExpiryDate)
                        )}
                      </TableCell>
                      <TableCell>
                        {user.isActive && !isExpired(user) ? (
                          <Badge variant="default" className="bg-emerald-500 text-[10px]">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Активна
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="text-[10px]">
                            <Ban className="h-3 w-3 mr-1" />
                            Заблокирована
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/admin/users/${user.id}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/admin/users/${user.id}/edit`)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredUsers.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Пользователи не найдены
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="px-6 py-2 border-t border-border/40 bg-card/50">
          <p className="text-[10px] text-muted-foreground">Цифровая модель ВСМ • Версия {SYSTEM_VERSION} • ОАО «РЖД»</p>
        </div>
      </div>
    </AppShell>
  );
}
