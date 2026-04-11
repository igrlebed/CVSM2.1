'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, ShieldAlert, Clock } from 'lucide-react';
import Link from 'next/link';

export default function LockedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
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
                <p className="font-mono text-xs mb-1">[ERR-AUTH-002]</p>
                Превышено количество неверных попыток ввода пароля.
                Учётная запись заблокирована на 30 минут.
              </AlertDescription>
            </Alert>

            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Попробуйте войти через 30 минут или обратитесь к администратору
                </span>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">Возможные причины:</p>
              <p>• Неверный логин или пароль (5 попыток)</p>
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
      </div>
    </div>
  );
}
