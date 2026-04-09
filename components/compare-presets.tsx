'use client';

import { GitCompare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { comparePresets, projects } from '@/lib/data';
import Link from 'next/link';

interface ComparePresetsProps {
  className?: string;
}

export function ComparePresets({ className }: ComparePresetsProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {comparePresets.map((preset) => {
        const presetProjects = preset.projectIds
          .map(id => projects.find(p => p.id === id))
          .filter(Boolean);

        return (
          <Link
            key={preset.id}
            href={`/projects?compare=${preset.projectIds.join(',')}`}
            className="block p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors group"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {preset.label}
                </span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {presetProjects.map((p) => (
                    <span
                      key={p!.id}
                      className="text-xs px-2 py-0.5 rounded-full bg-card text-muted-foreground"
                    >
                      {p!.name.split(' – ')[1]}
                    </span>
                  ))}
                </div>
              </div>
              <GitCompare className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
