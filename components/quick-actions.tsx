'use client';

import { Plus, FileDown, GitCompare, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className }: QuickActionsProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      <Button variant="outline" size="sm" asChild>
        <Link href="/constructor">
          <Plus className="h-4 w-4 mr-2" />
          Новый сценарий
        </Link>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <Link href="/projects?mode=compare">
          <GitCompare className="h-4 w-4 mr-2" />
          Сравнить проекты
        </Link>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <Link href="/constructor?mode=calculator">
          <Calculator className="h-4 w-4 mr-2" />
          Калькулятор эффектов
        </Link>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <Link href="/export">
          <FileDown className="h-4 w-4 mr-2" />
          Экспорт отчёта
        </Link>
      </Button>
    </div>
  );
}
