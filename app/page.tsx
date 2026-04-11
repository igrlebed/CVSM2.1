'use client';

import { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { KPICard } from '@/components/kpi-card';
import { NetworkMap } from '@/components/network-map';
import { TimelineSlider } from '@/components/timeline-slider';
import { RoutesList } from '@/components/routes-list';
import { RouteDrawer } from '@/components/route-drawer';
import { SignalsBlock } from '@/components/signals-block';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, GitCompare, FileDown } from 'lucide-react';
import Link from 'next/link';
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
      <div className="flex flex-col h-[calc(100vh-4rem)] min-h-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-border/40 bg-card shrink-0">
          <h1 className="text-xl font-semibold text-foreground">Обзор сети</h1>
          <p className="text-sm text-muted-foreground">Стратегическое планирование высокоскоростных и скоростных железнодорожных магистралей</p>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden flex">
          {/* Left: KPI + actions + signals + map + timeline */}
          <div className="flex-1 min-h-0 flex flex-col overflow-y-auto p-6 space-y-4">
            {/* KPI Grid — bento */}
            <div className="grid grid-cols-3 gap-3">
              <KPICard label={kpiData.gdpGrowth.label} value={kpiData.gdpGrowth.value} unit={kpiData.gdpGrowth.unit} description={kpiData.gdpGrowth.description} trend={{ value: 12.4, direction: 'up' }} />
              <KPICard label={kpiData.investment.label} value={kpiData.investment.value} unit={kpiData.investment.unit} description={kpiData.investment.description} />
              <KPICard label={kpiData.passengerFlow.label} value={kpiData.passengerFlow.value} unit={kpiData.passengerFlow.unit} description={kpiData.passengerFlow.description} trend={{ value: 8.2, direction: 'up' }} />
              <KPICard label={kpiData.population.label} value={kpiData.population.value} unit={kpiData.population.unit} description={kpiData.population.description} />
              <KPICard label={kpiData.networkLength.label} value={kpiData.networkLength.value} unit={kpiData.networkLength.unit} description={kpiData.networkLength.description} />
              <KPICard label={kpiData.rollingStock.label} value={kpiData.rollingStock.value} unit={kpiData.rollingStock.unit} description={kpiData.rollingStock.description} />
            </div>

            {/* Quick Actions — horizontal bento row */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <Button asChild variant="ghost" className="w-full justify-start gap-3 h-auto py-3">
                    <Link href="/constructor">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                        <Plus className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-foreground">Новый сценарий</p>
                        <p className="text-xs text-muted-foreground">Создание сценария в конструкторе</p>
                      </div>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <Button asChild variant="ghost" className="w-full justify-start gap-3 h-auto py-3">
                    <Link href="/projects?compare=">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary shrink-0">
                        <GitCompare className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-foreground">Сравнить проекты</p>
                        <p className="text-xs text-muted-foreground">Парное сравнение маршрутов</p>
                      </div>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <Button asChild variant="ghost" className="w-full justify-start gap-3 h-auto py-3">
                    <Link href="/analytics/reports">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary shrink-0">
                        <FileDown className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-foreground">Экспорт отчёта</p>
                        <p className="text-xs text-muted-foreground">Выгрузка в xlsx, docx, pdf</p>
                      </div>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Signals */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Сигналы и статусы</CardTitle>
              </CardHeader>
              <CardContent>
                <SignalsBlock />
              </CardContent>
            </Card>

            {/* Map — full width */}
            <Card className="flex-1 min-h-0">
              <CardHeader className="pb-2 shrink-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Схема сети</CardTitle>
                  <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-md">
                    {visibleProjects.length} {visibleProjects.length === 1 ? 'маршрут' : 'маршрутов'} к {selectedYear} году
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 min-h-0 p-0 pt-0">
                <div className="h-full min-h-[300px]">
                  <NetworkMap
                    projects={projects}
                    selectedYear={selectedYear}
                    onRouteClick={handleRouteClick}
                    selectedRouteId={selectedProject?.id}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Хронология развития</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <div className="min-w-[600px]">
                  <TimelineSlider value={selectedYear} onChange={setSelectedYear} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: project list only */}
          <div className="w-[360px] shrink-0 border-l border-border/40 bg-card/50 overflow-y-auto p-4 space-y-2">
            <h3 className="text-sm font-medium text-foreground mb-2">Ключевые маршруты</h3>
            <RoutesList
              projects={projects}
              onRouteClick={handleRouteClick}
              selectedRouteId={selectedProject?.id}
            />
          </div>
        </div>
      </div>

      <RouteDrawer
        project={selectedProject}
        open={drawerOpen}
        onClose={handleCloseDrawer}
      />
    </AppShell>
  );
}
