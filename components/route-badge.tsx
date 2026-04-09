import { cn } from '@/lib/utils';
import type { ProjectType, ProjectStatus } from '@/lib/data';

interface RouteBadgeProps {
  type: ProjectType;
  size?: 'sm' | 'md';
  className?: string;
}

export function RouteBadge({ type, size = 'sm', className }: RouteBadgeProps) {
  const styles = {
    vsm: 'bg-vsm-orange-bg text-vsm-orange border-vsm-orange/20',
    sm: 'bg-sm-blue-bg text-sm-blue border-sm-blue/20',
    international: 'bg-international-yellow-bg text-international-yellow border-international-yellow/20',
    'in-progress': 'bg-implementation-green-bg text-implementation-green border-implementation-green/20',
  };

  const labels = {
    vsm: 'ВСМ',
    sm: 'СМ',
    international: 'Междунар.',
    'in-progress': 'Реализация',
  };

  return (
    <span
      className={cn(
        'inline-flex w-fit items-center justify-center font-bold rounded-full border whitespace-nowrap shrink-0',
        size === 'sm' ? 'text-[9px] px-1.5 h-[18px] min-w-[32px]' : 'text-[10px] px-2 h-5 min-w-[40px]',
        styles[type],
        className
      )}
    >
      {labels[type]}
    </span>
  );
}

interface StatusBadgeProps {
  status: ProjectStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export function StatusBadge({ status, size = 'sm', className }: StatusBadgeProps) {
  const styles: Record<ProjectStatus, string> = {
    approved: 'bg-emerald-50 text-emerald-700',
    'in-progress': 'bg-implementation-green-bg text-implementation-green',
    'in-development': 'bg-amber-50 text-amber-700',
    experimental: 'bg-purple-50 text-purple-700',
    archived: 'bg-gray-100 text-gray-600',
    international: 'bg-international-yellow-bg text-international-yellow',
  };

  const labels: Record<ProjectStatus, string> = {
    approved: 'Утверждён',
    'in-progress': 'В реализации',
    'in-development': 'В разработке',
    experimental: 'Экспериментальный',
    archived: 'Архивный',
    international: 'Международный',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1',
        styles[status],
        className
      )}
    >
      {labels[status]}
    </span>
  );
}
