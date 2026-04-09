import { cn } from '@/lib/utils';

interface KPICardProps {
  label: string;
  value: number | string;
  unit: string;
  description?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  className?: string;
}

export function KPICard({ label, value, unit, description, trend, className }: KPICardProps) {
  return (
    <div className={cn(
      'flex flex-col justify-between rounded-2xl bg-card p-5',
      className
    )}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium text-muted-foreground leading-tight">
          {label}
        </span>
        {trend && (
          <span className={cn(
            'text-xs font-medium px-1.5 py-0.5 rounded',
            trend.direction === 'up' 
              ? 'text-emerald-700 bg-emerald-50' 
              : 'text-red-700 bg-red-50'
          )}>
            {trend.direction === 'up' ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <div className="mt-3">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-semibold tracking-tight text-foreground">
            {typeof value === 'number' ? value.toLocaleString('ru-RU') : value}
          </span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
        {description && (
          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
