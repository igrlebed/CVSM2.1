'use client';

import { cn } from '@/lib/utils';
import { timelineYears } from '@/lib/data';

interface TimelineSliderProps {
  value: number;
  onChange: (year: number) => void;
  className?: string;
}

export function TimelineSlider({ value, onChange, className }: TimelineSliderProps) {
  const minYear = timelineYears[0];
  const maxYear = timelineYears[timelineYears.length - 1];

  const handleClick = (year: number) => {
    onChange(year);
  };

  const getPosition = (year: number) => {
    return ((year - minYear) / (maxYear - minYear)) * 100;
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="relative h-12">
        {/* Track */}
        <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-border rounded-full">
          {/* Progress */}
          <div 
            className="absolute top-0 left-0 h-full bg-primary/20 rounded-full transition-all duration-300"
            style={{ width: `${getPosition(value)}%` }}
          />
        </div>

        {/* Year markers */}
        {timelineYears.map((year) => {
          const isActive = year <= value;
          const isCurrent = year === value;

          return (
            <button
              key={year}
              onClick={() => handleClick(year)}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group"
              style={{ left: `${getPosition(year)}%` }}
            >
              {/* Dot */}
              <div
                className={cn(
                  'w-3 h-3 rounded-full border-2 transition-all duration-200',
                  isCurrent
                    ? 'w-4 h-4 bg-primary border-primary'
                    : isActive
                    ? 'bg-primary/20 border-primary'
                    : 'bg-card border-border group-hover:border-muted-foreground'
                )}
              />
              {/* Year label */}
              <span
                className={cn(
                  'absolute top-6 text-xs transition-colors whitespace-nowrap',
                  isCurrent
                    ? 'font-semibold text-foreground'
                    : isActive
                    ? 'text-muted-foreground'
                    : 'text-muted-foreground/60 group-hover:text-muted-foreground'
                )}
              >
                {year}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
