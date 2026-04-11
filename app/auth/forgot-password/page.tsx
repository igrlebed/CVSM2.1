'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, KeyRound, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError('[ERR-AUTH-007] Введите логин или адрес электронной почты');
      return;
    }

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setIsLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
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
              Введите логин или email для получения инструкции по сбросу пароля
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
                <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <AlertDescription>
                    Инструкция по восстановлению пароля отправлена на указанный email.
                    Если письмо не пришло, обратитесь к администратору системы.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="identifier">Логин или email</Label>
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="ivanov или ivanov@rzd.ru"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              {!submitted ? (
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Отправка...' : 'Отправить инструкцию'}
                </Button>
              ) : null}
              <Button variant="link" asChild className="text-sm">
                <Link href="/auth/login">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Вернуться ко входу
                </Link>
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
