'use client';

import { cn } from '@/lib/utils';
import { List, GitCompareArrows, BarChart3, FileText } from 'lucide-react';

export type ProjectsMode = 'list' | 'compare' | 'ranking' | 'card';

interface ProjectsNavProps {
  mode: ProjectsMode;
  onModeChange: (mode: ProjectsMode) => void;
  projectName?: string; // For card mode breadcrumb
}

export function ProjectsNav({ mode, onModeChange, projectName }: ProjectsNavProps) {
  const tabs = [
    { id: 'list' as const, label: 'Список', icon: List },
    { id: 'compare' as const, label: 'Сравнение', icon: GitCompareArrows },
    { id: 'ranking' as const, label: 'Ранжирование', icon: BarChart3 },
  ];

  return (
    <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = mode === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onModeChange(tab.id)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              isActive
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
            )}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
          </button>
        );
      })}
      {mode === 'card' && projectName && (
        <>
          <div className="w-px h-5 bg-border mx-1" />
          <div className="flex items-center gap-2 px-3 py-1.5 bg-card rounded-md shadow-sm">
            <FileText className="h-4 w-4" />
            <span className="text-sm font-medium text-foreground">Карточка проекта</span>
          </div>
        </>
      )}
    </div>
  );
}
