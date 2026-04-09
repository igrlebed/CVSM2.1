'use client';

import { Button } from '@/components/ui/button';
import { RouteBadge } from '@/components/route-badge';
import type { RouteProject } from '@/lib/data';
import { X, GitCompareArrows, Map } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompareTrayProps {
  selectedProjects: RouteProject[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onCompare: () => void;
  onShowOnMap: () => void;
  className?: string;
}

export function CompareTray({
  selectedProjects,
  onRemove,
  onClear,
  onCompare,
  onShowOnMap,
  className,
}: CompareTrayProps) {
  if (selectedProjects.length === 0) return null;

  return (
    <div
      className={cn(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-50',
        'bg-card rounded-2xl shadow-lg border border-border',
        'px-4 py-3 flex items-center gap-4',
        'animate-in slide-in-from-bottom-4 duration-300',
        className
      )}
    >
      {/* Selected projects */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground mr-2">
          Выбрано: {selectedProjects.length}
        </span>
        <div className="flex items-center gap-1.5">
          {selectedProjects.slice(0, 4).map((project) => (
            <div
              key={project.id}
              className="flex items-center gap-1.5 bg-secondary rounded-lg px-2.5 py-1.5"
            >
              <RouteBadge type={project.type} size="sm" />
              <span className="text-sm font-medium text-foreground max-w-[120px] truncate">
                {project.name.split(' – ')[1] || project.name}
              </span>
              <button
                onClick={() => onRemove(project.id)}
                className="ml-1 p-0.5 rounded hover:bg-muted transition-colors"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
          ))}
          {selectedProjects.length > 4 && (
            <div className="px-2.5 py-1.5 bg-secondary rounded-lg">
              <span className="text-sm text-muted-foreground">
                +{selectedProjects.length - 4}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-8 bg-border" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-muted-foreground"
        >
          Очистить
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onShowOnMap}
        >
          <Map className="h-4 w-4 mr-1.5" />
          На карте
        </Button>
        <Button
          size="sm"
          onClick={onCompare}
          className="bg-primary text-primary-foreground"
        >
          <GitCompareArrows className="h-4 w-4 mr-1.5" />
          Сравнить
        </Button>
      </div>
    </div>
  );
}
