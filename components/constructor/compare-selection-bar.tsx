'use client';

import { GitCompare, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CompareSelectionBarProps {
  count: number;
  onCompare: () => void;
  onClear: () => void;
  className?: string;
}

export function CompareSelectionBar({
  count,
  onCompare,
  onClear,
  className,
}: CompareSelectionBarProps) {
  if (count === 0) return null;

  return (
    <div
      className={cn(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-4 py-3 rounded-2xl border bg-card/95 backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300',
        className
      )}
    >
      <div className="flex items-center gap-3 pr-2 border-r border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sm-blue/10 text-sm-blue">
          <GitCompare className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-foreground">Сравнение</span>
          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
            Выбрано: <span className="font-medium text-foreground">{count}</span>
            {count < 2 && ' (нужно 2+)'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          onClick={onCompare}
          disabled={count < 2}
          className={cn(
            'h-9 gap-1.5 px-4 font-medium transition-all shadow-md',
            count >= 2 
              ? 'bg-sm-blue hover:bg-sm-blue/90 text-white' 
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          )}
        >
          <span>Сравнить сценарии</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg"
          aria-label="Очистить выбор"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
