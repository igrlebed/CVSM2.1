'use client';

import React from 'react';
import { Lock, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function AccessDeniedState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8 text-center bg-muted/20">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
        <Lock className="h-10 w-10 text-destructive" />
      </div>
      
      <h1 className="text-2xl font-bold tracking-tight mb-2">Доступ ограничен</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        У вашей роли недостаточно прав для просмотра этого раздела. 
        Пожалуйста, обратитесь к администратору, если вы считаете, что это ошибка.
      </p>
      
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад
        </Button>
        <Link href="/">
          <Button variant="default">
            <Home className="mr-2 h-4 w-4" />
            На главную
          </Button>
        </Link>
      </div>
    </div>
  );
}
