'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { usePermission } from '@/hooks/use-permission';
import { AccessDeniedState } from '@/components/ui/access-denied-state';
import { ArrowLeft, Save, Copy, CheckCircle, AlertTriangle } from 'lucide-react';
import { ROLE_LABELS } from '@/lib/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';

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

export default function AdminUserCreatePage() {
  const { can } = usePermission();
  const router = useRouter();
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [email, setEmail] = useState('');
  const [roleExpiry, setRoleExpiry] = useState('');
  const [roles, setRoles] = useState<string[]>([]);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [created, setCreated] = useState(false);
  const [error, setError] = useState('');

  if (!can('manage:users')) {
    return <AppShell><AccessDeniedState /></AppShell>;
  }

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateLogin = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return parts[0].toLowerCase().substring(0, 6) + parts[1].charAt(0).toLowerCase();
    }
    return fullName.toLowerCase().substring(0, 8);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) { setError('ERR-ADMIN-001 — Укажите ФИО'); return; }
    if (!department) { setError('ERR-ADMIN-002 — Выберите подразделение'); return; }
    if (!position) { setError('ERR-ADMIN-003 — Укажите должность'); return; }
    if (!email.trim()) { setError('ERR-ADMIN-004 — Укажите email'); return; }
    if (roles.length === 0) { setError('ERR-ADMIN-005 — Выберите хотя бы одну роль'); return; }
    if (!roleExpiry) { setError('ERR-ADMIN-006 — Укажите срок действия ролей'); return; }

    const password = generatePassword();
    setGeneratedPassword(password);
    setCreated(true);
    toast.success(`Пользователь «${name}» успешно создан`);
  };

  const toggleRole = (role: string) => {
    setRoles(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]);
  };

  if (created) {
    return (
      <AppShell>
        <div className="flex flex-col h-[calc(100vh-4rem)]">
          <PageHeader
            title="Пользователь создан"
            description="Учётная запись успешно создана"
            breadcrumbs={[
              { label: 'Администрирование', href: '/admin/users' },
              { label: 'Пользователи', href: '/admin/users' },
              { label: 'Создание пользователя' },
            ]}
            actions={
              <Button variant="ghost" size="icon" onClick={() => router.push('/admin/users')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            }
          />
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto space-y-4">
              <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <AlertDescription>
                  Пользователь <strong>{name}</strong> успешно создан. Временный пароль сгенерирован.
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader><CardTitle className="text-sm">Временный пароль</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <code className="text-lg font-mono font-bold text-foreground">{generatedPassword}</code>
                    <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(generatedPassword)}>
                      <Copy className="h-4 w-4 mr-1" /> Копировать
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    При первом входе пользователь должен будет сменить пароль.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-sm">Данные учётной записи</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-muted-foreground">ФИО:</span> <span className="font-medium">{name}</span></div>
                    <div><span className="text-muted-foreground">Логин:</span> <span className="font-mono">{generateLogin(name)}</span></div>
                    <div><span className="text-muted-foreground">Подразделение:</span> <span className="font-medium">{department}</span></div>
                    <div><span className="text-muted-foreground">Должность:</span> <span className="font-medium">{position}</span></div>
                    <div><span className="text-muted-foreground">Email:</span> <span className="font-medium">{email}</span></div>
                    <div>
                      <span className="text-muted-foreground">Роли:</span>{' '}
                      <div className="flex gap-1 mt-1">{roles.map(r => <Badge key={r} variant="secondary" className="text-[10px]">{ROLE_LABELS[r as keyof typeof ROLE_LABELS]}</Badge>)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => router.push('/admin/users')}>К списку пользователей</Button>
                <Button onClick={() => { setCreated(false); setGeneratedPassword(''); }}>Создать ещё</Button>
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <PageHeader
          title="Создание пользователя"
          description="Заполните данные для создания новой учётной записи"
          breadcrumbs={[
            { label: 'Администрирование', href: '/admin/users' },
            { label: 'Пользователи', href: '/admin/users' },
            { label: 'Создание пользователя' },
          ]}
          actions={
            <Button variant="ghost" size="icon" onClick={() => router.push('/admin/users')}>
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
                  <Input placeholder="Иванов Иван Иванович" value={name} onChange={e => setName(e.target.value)} required />
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
                  <Input type="email" placeholder="ivanov@rzd.ru" value={email} onChange={e => setEmail(e.target.value)} required />
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
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" type="button" onClick={() => router.push('/admin/users')}>Отмена</Button>
              <Button type="submit" className="gap-2"><Save className="h-4 w-4" /> Создать и сгенерировать пароль</Button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
