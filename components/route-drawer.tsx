'use client';

import { X, ExternalLink, GitCompare, MapPin, TrendingUp, Banknote, Users, Train, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RouteBadge, StatusBadge } from '@/components/route-badge';
import type { RouteProject } from '@/lib/data';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface RouteDrawerProps {
  project: RouteProject | null;
  open: boolean;
  onClose: () => void;
}

export function RouteDrawer({ project, open, onClose }: RouteDrawerProps) {
  if (!project) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          'fixed inset-0 z-40 bg-foreground/5 transition-opacity',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div
        className={cn(
          'fixed right-0 top-16 z-50 h-[calc(100vh-4rem)] w-[420px] bg-card shadow-xl transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-start justify-between p-6 pb-4">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 mb-2">
                <RouteBadge type={project.type} size="md" />
                <StatusBadge status={project.status} size="md" />
              </div>
              <h2 className="text-xl font-semibold text-foreground leading-tight">
                {project.name}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Separator />

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              <MetricItem
                icon={MapPin}
                label="Протяжённость"
                value={`${project.length.toLocaleString('ru-RU')} км`}
              />
              <MetricItem
                icon={TrendingUp}
                label="Эффект на ВВП"
                value={`${project.gdpEffect.toLocaleString('ru-RU')} млрд ₽`}
              />
              <MetricItem
                icon={Banknote}
                label="Инвестиции"
                value={`${project.investment.toLocaleString('ru-RU')} млрд ₽`}
              />
              <MetricItem
                icon={Users}
                label="Пассажиропоток"
                value={`${project.passengerFlow} млн/год`}
              />
              <MetricItem
                icon={Users}
                label="Охват населения"
                value={`${project.population} млн чел`}
              />
              <MetricItem
                icon={Train}
                label="Подвижной состав"
                value={`${project.rollingStock} составов`}
              />
            </div>

            {/* Timeline */}
            <div className="rounded-xl bg-secondary/50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Сроки реализации</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-foreground">{project.startYear}</div>
                  <div className="text-xs text-muted-foreground">Начало</div>
                </div>
                <div className="flex-1 mx-4 h-1 bg-border rounded-full relative">
                  <div 
                    className="absolute left-0 top-0 h-full rounded-full bg-primary"
                    style={{ width: project.status === 'in-progress' ? '40%' : '0%' }}
                  />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-foreground">{project.endYear}</div>
                  <div className="text-xs text-muted-foreground">Завершение</div>
                </div>
              </div>
              
              {/* Stages if any */}
              {project.stages && project.stages.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Этапы реализации
                  </span>
                  <div className="mt-2 space-y-2">
                    {project.stages.map((stage, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-foreground">{stage.name}</span>
                        <span className="text-muted-foreground">{stage.year} г. • {stage.length} км</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Analytical Summary */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">Аналитическая сводка</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Проект обеспечит сокращение времени в пути между конечными точками маршрута до{' '}
                {Math.round(project.length / 350)} часов. Прогнозируемый рост пассажиропотока составит{' '}
                {Math.round(project.passengerFlow * 0.15 * 10) / 10} млн пассажиров в год к 2035 году.
                Ожидаемый мультипликативный эффект на экономику регионов присутствия — {(project.gdpEffect * 1.4).toLocaleString('ru-RU')} млрд ₽.
              </p>
            </div>

            {/* Risk Signals */}
            {project.status === 'experimental' && (
              <div className="rounded-xl bg-amber-50 p-4">
                <span className="text-xs font-medium text-amber-700 uppercase tracking-wider">
                  Требует внимания
                </span>
                <p className="mt-1 text-sm text-amber-800">
                  Проект находится на стадии технико-экономического обоснования. 
                  Параметры могут быть скорректированы.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-6 pt-4 border-t border-border bg-card">
            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <Link href={`/projects/${project.id}`}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Открыть проект
                </Link>
              </Button>
              <Button variant="outline" className="flex-1">
                <GitCompare className="h-4 w-4 mr-2" />
                Сравнить
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/map?route=${project.id}`}>
                  <MapPin className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

interface MetricItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function MetricItem({ icon: Icon, label, value }: MetricItemProps) {
  return (
    <div className="rounded-xl bg-secondary/50 p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}
