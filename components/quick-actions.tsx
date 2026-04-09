'use client';

import { Plus, FileDown, GitCompare, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePermission } from '@/hooks/use-permission';

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className }: QuickActionsProps) {
  const { can } = usePermission();

  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      {can('view:constructor') && can('create:scenario') && (
        <Button variant="outline" size="sm" asChild className="h-9 px-4 rounded-lg bg-background hover:bg-secondary/50 border-border/60 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]">
          <Link href="/constructor">
            <Plus className="h-4 w-4 mr-2 text-primary" />
            <span>Новый сценарий</span>
          </Link>
        </Button>
      )}
      <Button variant="outline" size="sm" asChild className="h-9 px-4 rounded-lg bg-background hover:bg-secondary/50 border-border/60 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]">
        <Link href="/projects?mode=compare">
          <GitCompare className="h-4 w-4 mr-2 text-primary" />
          <span>Сравнить проекты</span>
        </Link>
      </Button>
      {can('view:constructor') && (
        <Button variant="outline" size="sm" asChild className="h-9 px-4 rounded-lg bg-background hover:bg-secondary/50 border-border/60 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]">
          <Link href="/constructor?mode=calculator">
            <Calculator className="h-4 w-4 mr-2 text-primary" />
            <span>Калькулятор</span>
          </Link>
        </Button>
      )}
      {can('view:export') && (
        <Button variant="outline" size="sm" asChild className="h-9 px-4 rounded-lg bg-background hover:bg-secondary/50 border-border/60 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]">
          <Link href="/export">
            <FileDown className="h-4 w-4 mr-2 text-primary" />
            <span>Экспорт отчёта</span>
          </Link>
        </Button>
      )}
    </div>
  );
}
