'use client';

import { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { KPICard } from '@/components/kpi-card';
import { NetworkMap } from '@/components/network-map';
import { TimelineSlider } from '@/components/timeline-slider';
import { RoutesList } from '@/components/routes-list';
import { RouteDrawer } from '@/components/route-drawer';
import { ComparePresets } from '@/components/compare-presets';
import { SignalsBlock } from '@/components/signals-block';
import { QuickActions } from '@/components/quick-actions';
import { kpiData, projects, getProjectsByYear, type RouteProject } from '@/lib/data';

export default function OverviewPage() {
  const [selectedYear, setSelectedYear] = useState(2050);
  const [selectedProject, setSelectedProject] = useState<RouteProject | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const visibleProjects = getProjectsByYear(selectedYear);

  const handleRouteClick = (project: RouteProject) => {
    setSelectedProject(project);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <AppShell>
      {/* Desktop anchored grid: left content + right rail share one viewport height */}
      <div className="h-[calc(100vh-4rem)] min-h-0 p-6 overflow-hidden">
        <div className="grid grid-cols-[minmax(0,1fr)_360px] gap-6 h-full min-h-0">
          {/* Left column */}
          <div className="min-h-0 overflow-y-auto pr-1 space-y-6">
            {/* Hero Summary */}
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-1">
                Обзор сети ВСМ России
              </h1>
              <p className="text-muted-foreground">
                Стратегическое планирование высокоскоростных и скоростных железнодорожных магистралей
              </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-6 gap-3">
              <KPICard
                label={kpiData.gdpGrowth.label}
                value={kpiData.gdpGrowth.value}
                unit={kpiData.gdpGrowth.unit}
                description={kpiData.gdpGrowth.description}
                trend={{ value: 12.4, direction: 'up' }}
              />
              <KPICard
                label={kpiData.investment.label}
                value={kpiData.investment.value}
                unit={kpiData.investment.unit}
                description={kpiData.investment.description}
              />
              <KPICard
                label={kpiData.passengerFlow.label}
                value={kpiData.passengerFlow.value}
                unit={kpiData.passengerFlow.unit}
                description={kpiData.passengerFlow.description}
                trend={{ value: 8.2, direction: 'up' }}
              />
              <KPICard
                label={kpiData.population.label}
                value={kpiData.population.value}
                unit={kpiData.population.unit}
                description={kpiData.population.description}
              />
              <KPICard
                label={kpiData.networkLength.label}
                value={kpiData.networkLength.value}
                unit={kpiData.networkLength.unit}
                description={kpiData.networkLength.description}
              />
              <KPICard
                label={kpiData.rollingStock.label}
                value={kpiData.rollingStock.value}
                unit={kpiData.rollingStock.unit}
                description={kpiData.rollingStock.description}
              />
            </div>

            {/* Map */}
            <div className="rounded-2xl bg-card p-5 border border-border/40">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-foreground">Схема сети</h2>
                <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-md">
                  {visibleProjects.length} {visibleProjects.length === 1 ? 'маршрут' : 'маршрутов'} к {selectedYear} году
                </span>
              </div>
              <div className="h-[340px]">
                <NetworkMap
                  projects={projects}
                  selectedYear={selectedYear}
                  onRouteClick={handleRouteClick}
                  selectedRouteId={selectedProject?.id}
                />
              </div>
            </div>

            {/* Timeline */}
            <div className="rounded-2xl bg-card p-5 border border-border/40">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Хронология развития</h3>
              <TimelineSlider value={selectedYear} onChange={setSelectedYear} />
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl bg-card p-5 border border-border/40">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Быстрые действия</h3>
              <QuickActions />
            </div>
          </div>

          {/* Right rail */}
          <div className="min-h-0 overflow-y-auto space-y-4">
            <div className="rounded-2xl bg-card p-5">
              <h3 className="text-sm font-medium text-foreground mb-4">Ключевые маршруты</h3>
              <RoutesList
                projects={projects}
                onRouteClick={handleRouteClick}
                selectedRouteId={selectedProject?.id}
              />
            </div>

            <div className="rounded-2xl bg-card p-5">
              <h3 className="text-sm font-medium text-foreground mb-4">Быстрое сравнение</h3>
              <ComparePresets />
            </div>

            <div className="rounded-2xl bg-card p-5">
              <h3 className="text-sm font-medium text-foreground mb-4">Сигналы и статусы</h3>
              <SignalsBlock />
            </div>
          </div>
        </div>
      </div>

      {/* Route Drawer */}
      <RouteDrawer
        project={selectedProject}
        open={drawerOpen}
        onClose={handleCloseDrawer}
      />
    </AppShell>
  );
}
