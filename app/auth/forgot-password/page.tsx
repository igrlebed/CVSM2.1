'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, KeyRound, CheckCircle, AlertTriangle, Mail } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError('ERR-AUTH-007 — Введите логин или адрес электронной почты');
      return;
    }

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setIsLoading(false);
    setSubmitted(true);
    setResendCooldown(30);
  };

  // Resend cooldown
  useState(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  });

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
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" />
              Восстановление пароля
            </CardTitle>
            <CardDescription>
              {!submitted
                ? 'Введите логин или email. Инструкция по сбросу будет отправлена администратору.'
                : 'Запрос на восстановление отправлен'}
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

              {submitted ? (
                <div className="space-y-3">
                  <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <AlertDescription>
                      Запрос на восстановление пароля отправлен системному администратору.
                      Обратитесь к нему напрямую или ожидайте письмо на указанный email.
                    </AlertDescription>
                  </Alert>

                  <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
                    <p className="font-medium text-foreground">Дальнейшие действия:</p>
                    <p>1. Администратор сбросит ваш пароль</p>
                    <p>2. Вы получите временный пароль</p>
                    <p>3. При входе система попросит его сменить</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="identifier">Логин или email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="identifier"
                        type="text"
                        placeholder="ivanov или ivanov@rzd.ru"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
                    <p className="font-medium text-foreground">Как работает восстановление:</p>
                    <p>• Запрос направляется администратору системы</p>
                    <p>• Администратор генерирует временный пароль</p>
                    <p>• При первом входе потребуется смена пароля</p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              {!submitted ? (
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Отправка...' : 'Отправить запрос администратору'}
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={resendCooldown > 0}
                    onClick={() => {
                      setSubmitted(false);
                      setIdentifier('');
                    }}
                  >
                    {resendCooldown > 0
                      ? `Повторная отправка через ${resendCooldown} сек.`
                      : 'Отправить повторно'}
                  </Button>
                </>
              )}
              <Button variant="link" asChild className="text-sm">
                <Link href="/auth/login">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Вернуться ко входу
                </Link>
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Версия системы 0.1.0
        </p>
      </div>
    </div>
  );
}
