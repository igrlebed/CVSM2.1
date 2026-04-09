'use client';

import { ArrowRight, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RouteBadge } from '@/components/route-badge';
import type { RouteProject } from '@/lib/data';

interface RoutesListProps {
  projects: RouteProject[];
  onRouteClick: (project: RouteProject) => void;
  selectedRouteId?: string | null;
  className?: string;
}

export function RoutesList({ projects, onRouteClick, selectedRouteId, className }: RoutesListProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {projects.map((project) => {
        const isSelected = selectedRouteId === project.id;

        return (
          <button
            key={project.id}
            onClick={() => onRouteClick(project)}
            className={cn(
              'w-full p-3 rounded-xl transition-all text-left',
              isSelected
                ? 'bg-primary/5 ring-1 ring-primary/20'
                : 'bg-secondary/50 hover:bg-secondary'
            )}
          >
            <div className="min-w-0 flex flex-col gap-1.5">
              {/* Top row: badge + arrow */}
              <div className="flex items-start justify-between gap-2 min-w-0">
                <RouteBadge type={project.type} />
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              </div>

              {/* Title */}
              <span className="text-sm font-semibold text-foreground block truncate">
                {project.name}
              </span>

              {/* Meta */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground min-w-0">
                <span className="whitespace-nowrap">{project.length.toLocaleString('ru-RU')} км</span>
                <span className="flex items-center gap-1 min-w-0">
                  <TrendingUp className="h-3 w-3 shrink-0" />
                  <span className="truncate">~{project.investment.toLocaleString('ru-RU')} млрд</span>
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
