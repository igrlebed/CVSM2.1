'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { usePermission } from '@/hooks/use-permission';
import { AccessDeniedState } from '@/components/ui/access-denied-state';
import { PageHeader } from '@/components/page-header';
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react';
import { ROLE_LABELS, MOCK_USERS } from '@/lib/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

const DEPARTMENTS = [
  'Центр организации скоростного и высокоскоростного сообщения',
  'Департамент управления информационной безопасностью',
  'Главный вычислительный центр',
  'Департамент информатизации',
];

const POSITIONS = [
  'Ведущий аналитик',
  'Аналитик',
  'Начальник отдела',
  'Инженер',
  'Руководитель проекта',
];

export default function UserEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { can } = usePermission();
  const router = useRouter();
  const { id } = use(params);

  const existingUser = MOCK_USERS.find(u => u.id === id);

  const [name, setName] = useState(existingUser?.name || '');
  const [department, setDepartment] = useState(existingUser?.department || '');
  const [position, setPosition] = useState(existingUser?.position || '');
  const [email, setEmail] = useState(existingUser?.email || '');
  const [roleExpiry, setRoleExpiry] = useState(existingUser?.roleExpiryDate?.split('T')[0] || '');
  const [roles, setRoles] = useState<string[]>(existingUser?.roles || []);
  const [error, setError] = useState('');

  if (!can('manage:users')) {
    return <AppShell><AccessDeniedState /></AppShell>;
  }

  if (!existingUser) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
          <p className="text-lg text-muted-foreground mb-4">Пользователь не найден</p>
          <Button onClick={() => router.push('/admin/users')}><ArrowLeft className="h-4 w-4 mr-2" />Назад к списку</Button>
        </div>
      </AppShell>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) { setError('ERR-ADMIN-001 — Укажите ФИО'); return; }
    if (!department) { setError('ERR-ADMIN-002 — Выберите подразделение'); return; }
    if (!position) { setError('ERR-ADMIN-003 — Укажите должность'); return; }
    if (!email.trim()) { setError('ERR-ADMIN-004 — Укажите email'); return; }
    if (roles.length === 0) { setError('ERR-ADMIN-005 — Выберите хотя бы одну роль'); return; }
    if (!roleExpiry) { setError('ERR-ADMIN-006 — Укажите срок действия ролей'); return; }

    // Update mock user
    const idx = MOCK_USERS.findIndex(u => u.id === existingUser.id);
    if (idx >= 0) {
      MOCK_USERS[idx] = {
        ...MOCK_USERS[idx],
        name,
        department,
        position,
        email,
        roles: roles as typeof existingUser.roles,
        roleExpiryDate: new Date(roleExpiry).toISOString(),
      };
    }

    toast.success(`Данные пользователя «${name}» обновлены`);
    router.push(`/admin/users/${existingUser.id}`);
  };

  const toggleRole = (role: string) => {
    setRoles(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]);
  };

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <PageHeader
          title="Редактирование пользователя"
          description={existingUser.name}
          breadcrumbs={[
            { label: 'Администрирование', href: '/admin/users' },
            { label: 'Пользователи', href: '/admin/users' },
            { label: existingUser.name, href: `/admin/users/${existingUser.id}` },
            { label: 'Редактирование' },
          ]}
          actions={
            <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/users/${existingUser.id}`)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          }
        />

        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Card>
              <CardHeader><CardTitle className="text-sm">Основная информация</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>ФИО</Label>
                  <Input value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Подразделение</Label>
                    <Select value={department} onValueChange={setDepartment} required>
                      <SelectTrigger><SelectValue placeholder="Выберите..." /></SelectTrigger>
                      <SelectContent>
                        {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Должность</Label>
                    <Select value={position} onValueChange={setPosition} required>
                      <SelectTrigger><SelectValue placeholder="Выберите..." /></SelectTrigger>
                      <SelectContent>
                        {POSITIONS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div>
                  <Label>Логин</Label>
                  <Input value={existingUser.login} disabled className="text-muted-foreground" />
                  <p className="text-xs text-muted-foreground mt-1">Логин нельзя изменить</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-sm">Роли и доступ</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(['expert', 'admin'] as const).map(role => (
                    <label key={role} className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-secondary/50">
                      <Checkbox checked={roles.includes(role)} onCheckedChange={() => toggleRole(role)} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{ROLE_LABELS[role]}</p>
                        <p className="text-xs text-muted-foreground">
                          {role === 'admin' ? 'Полный доступ, управление пользователями' : 'Проекты, аналитика, конструктор'}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="mt-4">
                  <Label>Срок действия ролей</Label>
                  <Input type="date" value={roleExpiry} onChange={e => setRoleExpiry(e.target.value)} required />
                </div>
                {existingUser.roleExpiryDate && (
                  <div className="mt-2 flex gap-1 flex-wrap">
                    <span className="text-xs text-muted-foreground">Текущие роли:</span>
                    {existingUser.roles.map(r => (
                      <Badge key={r} variant="secondary" className="text-[10px]">{ROLE_LABELS[r]}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" type="button" onClick={() => router.push(`/admin/users/${existingUser.id}`)}>Отмена</Button>
              <Button type="submit" className="gap-2"><Save className="h-4 w-4" /> Сохранить изменения</Button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
