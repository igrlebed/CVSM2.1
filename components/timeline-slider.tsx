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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    // Find closest year from timelineYears
    const closest = timelineYears.reduce((prev, curr) => {
      return Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev;
    });
    onChange(closest);
  };

  const getPosition = (year: number) => {
    return ((year - minYear) / (maxYear - minYear)) * 100;
  };

  return (
    <div className={cn('w-full pt-2 pb-8', className)}>
      <div className="relative flex flex-col gap-6">
        <div className="relative h-6 flex items-center">
          {/* Custom Track Background (under the native input) */}
          <div className="absolute left-0 right-0 h-1.5 bg-secondary rounded-full overflow-hidden pointer-events-none">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${getPosition(value)}%` }}
            />
          </div>

          {/* Native Range Input */}
          <input
            type="range"
            min={minYear}
            max={maxYear}
            step={1}
            value={value}
            onChange={handleInputChange}
            className="absolute w-full h-6 appearance-none bg-transparent cursor-pointer z-10
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 
              [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform
              [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 
              [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 
              [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:shadow-md"
          />

          {/* Markers (Decorative & Clickable) */}
          <div className="absolute left-0 right-0 h-1.5 flex justify-between pointer-events-none">
            {timelineYears.map((year) => (
              <div 
                key={year}
                className={cn(
                  "w-1 h-1.5 rounded-full z-0 transition-colors",
                  year <= value ? "bg-primary-foreground/40" : "bg-border"
                )}
              />
            ))}
          </div>
        </div>

        {/* Labels Row */}
        <div className="relative flex justify-between px-0">
          {timelineYears.map((year) => {
            const isCurrent = year === value;
            return (
              <button
                key={year}
                onClick={() => onChange(year)}
                className="flex flex-col items-center group relative"
                style={{ width: '0', overflow: 'visible' }}
              >
                <span
                  className={cn(
                    'text-[11px] transition-all whitespace-nowrap -translate-x-1/2',
                    isCurrent
                      ? 'font-bold text-primary scale-110'
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
    </div>
  );
}
