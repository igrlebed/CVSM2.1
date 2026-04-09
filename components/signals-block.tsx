'use client';

import { AlertTriangle, CheckCircle2, Clock, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Signal {
  id: string;
  type: 'success' | 'warning' | 'info' | 'pending';
  title: string;
  description: string;
  project?: string;
}

const signals: Signal[] = [
  {
    id: '1',
    type: 'success',
    title: 'Москва – Санкт-Петербург',
    description: 'Строительство идёт по графику. Готовность — 42%',
    project: 'msk-spb',
  },
  {
    id: '2',
    type: 'warning',
    title: 'Требуется согласование',
    description: 'Москва – Брянск: ожидает утверждения ТЭО',
    project: 'msk-bryansk',
  },
  {
    id: '3',
    type: 'info',
    title: 'Обновление данных',
    description: 'Актуализированы параметры маршрута Москва – Екатеринбург',
    project: 'msk-ekb',
  },
  {
    id: '4',
    type: 'pending',
    title: 'Международное согласование',
    description: 'Москва – Минск: переговоры с белорусской стороной',
    project: 'msk-minsk',
  },
];

const iconMap = {
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
  pending: Clock,
};

const styleMap = {
  success: 'text-emerald-600 bg-emerald-50',
  warning: 'text-amber-600 bg-amber-50',
  info: 'text-blue-600 bg-blue-50',
  pending: 'text-muted-foreground bg-secondary',
};

interface SignalsBlockProps {
  className?: string;
}

export function SignalsBlock({ className }: SignalsBlockProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {signals.map((signal) => {
        const Icon = iconMap[signal.type];

        return (
          <div
            key={signal.id}
            className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50"
          >
            <div className={cn('p-1.5 rounded-lg shrink-0', styleMap[signal.type])}>
              <Icon className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-sm font-medium text-foreground block">
                {signal.title}
              </span>
              <span className="text-xs text-muted-foreground">
                {signal.description}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
