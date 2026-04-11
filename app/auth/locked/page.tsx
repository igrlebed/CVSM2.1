'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, ShieldAlert, Clock } from 'lucide-react';
import Link from 'next/link';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function LockedPage() {
  const [countdown, setCountdown] = useState(30 * 60); // 30 минут в секундах

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
            <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-primary-foreground" stroke="currentColor" strokeWidth="2">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
              <line x1="4" x2="4" y1="22" y2="15" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Цифровая модель ВСМ</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="h-5 w-5" />
              Учётная запись заблокирована
            </CardTitle>
            <CardDescription>
              Доступ к системе временно ограничен
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <Lock className="h-4 w-4" />
              <AlertDescription>
                <p className="font-mono text-xs mb-1">ERR-AUTH-002</p>
                Превышено количество неверных попыток ввода пароля.
                Учётная запись заблокирована на 30 минут.
              </AlertDescription>
            </Alert>

            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Повторная попытка через:{' '}
                  <span className="font-mono font-semibold text-foreground">{formatTime(countdown)}</span>
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                  Или обратитесь к администратору для досрочной разблокировки
                </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">Возможные причины:</p>
              <p>• 5 неверных попыток ввода пароля</p>
              <p>• Истёк срок действия ролей</p>
              <p>• Учётная запись отключена администратором</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button variant="outline" asChild className="w-full">
              <Link href="/auth/login">
                Вернуться ко входу
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Версия системы 0.1.0
        </p>
      </div>
    </div>
  );
}
