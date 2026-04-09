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
              'w-full flex items-center justify-between p-3 rounded-xl transition-all text-left',
              isSelected
                ? 'bg-primary/5 ring-1 ring-primary/20'
                : 'bg-secondary/50 hover:bg-secondary'
            )}
          >
            <div className="flex items-center gap-3 min-w-0">
              <RouteBadge type={project.type} />
              <div className="min-w-0">
                <span className="text-sm font-medium text-foreground block truncate">
                  {project.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {project.length.toLocaleString('ru-RU')} км
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  <span>{project.gdpEffect.toLocaleString('ru-RU')} млрд</span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </button>
        );
      })}
    </div>
  );
}
