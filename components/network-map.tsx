'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { RouteProject, ProjectType } from '@/lib/data';

interface NetworkMapProps {
  projects: RouteProject[];
  selectedYear: number;
  onRouteClick?: (project: RouteProject) => void;
  selectedRouteId?: string | null;
  className?: string;
  interactive?: boolean;
}

// Simplified route paths for visualization
const routePaths: Record<string, { path: string; labelPos: { x: number; y: number } }> = {
  'msk-spb': {
    path: 'M 300 340 Q 280 280 240 200',
    labelPos: { x: 250, y: 270 },
  },
  'msk-ryazan': {
    path: 'M 300 340 L 360 380',
    labelPos: { x: 340, y: 355 },
  },
  'msk-ekb': {
    path: 'M 300 340 Q 400 340 480 320 Q 560 300 620 280',
    labelPos: { x: 460, y: 305 },
  },
  'msk-minsk': {
    path: 'M 300 340 Q 220 350 140 360',
    labelPos: { x: 200, y: 365 },
  },
  'msk-belgorod': {
    path: 'M 300 340 Q 290 400 270 460',
    labelPos: { x: 265, y: 410 },
  },
  'msk-bryansk': {
    path: 'M 300 340 Q 240 370 180 400',
    labelPos: { x: 220, y: 380 },
  },
  'msk-yaroslavl': {
    path: 'M 300 340 Q 340 300 380 260',
    labelPos: { x: 350, y: 285 },
  },
  'msk-adler': {
    path: 'M 300 340 Q 320 420 340 500 Q 360 560 380 600',
    labelPos: { x: 355, y: 520 },
  },
};

const cities: { name: string; x: number; y: number; major?: boolean }[] = [
  { name: 'Москва', x: 300, y: 340, major: true },
  { name: 'Санкт-Петербург', x: 240, y: 180, major: true },
  { name: 'Рязань', x: 370, y: 390 },
  { name: 'Казань', x: 480, y: 320 },
  { name: 'Екатеринбург', x: 630, y: 270, major: true },
  { name: 'Минск', x: 130, y: 360, major: true },
  { name: 'Белгород', x: 265, y: 470 },
  { name: 'Брянск', x: 175, y: 405 },
  { name: 'Ярославль', x: 390, y: 250 },
  { name: 'Адлер', x: 390, y: 610 },
];

function getRouteColor(type: ProjectType): string {
  switch (type) {
    case 'vsm': return 'var(--vsm-orange)';
    case 'sm': return 'var(--sm-blue)';
    case 'international': return 'var(--international-yellow)';
    case 'in-progress': return 'var(--implementation-green)';
  }
}

export function NetworkMap({ 
  projects, 
  selectedYear, 
  onRouteClick, 
  selectedRouteId,
  className,
  interactive = true 
}: NetworkMapProps) {
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);

  // Filter projects based on selected year
  const visibleProjects = projects.filter(p => {
    if (p.id === 'msk-ekb') {
      if (selectedYear >= 2038) return true;
      if (selectedYear >= 2035) return true;
      return selectedYear >= p.startYear;
    }
    return p.endYear <= selectedYear || p.status === 'in-progress';
  });

  return (
    <div className={cn('relative w-full h-full bg-secondary/30 rounded-2xl overflow-hidden', className)}>
      <svg 
        viewBox="0 0 800 700" 
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path 
              d="M 40 0 L 0 0 0 40" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="0.5"
              className="text-border"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" opacity="0.5" />

        {/* Routes */}
        {visibleProjects.map((project) => {
          const route = routePaths[project.id];
          if (!route) return null;

          const isSelected = selectedRouteId === project.id;
          const isHovered = hoveredRoute === project.id;
          const color = getRouteColor(project.type);

          // Check if route is partial (Москва–Екатеринбург before 2038)
          const isPartial = project.id === 'msk-ekb' && selectedYear >= 2035 && selectedYear < 2038;

          return (
            <g key={project.id}>
              {/* Route line shadow */}
              <path
                d={isPartial ? 'M 300 340 Q 400 340 480 320' : route.path}
                fill="none"
                stroke={color}
                strokeWidth={isSelected || isHovered ? 8 : 5}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.2}
                className="transition-all duration-200"
              />
              {/* Route line */}
              <path
                d={isPartial ? 'M 300 340 Q 400 340 480 320' : route.path}
                fill="none"
                stroke={color}
                strokeWidth={isSelected || isHovered ? 4 : 3}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={project.status === 'experimental' ? '8 4' : undefined}
                className={cn(
                  'transition-all duration-200',
                  interactive && 'cursor-pointer'
                )}
                onMouseEnter={() => interactive && setHoveredRoute(project.id)}
                onMouseLeave={() => setHoveredRoute(null)}
                onClick={() => interactive && onRouteClick?.(project)}
              />
            </g>
          );
        })}

        {/* Cities */}
        {cities.map((city) => (
          <g key={city.name}>
            <circle
              cx={city.x}
              cy={city.y}
              r={city.major ? 8 : 5}
              className={cn(
                'fill-card stroke-2',
                city.major ? 'stroke-foreground' : 'stroke-muted-foreground'
              )}
            />
            <text
              x={city.x}
              y={city.y - (city.major ? 14 : 10)}
              textAnchor="middle"
              className={cn(
                'fill-foreground',
                city.major ? 'text-xs font-medium' : 'text-[10px]'
              )}
            >
              {city.name}
            </text>
          </g>
        ))}

        {/* Hovered route label */}
        {hoveredRoute && routePaths[hoveredRoute] && (
          <g>
            <rect
              x={routePaths[hoveredRoute].labelPos.x - 60}
              y={routePaths[hoveredRoute].labelPos.y - 10}
              width="120"
              height="20"
              rx="4"
              className="fill-card"
            />
            <text
              x={routePaths[hoveredRoute].labelPos.x}
              y={routePaths[hoveredRoute].labelPos.y + 4}
              textAnchor="middle"
              className="text-[10px] fill-foreground font-medium"
            >
              {projects.find(p => p.id === hoveredRoute)?.name}
            </text>
          </g>
        )}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex items-center gap-4 bg-card/90 backdrop-blur rounded-lg px-3 py-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-1 rounded-full bg-vsm-orange" />
          <span className="text-[10px] text-muted-foreground">ВСМ</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-1 rounded-full bg-sm-blue" />
          <span className="text-[10px] text-muted-foreground">СМ</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-1 rounded-full bg-international-yellow" />
          <span className="text-[10px] text-muted-foreground">Междунар.</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-1 rounded-full bg-implementation-green" />
          <span className="text-[10px] text-muted-foreground">В реализации</span>
        </div>
      </div>

      {/* Year indicator */}
      <div className="absolute top-4 right-4 bg-card/90 backdrop-blur rounded-lg px-3 py-1.5">
        <span className="text-xs text-muted-foreground">Год: </span>
        <span className="text-sm font-semibold text-foreground">{selectedYear}</span>
      </div>
    </div>
  );
}
