'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { KeyRound, AlertTriangle, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export default function FirstLoginPage() {
  const { user, login, changePassword, logout } = useAuth();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  // Если пользователь не залогинен — редирект на логин
  if (!user) {
    router.push('/auth/login');
    return null;
  }

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) return '[ERR-AUTH-008] Пароль должен содержать минимум 8 символов';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Проверка текущего пароля
    const loginResult = login(user.login, currentPassword);
    if (!loginResult.success) {
      setError('[ERR-AUTH-001] Неверный текущий пароль');
      return;
    }

    // Валидация нового пароля
    const pwdError = validatePassword(newPassword);
    if (pwdError) { setError(pwdError); return; }

    if (newPassword !== confirmPassword) {
      setError('[ERR-AUTH-009] Пароли не совпадают');
      return;
    }

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 500));

    changePassword(newPassword);
    setIsLoading(false);

    // Переход на главную
    router.push('/');
  };

  const passwordStrength = (pwd: string) => {
    if (pwd.length === 0) return null;
    if (pwd.length < 6) return { label: 'Слабый', color: 'text-destructive' };
    if (pwd.length < 8) return { label: 'Средний', color: 'text-amber-500' };
    return { label: 'Надёжный', color: 'text-emerald-500' };
  };

  const strength = passwordStrength(newPassword);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-1">Цифровая модель ВСМ</h1>
          <p className="text-muted-foreground text-sm">Добро пожаловать, {user.name}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-amber-500" />
              Смена временного пароля
            </CardTitle>
            <CardDescription>
              При первом входе необходимо установить новый постоянный пароль
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="current">Текущий пароль</Label>
                <div className="relative">
                  <Input
                    id="current"
                    type={showPasswords ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new">Новый пароль</Label>
                <Input
                  id="new"
                  type={showPasswords ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                {strength && (
                  <p className={`text-xs ${strength.color}`}>Надёжность: {strength.label}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm">Подтверждение пароля</Label>
                <Input
                  id="confirm"
                  type={showPasswords ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPasswords(!showPasswords)}
                >
                  {showPasswords ? <EyeOff className="h-3.5 w-3.5 inline mr-1" /> : <Eye className="h-3.5 w-3.5 inline mr-1" />}
                  {showPasswords ? 'Скрыть' : 'Показать'} пароли
                </button>
              </div>

              <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">Требования к паролю:</p>
                <p>• Минимум 8 символов</p>
                <p>• Должен отличаться от временного пароля</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Сохранение...' : 'Установить новый пароль'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
