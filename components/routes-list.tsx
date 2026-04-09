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
              'w-full grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-3 rounded-xl transition-all text-left',
              isSelected
                ? 'bg-primary/5 ring-1 ring-primary/20'
                : 'bg-secondary/50 hover:bg-secondary'
            )}
          >
            <RouteBadge type={project.type} />
            
            <div className="min-w-0">
              <span className="text-sm font-semibold text-foreground block truncate mb-0.5">
                {project.name}
              </span>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{project.length.toLocaleString('ru-RU')} км</span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 shrink-0" />
                  <span>~{project.investment.toLocaleString('ru-RU')} млрд</span>
                </span>
              </div>
            </div>

            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
          </button>
        );
      })}
    </div>
  );
}
