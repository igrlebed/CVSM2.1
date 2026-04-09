'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { TimelineSlider } from '@/components/timeline-slider';
import { RouteBadge, StatusBadge } from '@/components/route-badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { 
  projects, 
  mapLayers, 
  statusFilters, 
  getProjectTypeLabel,
  type RouteProject, 
  type ProjectType, 
  type ProjectStatus 
} from '@/lib/data';
import { cn } from '@/lib/utils';
import { 
  Layers, 
  Filter, 
  X, 
  MapPin, 
  TrendingUp, 
  Banknote, 
  Users, 
  Train,
  GitCompare,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

// Simplified route paths for the full map
const routePaths: Record<string, { path: string }> = {
  'msk-spb': { path: 'M 400 420 Q 370 350 320 260' },
  'msk-ryazan': { path: 'M 400 420 L 480 470' },
  'msk-ekb': { path: 'M 400 420 Q 520 420 620 400 Q 720 380 800 350' },
  'msk-minsk': { path: 'M 400 420 Q 300 430 200 450' },
  'msk-belgorod': { path: 'M 400 420 Q 390 500 370 580' },
  'msk-bryansk': { path: 'M 400 420 Q 320 460 250 500' },
  'msk-yaroslavl': { path: 'M 400 420 Q 450 380 500 330' },
  'msk-adler': { path: 'M 400 420 Q 430 530 460 640 Q 490 720 520 780' },
};

const cities: { name: string; x: number; y: number; major?: boolean }[] = [
  { name: 'Москва', x: 400, y: 420, major: true },
  { name: 'Санкт-Петербург', x: 320, y: 240, major: true },
  { name: 'Рязань', x: 490, y: 480 },
  { name: 'Казань', x: 620, y: 400 },
  { name: 'Екатеринбург', x: 820, y: 340, major: true },
  { name: 'Минск', x: 190, y: 450, major: true },
  { name: 'Белгород', x: 365, y: 590 },
  { name: 'Брянск', x: 245, y: 505 },
  { name: 'Ярославль', x: 510, y: 320 },
  { name: 'Адлер', x: 530, y: 790 },
  { name: 'Нижний Новгород', x: 520, y: 410 },
  { name: 'Воронеж', x: 420, y: 530 },
];

function getRouteColor(type: ProjectType): string {
  switch (type) {
    case 'vsm': return 'var(--vsm-orange)';
    case 'sm': return 'var(--sm-blue)';
    case 'international': return 'var(--international-yellow)';
    case 'in-progress': return 'var(--implementation-green)';
  }
}

function MapPageContent() {
  const searchParams = useSearchParams();
  const initialRouteId = searchParams.get('route') || searchParams.get('project');
  const initialCompareIdsRaw =
    searchParams.get('projects') || searchParams.get('routes') || searchParams.get('compare');
  const initialCompareIds = initialCompareIdsRaw
    ? initialCompareIdsRaw.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const [selectedYear, setSelectedYear] = useState(2050);
  const [selectedRoute, setSelectedRoute] = useState<RouteProject | null>(
    initialRouteId ? projects.find(p => p.id === initialRouteId) || null : null
  );
  const [compareMode, setCompareMode] = useState(initialCompareIds.length > 0);
  const [compareRoutes, setCompareRoutes] = useState<RouteProject[]>(
    initialCompareIds
      .map((id) => projects.find((p) => p.id === id))
      .filter((p): p is RouteProject => Boolean(p))
  );
  const [activeLayer, setActiveLayer] = useState<string>('length');
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);
  
  // Filters
  const [typeFilters, setTypeFilters] = useState<ProjectType[]>(['vsm', 'sm', 'international', 'in-progress']);
  const [statusFilterValues, setStatusFilterValues] = useState<ProjectStatus[]>([
    'approved', 'in-progress', 'in-development', 'experimental', 'international'
  ]);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      if (!typeFilters.includes(p.type)) return false;
      if (!statusFilterValues.includes(p.status)) return false;
      // Check year
      if (p.id === 'msk-ekb') {
        if (selectedYear < 2035) return false;
      } else {
        if (p.endYear > selectedYear && p.status !== 'in-progress') return false;
      }
      return true;
    });
  }, [typeFilters, statusFilterValues, selectedYear]);

  const handleRouteClick = (project: RouteProject) => {
    if (compareMode) {
      if (compareRoutes.find(r => r.id === project.id)) {
        setCompareRoutes(compareRoutes.filter(r => r.id !== project.id));
      } else if (compareRoutes.length < 4) {
        setCompareRoutes([...compareRoutes, project]);
      }
    } else {
      setSelectedRoute(selectedRoute?.id === project.id ? null : project);
    }
  };

  const toggleTypeFilter = (type: ProjectType) => {
    if (typeFilters.includes(type)) {
      setTypeFilters(typeFilters.filter(t => t !== type));
    } else {
      setTypeFilters([...typeFilters, type]);
    }
  };

  const toggleStatusFilter = (status: ProjectStatus) => {
    if (statusFilterValues.includes(status)) {
      setStatusFilterValues(statusFilterValues.filter(s => s !== status));
    } else {
      setStatusFilterValues([...statusFilterValues, status]);
    }
  };

  const getLayerValue = (project: RouteProject): number => {
    switch (activeLayer) {
      case 'length': return project.length;
      case 'gdp': return project.gdpEffect;
      case 'investment': return project.investment;
      case 'rollingStock': return project.rollingStock;
      case 'population': return project.population;
      case 'passengerFlow': return project.passengerFlow;
      default: return project.length;
    }
  };

  const activeLayerInfo = mapLayers.find(l => l.id === activeLayer);

  return (
    <AppShell>
      {/* Desktop anchored grid: filters + map + timeline stay aligned */}
      <div
        className={cn(
          'grid h-[calc(100vh-4rem)] min-h-0',
          'grid-rows-[1fr_auto]',
          selectedRoute || compareRoutes.length > 0
            ? 'grid-cols-[18rem_minmax(0,1fr)_24rem]'
            : 'grid-cols-[18rem_minmax(0,1fr)]'
        )}
      >
        {/* Left Panel - Filters & Layers (row-span keeps it anchored to timeline) */}
        <div className="row-span-2 w-72 bg-card border-r border-border flex flex-col min-h-0">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Фильтры и слои
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Type Filters */}
            <div>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Тип проекта
              </h3>
              <div className="space-y-2">
                {(['vsm', 'sm', 'international', 'in-progress'] as ProjectType[]).map((type) => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      checked={typeFilters.includes(type)}
                      onCheckedChange={() => toggleTypeFilter(type)}
                    />
                    <RouteBadge type={type} size="md" />
                  </label>
                ))}
              </div>
            </div>

            <Separator />

            {/* Status Filters */}
            <div>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Статус
              </h3>
              <div className="space-y-2">
                {statusFilters.map((status) => (
                  <label key={status.id} className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      checked={statusFilterValues.includes(status.id as ProjectStatus)}
                      onCheckedChange={() => toggleStatusFilter(status.id as ProjectStatus)}
                    />
                    <span className="text-sm text-foreground">{status.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <Separator />

            {/* Layers */}
            <div>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Layers className="h-3.5 w-3.5" />
                Аналитический слой
              </h3>
              <div className="space-y-1">
                {mapLayers.map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => setActiveLayer(layer.id)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                      activeLayer === layer.id
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-foreground hover:bg-secondary'
                    )}
                  >
                    {layer.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Compare Mode Toggle */}
          <div className="p-4 border-t border-border">
            <Button
              variant={compareMode ? 'default' : 'outline'}
              className="w-full"
              onClick={() => {
                setCompareMode(!compareMode);
                if (compareMode) {
                  setCompareRoutes([]);
                }
              }}
            >
              <GitCompare className="h-4 w-4 mr-2" />
              {compareMode ? 'Выйти из сравнения' : 'Режим сравнения'}
            </Button>
          </div>
        </div>

        {/* Center - Map */}
        <div className="bg-background flex min-h-0">
          {/* Map Area */}
          <div className="relative flex-1 min-h-0">
            <svg 
              viewBox="0 0 1000 900" 
              className="w-full h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Background */}
              <defs>
                <pattern id="mapGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path 
                    d="M 50 0 L 0 0 0 50" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="0.5"
                    className="text-border"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#mapGrid)" opacity="0.4" />

              {/* Routes */}
              {filteredProjects.map((project) => {
                const route = routePaths[project.id];
                if (!route) return null;

                const isSelected = selectedRoute?.id === project.id;
                const isCompareSelected = compareRoutes.some(r => r.id === project.id);
                const isHovered = hoveredRoute === project.id;
                const color = getRouteColor(project.type);
                const isPartial = project.id === 'msk-ekb' && selectedYear >= 2035 && selectedYear < 2038;

                return (
                  <g key={project.id}>
                    {/* Shadow */}
                    <path
                      d={isPartial ? 'M 400 420 Q 520 420 620 400' : route.path}
                      fill="none"
                      stroke={color}
                      strokeWidth={isSelected || isCompareSelected || isHovered ? 12 : 8}
                      strokeLinecap="round"
                      opacity={0.15}
                      className="transition-all duration-200"
                    />
                    {/* Line */}
                    <path
                      d={isPartial ? 'M 400 420 Q 520 420 620 400' : route.path}
                      fill="none"
                      stroke={color}
                      strokeWidth={isSelected || isCompareSelected || isHovered ? 5 : 3}
                      strokeLinecap="round"
                      strokeDasharray={project.status === 'experimental' ? '10 5' : undefined}
                      className="cursor-pointer transition-all duration-200"
                      onMouseEnter={() => setHoveredRoute(project.id)}
                      onMouseLeave={() => setHoveredRoute(null)}
                      onClick={() => handleRouteClick(project)}
                    />
                    {/* Layer value label */}
                    {(isSelected || isHovered) && (
                      <g>
                        <rect
                          x={project.id === 'msk-ekb' ? 600 : 
                             project.id === 'msk-spb' ? 340 :
                             project.id === 'msk-adler' ? 480 : 350}
                          y={project.id === 'msk-ekb' ? 360 :
                             project.id === 'msk-spb' ? 320 :
                             project.id === 'msk-adler' ? 600 : 440}
                          width="80"
                          height="24"
                          rx="4"
                          className="fill-card"
                        />
                        <text
                          x={project.id === 'msk-ekb' ? 640 : 
                             project.id === 'msk-spb' ? 380 :
                             project.id === 'msk-adler' ? 520 : 390}
                          y={project.id === 'msk-ekb' ? 377 :
                             project.id === 'msk-spb' ? 337 :
                             project.id === 'msk-adler' ? 617 : 457}
                          textAnchor="middle"
                          className="text-xs fill-foreground font-medium"
                        >
                          {getLayerValue(project).toLocaleString('ru-RU')} {activeLayerInfo?.unit}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Cities */}
              {cities.map((city) => (
                <g key={city.name}>
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r={city.major ? 10 : 6}
                    className={cn(
                      'fill-card stroke-2',
                      city.major ? 'stroke-foreground' : 'stroke-muted-foreground'
                    )}
                  />
                  <text
                    x={city.x}
                    y={city.y - (city.major ? 16 : 12)}
                    textAnchor="middle"
                    className={cn(
                      'fill-foreground',
                      city.major ? 'text-sm font-medium' : 'text-xs'
                    )}
                  >
                    {city.name}
                  </text>
                </g>
              ))}
            </svg>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur rounded-xl p-4 shadow-lg">
              <h4 className="text-xs font-medium text-muted-foreground mb-3">Легенда</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-1 rounded-full bg-vsm-orange" />
                  <span className="text-xs text-foreground">ВСМ</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-1 rounded-full bg-sm-blue" />
                  <span className="text-xs text-foreground">СМ</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-1 rounded-full bg-international-yellow" />
                  <span className="text-xs text-foreground">Международный</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-1 rounded-full bg-implementation-green" />
                  <span className="text-xs text-foreground">В реализации</span>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center gap-2">
                  <div className="w-6 h-0.5 border-t-2 border-dashed border-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Экспериментальный</span>
                </div>
              </div>
            </div>

            {/* Active Layer Info */}
            <div className="absolute top-4 left-4 bg-card/95 backdrop-blur rounded-xl px-4 py-2 shadow-lg">
              <span className="text-xs text-muted-foreground">Слой: </span>
              <span className="text-sm font-medium text-foreground">{activeLayerInfo?.label}</span>
            </div>
          </div>
        </div>

        {/* Right Panel - Route Details or Compare (anchored to both rows) */}
        {(selectedRoute || compareRoutes.length > 0) && (
          <div className="row-span-2 w-96 bg-card border-l border-border flex flex-col min-h-0">
            {compareMode && compareRoutes.length > 0 ? (
              // Compare Mode Panel
              <>
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground">
                    Сравнение ({compareRoutes.length})
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCompareRoutes([])}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {compareRoutes.map((route) => (
                    <div key={route.id} className="p-4 rounded-xl bg-secondary/50">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <RouteBadge type={route.type} size="sm" />
                          <h3 className="text-sm font-medium text-foreground mt-1">{route.name}</h3>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 -mt-1 -mr-1"
                          onClick={() => setCompareRoutes(compareRoutes.filter(r => r.id !== route.id))}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Длина</span>
                          <div className="font-medium text-foreground">{route.length.toLocaleString('ru-RU')} км</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">ВВП</span>
                          <div className="font-medium text-foreground">{route.gdpEffect.toLocaleString('ru-RU')} млрд ₽</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Инвестиции</span>
                          <div className="font-medium text-foreground">{route.investment.toLocaleString('ru-RU')} млрд ₽</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Пассажиры</span>
                          <div className="font-medium text-foreground">{route.passengerFlow} млн/год</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-border">
                  <Button className="w-full" asChild>
                    <Link href={`/projects?compare=${compareRoutes.map(r => r.id).join(',')}`}>
                      Открыть полное сравнение
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </>
            ) : selectedRoute ? (
              // Selected Route Panel
              <>
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground">Информация о маршруте</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setSelectedRoute(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Header */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <RouteBadge type={selectedRoute.type} size="md" />
                      <StatusBadge status={selectedRoute.status} size="md" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{selectedRoute.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedRoute.startYear} – {selectedRoute.endYear} гг.
                    </p>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <MetricCard icon={MapPin} label="Протяжённость" value={`${selectedRoute.length.toLocaleString('ru-RU')} км`} />
                    <MetricCard icon={TrendingUp} label="Эффект на ВВП" value={`${selectedRoute.gdpEffect.toLocaleString('ru-RU')} млрд ₽`} />
                    <MetricCard icon={Banknote} label="Инвестиции" value={`${selectedRoute.investment.toLocaleString('ru-RU')} млрд ₽`} />
                    <MetricCard icon={Users} label="Пассажиропоток" value={`${selectedRoute.passengerFlow} млн/год`} />
                    <MetricCard icon={Users} label="Население" value={`${selectedRoute.population} млн чел`} />
                    <MetricCard icon={Train} label="Подвижной состав" value={`${selectedRoute.rollingStock} составов`} />
                  </div>

                  {/* Stages */}
                  {selectedRoute.stages && (
                    <div className="rounded-xl bg-secondary/50 p-4">
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                        Этапы реализации
                      </h4>
                      <div className="space-y-2">
                        {selectedRoute.stages.map((stage, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-foreground">{stage.name}</span>
                            <span className="text-muted-foreground">{stage.year} г.</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-border space-y-2">
                  <Button className="w-full" asChild>
                    <Link href={`/projects/${selectedRoute.id}`}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Открыть проект
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setCompareMode(true);
                      setCompareRoutes([selectedRoute]);
                      setSelectedRoute(null);
                    }}
                  >
                    <GitCompare className="h-4 w-4 mr-2" />
                    Добавить в сравнение
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        )}

        {/* Bottom Timeline (spans only map + right panel columns, stays glued) */}
        <div
          className={cn(
            'col-start-2 bg-card border-t border-border p-4',
            (selectedRoute || compareRoutes.length > 0) ? 'col-span-2' : 'col-span-1'
          )}
        >
          <div className="max-w-3xl mx-auto">
            <TimelineSlider
              value={selectedYear}
              onChange={setSelectedYear}
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default function MapPage() {
  return (
    <Suspense fallback={null}>
      <MapPageContent />
    </Suspense>
  );
}

function MetricCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
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
