'use client';

import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePermission } from '@/hooks/use-permission';
import { AccessDeniedState } from '@/components/ui/access-denied-state';
import { Shield, Check, X } from 'lucide-react';
import { PageHeader } from '@/components/page-header';

const SYSTEM_VERSION = '0.1.0';

const PERMISSIONS_MATRIX = [
  { permission: 'Просмотр дашбордов', expert: true, admin: true },
  { permission: 'Просмотр карты сети', expert: true, admin: true },
  { permission: 'Просмотр проектов', expert: true, admin: true },
  { permission: 'Изменение входных данных', expert: true, admin: true },
  { permission: 'Настройка выходных параметров', expert: true, admin: true },
  { permission: 'Визуализация данных', expert: true, admin: true },
  { permission: 'Конструктор сценариев', expert: true, admin: true },
  { permission: 'Экспорт данных', expert: true, admin: true },
  { permission: 'Аналитика (все разделы)', expert: true, admin: true },
  { permission: 'Управление пользователями', expert: false, admin: true },
  { permission: 'Управление ролями и доступом', expert: false, admin: true },
  { permission: 'Журнал событий', expert: false, admin: true },
  { permission: 'Аудит пользователей', expert: false, admin: true },
];

export default function AdminRolesPage() {
  const { can } = usePermission();

  if (!can('manage:users')) {
    return <AppShell><AccessDeniedState /></AppShell>;
  }

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <PageHeader
          title="Роли и права доступа"
          description="Матрица доступов по базовым ролям"
          breadcrumbs={[
            { label: 'Администрирование', href: '/admin/users' },
            { label: 'Роли и права' },
          ]}
        />

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl space-y-4">
            {/* Roles description */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> Эксперт</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Основной пользователь системы. Изменение входных данных, настройка выходных параметров, визуализация данных модуля отображения информации.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2"><Shield className="h-4 w-4 text-destructive" /> Администратор</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Полный доступ. Управление пользователями, управление доступом к функциям, журналирование событий, аудит пользователей.</p>
                </CardContent>
              </Card>
            </div>

            {/* Matrix */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Матрица доступов</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left px-4 py-2 font-medium text-muted-foreground">Функция</th>
                      <th className="text-center px-4 py-2 font-medium text-muted-foreground"><Badge variant="secondary">Эксперт</Badge></th>
                      <th className="text-center px-4 py-2 font-medium text-muted-foreground"><Badge>Администратор</Badge></th>
                    </tr>
                  </thead>
                  <tbody>
                    {PERMISSIONS_MATRIX.map((row, i) => (
                      <tr key={i} className="border-b border-border/40">
                        <td className="px-4 py-2 text-sm">{row.permission}</td>
                        <td className="px-4 py-2 text-center">
                          {row.expert
                            ? <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                            : <X className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                          }
                        </td>
                        <td className="px-4 py-2 text-center">
                          {row.admin
                            ? <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                            : <X className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="px-6 py-2 border-t border-border/40 bg-card/50">
          <p className="text-[10px] text-muted-foreground">Цифровая модель ВСМ • Версия {SYSTEM_VERSION} • ОАО «РЖД»</p>
        </div>
      </div>
    </AppShell>
  );
}
