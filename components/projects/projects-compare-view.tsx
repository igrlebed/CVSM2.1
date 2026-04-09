'use client';

import { useState, Fragment } from 'react';
import { Button } from '@/components/ui/button';
import { RouteBadge, StatusBadge } from '@/components/route-badge';
import { projects as allProjects, comparisonMetricGroups, getProjectTypeLabel, getProjectStatusLabel } from '@/lib/data';
import type { RouteProject } from '@/lib/data';
import { Plus, X, Map, Download, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectsCompareViewProps {
  selectedProjectIds: string[];
  onToggleProject: (id: string) => void;
  onShowOnMap: () => void;
  onExport: () => void;
}

export function ProjectsCompareView({
  selectedProjectIds,
  onToggleProject,
  onShowOnMap,
  onExport,
}: ProjectsCompareViewProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(comparisonMetricGroups.map(g => g.id));
  const [showProjectSelector, setShowProjectSelector] = useState(false);

  const selectedProjects = selectedProjectIds
    .map(id => allProjects.find(p => p.id === id))
    .filter((p): p is RouteProject => p !== undefined);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const getMetricValue = (project: RouteProject, metricId: string) => {
    const value = project[metricId as keyof RouteProject];
    if (value === undefined || value === null) return '—';
    if (metricId === 'type') return getProjectTypeLabel(project.type);
    if (metricId === 'status') return getProjectStatusLabel(project.status);
    if (typeof value === 'number') return value.toLocaleString('ru-RU');
    return String(value);
  };

  const availableProjects = allProjects.filter(
    p => !selectedProjectIds.includes(p.id) && p.status !== 'archived'
  );

  if (selectedProjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <div className="w-20 h-20 rounded-3xl bg-secondary flex items-center justify-center mb-6">
          <Plus className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Выберите проекты для сравнения</h3>
        <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
          Добавьте несколько проектов из списка, чтобы сравнить их параметры и показатели
        </p>
        <Button onClick={() => setShowProjectSelector(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить проекты
        </Button>

        {/* Project selector */}
        {showProjectSelector && (
          <div className="mt-6 bg-card rounded-2xl border border-border p-4 w-full max-w-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-foreground">Выберите проекты</h4>
              <button onClick={() => setShowProjectSelector(false)} className="p-1 rounded hover:bg-secondary">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-1 max-h-[300px] overflow-y-auto">
              {availableProjects.map(project => (
                <button
                  key={project.id}
                  onClick={() => onToggleProject(project.id)}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors text-left"
                >
                  <RouteBadge type={project.type} />
                  <span className="text-sm text-foreground">{project.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Сравнение {selectedProjects.length} проектов
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowProjectSelector(!showProjectSelector)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Добавить проект
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onShowOnMap}>
            <Map className="h-4 w-4 mr-2" />
            Показать на карте
          </Button>
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Экспорт
          </Button>
        </div>
      </div>

      {/* Project selector dropdown */}
      {showProjectSelector && (
        <div className="mb-4 bg-card rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-foreground">Добавить к сравнению</h4>
            <button onClick={() => setShowProjectSelector(false)} className="p-1 rounded hover:bg-secondary">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableProjects.map(project => (
              <button
                key={project.id}
                onClick={() => onToggleProject(project.id)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary hover:bg-muted transition-colors"
              >
                <RouteBadge type={project.type} size="sm" />
                <span className="text-sm text-foreground">{project.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Comparison table */}
      <div className="flex-1 bg-card rounded-2xl overflow-hidden">
        <div className="overflow-auto h-full">
          <table className="w-full border-collapse">
            {/* Header with projects */}
            <thead className="sticky top-0 z-20 bg-card">
              <tr className="border-b border-border">
                <th className="sticky left-0 z-30 bg-card p-4 text-left min-w-[200px] border-r border-border">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Параметр
                  </span>
                </th>
                {selectedProjects.map(project => (
                  <th key={project.id} className="p-4 min-w-[200px] text-left">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <RouteBadge type={project.type} size="sm" />
                          {project.isInternational && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-international-yellow-bg text-international-yellow rounded-full">
                              Междунар.
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-semibold text-foreground">{project.name}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {project.startYear} – {project.endYear}
                        </p>
                      </div>
                      <button
                        onClick={() => onToggleProject(project.id)}
                        className="p-1 rounded hover:bg-secondary shrink-0"
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {comparisonMetricGroups.map(group => (
                <Fragment key={group.id}>
                  {/* Group header */}
                  <tr
                    key={group.id}
                    className="bg-secondary/50 cursor-pointer hover:bg-secondary/70 transition-colors"
                    onClick={() => toggleGroup(group.id)}
                  >
                    <td
                      colSpan={selectedProjects.length + 1}
                      className="p-3"
                    >
                      <div className="flex items-center gap-2">
                        {expandedGroups.includes(group.id) ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                          {group.label}
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* Metrics rows */}
                  {expandedGroups.includes(group.id) && group.metrics.map(metric => (
                    <tr key={metric.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                      <td className="sticky left-0 z-10 bg-card p-3 border-r border-border">
                        <span className="text-sm text-foreground">{metric.label}</span>
                        {metric.unit && (
                          <span className="text-xs text-muted-foreground ml-1">({metric.unit})</span>
                        )}
                      </td>
                      {selectedProjects.map(project => {
                        const value = getMetricValue(project, metric.id);
                        // Find best value for highlighting
                        const numericValues = selectedProjects
                          .map(p => {
                            const v = p[metric.id as keyof RouteProject];
                            return typeof v === 'number' ? v : null;
                          })
                          .filter((v): v is number => v !== null);
                        
                        const currentValue = project[metric.id as keyof RouteProject];
                        const isBest = typeof currentValue === 'number' && 
                          numericValues.length > 1 &&
                          (metric.id === 'investment' 
                            ? currentValue === Math.min(...numericValues)
                            : currentValue === Math.max(...numericValues));

                        return (
                          <td
                            key={project.id}
                            className={cn(
                              'p-3 text-sm',
                              isBest ? 'text-implementation-green font-semibold' : 'text-foreground'
                            )}
                          >
                            {value}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
