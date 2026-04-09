'use client';

import { Button } from '@/components/ui/button';
import { RouteBadge, StatusBadge } from '@/components/route-badge';
import type { RouteProject } from '@/lib/data';
import { X, MapPin, FileText, GitCompareArrows, Map, Download, TrendingUp, Banknote, Users, Train, Calendar } from 'lucide-react';

interface ProjectSummaryPanelProps {
  project: RouteProject;
  onClose: () => void;
  onOpenCard: () => void;
  onAddToCompare: () => void;
  onShowOnMap: () => void;
  onExport: () => void;
  isInCompare?: boolean;
}

export function ProjectSummaryPanel({
  project,
  onClose,
  onOpenCard,
  onAddToCompare,
  onShowOnMap,
  onExport,
  isInCompare = false,
}: ProjectSummaryPanelProps) {
  return (
    <div className="w-[340px] bg-card rounded-2xl border border-border overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <RouteBadge type={project.type} size="md" />
            <StatusBadge status={project.status} size="md" />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-secondary transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">{project.name}</h3>
        <p className="text-sm text-muted-foreground">
          {project.startYear} – {project.endYear} гг.
        </p>
      </div>

      {/* Metrics */}
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-secondary/50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Протяжённость</span>
            </div>
            <span className="text-lg font-semibold text-foreground">
              {project.length.toLocaleString('ru-RU')} км
            </span>
          </div>

          <div className="bg-secondary/50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Вклад в ВВП</span>
            </div>
            <span className="text-lg font-semibold text-foreground">
              {project.gdpEffect.toLocaleString('ru-RU')} млрд
            </span>
          </div>

          <div className="bg-secondary/50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Banknote className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Инвестиции</span>
            </div>
            <span className="text-lg font-semibold text-foreground">
              {project.investment.toLocaleString('ru-RU')} млрд
            </span>
          </div>

          <div className="bg-secondary/50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Пассажиропоток</span>
            </div>
            <span className="text-lg font-semibold text-foreground">
              {project.passengerFlow} млн/год
            </span>
          </div>

          <div className="bg-secondary/50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Train className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Потребный парк</span>
            </div>
            <span className="text-lg font-semibold text-foreground">
              {project.rollingStock} составов
            </span>
          </div>

          <div className="bg-secondary/50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Сроки</span>
            </div>
            <span className="text-lg font-semibold text-foreground">
              {project.endYear - project.startYear} лет
            </span>
          </div>
        </div>

        {/* Stages if any */}
        {project.stages && project.stages.length > 0 && (
          <div className="mt-4">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Этапы реализации
            </h4>
            <div className="space-y-2">
              {project.stages.map((stage, index) => (
                <div key={index} className="flex items-center justify-between bg-secondary/30 rounded-lg px-3 py-2">
                  <span className="text-sm text-foreground">{stage.name}</span>
                  <span className="text-xs text-muted-foreground">{stage.year} г.</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional info */}
        <div className="mt-4 pt-4 border-t border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Источник данных</span>
            <span className="text-sm text-foreground">{project.dataSource}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Обновлено</span>
            <span className="text-sm text-foreground">
              {project.lastUpdated ? new Date(project.lastUpdated).toLocaleDateString('ru-RU') : '—'}
            </span>
          </div>
          {project.scenarios && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Сценарии</span>
              <span className="text-sm text-foreground">{project.scenarios.join(', ')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border space-y-2">
        <Button onClick={onOpenCard} className="w-full justify-start" variant="outline" size="sm">
          <FileText className="h-4 w-4 mr-2" />
          Открыть карточку
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={onAddToCompare}
            variant={isInCompare ? 'secondary' : 'outline'}
            size="sm"
            className="justify-start"
          >
            <GitCompareArrows className="h-4 w-4 mr-2" />
            {isInCompare ? 'В сравнении' : 'К сравнению'}
          </Button>
          <Button onClick={onShowOnMap} variant="outline" size="sm" className="justify-start">
            <Map className="h-4 w-4 mr-2" />
            На карте
          </Button>
        </div>
        <Button onClick={onExport} variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
          <Download className="h-4 w-4 mr-2" />
          Экспортировать
        </Button>
      </div>
    </div>
  );
}
