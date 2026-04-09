'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RouteBadge, StatusBadge } from '@/components/route-badge';
import { ProjectSummaryPanel } from './project-summary-panel';
import type { RouteProject, ProjectType, ProjectStatus } from '@/lib/data';
import { Search, Filter, ArrowUpDown, Download, ChevronDown, ChevronRight, X, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectsListViewProps {
  projects: RouteProject[];
  selectedProjectIds: string[];
  onToggleProject: (id: string) => void;
  onOpenCard: (project: RouteProject) => void;
  onShowOnMap: (project: RouteProject) => void;
  onExport: (project: RouteProject) => void;
}

interface FilterState {
  types: ProjectType[];
  statuses: ProjectStatus[];
  isInternational: boolean | null;
  isStaged: boolean | null;
  yearRange: [number, number];
  scenarios: string[];
  hasMissingData: boolean | null;
  archived: boolean;
}

const defaultFilters: FilterState = {
  types: [],
  statuses: [],
  isInternational: null,
  isStaged: null,
  yearRange: [2024, 2050],
  scenarios: [],
  hasMissingData: null,
  archived: false,
};

type SortField = 'name' | 'type' | 'status' | 'startYear' | 'length' | 'investment' | 'gdpEffect' | 'passengerFlow' | 'population' | 'rollingStock' | 'lastUpdated';
type SortDirection = 'asc' | 'desc';

export function ProjectsListView({
  projects,
  selectedProjectIds,
  onToggleProject,
  onOpenCard,
  onShowOnMap,
  onExport,
}: ProjectsListViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedRow, setSelectedRow] = useState<RouteProject | null>(null);

  // Filter projects
  const filteredProjects = projects.filter(p => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filters.types.length > 0 && !filters.types.includes(p.type)) return false;
    if (filters.statuses.length > 0 && !filters.statuses.includes(p.status)) return false;
    if (filters.isInternational !== null && p.isInternational !== filters.isInternational) return false;
    if (filters.isStaged !== null && p.isStaged !== filters.isStaged) return false;
    if (p.startYear < filters.yearRange[0] || p.startYear > filters.yearRange[1]) return false;
    if (!filters.archived && p.status === 'archived') return false;
    if (filters.hasMissingData !== null && p.hasMissingData !== filters.hasMissingData) return false;
    return true;
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name, 'ru');
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      case 'startYear':
        comparison = a.startYear - b.startYear;
        break;
      case 'length':
        comparison = a.length - b.length;
        break;
      case 'investment':
        comparison = a.investment - b.investment;
        break;
      case 'gdpEffect':
        comparison = a.gdpEffect - b.gdpEffect;
        break;
      case 'passengerFlow':
        comparison = a.passengerFlow - b.passengerFlow;
        break;
      case 'population':
        comparison = a.population - b.population;
        break;
      case 'rollingStock':
        comparison = a.rollingStock - b.rollingStock;
        break;
      case 'lastUpdated':
        comparison = (a.lastUpdated || '').localeCompare(b.lastUpdated || '');
        break;
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const activeFiltersCount = [
    filters.types.length > 0,
    filters.statuses.length > 0,
    filters.isInternational !== null,
    filters.isStaged !== null,
    filters.hasMissingData !== null,
    filters.archived,
  ].filter(Boolean).length;

  return (
    <div className="flex gap-5 h-full">
      {/* Filter Rail */}
      {showFilters && (
        <div className="w-[260px] bg-card rounded-2xl p-4 shrink-0 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Фильтры</h3>
            <button
              onClick={() => setFilters(defaultFilters)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Сбросить
            </button>
          </div>

          {/* Type filter */}
          <div className="mb-5">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Тип</h4>
            <div className="space-y-2">
              {(['vsm', 'sm', 'international', 'in-progress'] as ProjectType[]).map(type => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={filters.types.includes(type)}
                    onCheckedChange={(checked) => {
                      setFilters(f => ({
                        ...f,
                        types: checked
                          ? [...f.types, type]
                          : f.types.filter(t => t !== type)
                      }));
                    }}
                  />
                  <RouteBadge type={type} size="sm" />
                </label>
              ))}
            </div>
          </div>

          {/* Status filter */}
          <div className="mb-5">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Статус</h4>
            <div className="space-y-2">
              {(['approved', 'in-progress', 'in-development', 'experimental', 'international'] as ProjectStatus[]).map(status => (
                <label key={status} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={filters.statuses.includes(status)}
                    onCheckedChange={(checked) => {
                      setFilters(f => ({
                        ...f,
                        statuses: checked
                          ? [...f.statuses, status]
                          : f.statuses.filter(s => s !== status)
                      }));
                    }}
                  />
                  <StatusBadge status={status} size="sm" />
                </label>
              ))}
            </div>
          </div>

          {/* International filter */}
          <div className="mb-5">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Категория</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.isInternational === true}
                  onCheckedChange={(checked) => {
                    setFilters(f => ({ ...f, isInternational: checked ? true : null }));
                  }}
                />
                <span className="text-sm text-foreground">Международные</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.isStaged === true}
                  onCheckedChange={(checked) => {
                    setFilters(f => ({ ...f, isStaged: checked ? true : null }));
                  }}
                />
                <span className="text-sm text-foreground">Этапные</span>
              </label>
            </div>
          </div>

          {/* Data quality */}
          <div className="mb-5">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Качество данных</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.hasMissingData === true}
                  onCheckedChange={(checked) => {
                    setFilters(f => ({ ...f, hasMissingData: checked ? true : null }));
                  }}
                />
                <span className="text-sm text-foreground">С пропусками данных</span>
              </label>
            </div>
          </div>

          {/* Archived */}
          <div className="pt-4 border-t border-border">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.archived}
                onCheckedChange={(checked) => {
                  setFilters(f => ({ ...f, archived: !!checked }));
                }}
              />
              <span className="text-sm text-foreground">Показать архивные</span>
            </label>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по названию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant={showFilters ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Фильтры
              {activeFiltersCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {sortedProjects.length} из {projects.length}
            </span>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Экспорт
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 bg-card rounded-2xl overflow-hidden flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full min-w-[1200px]">
              <thead className="sticky top-0 z-10 bg-card border-b border-border">
                <tr>
                  <th className="w-10 p-3">
                    <Checkbox
                      checked={sortedProjects.length > 0 && sortedProjects.every(p => selectedProjectIds.includes(p.id))}
                      onCheckedChange={(checked) => {
                        sortedProjects.forEach(p => {
                          const isSelected = selectedProjectIds.includes(p.id);
                          if (checked && !isSelected) onToggleProject(p.id);
                          if (!checked && isSelected) onToggleProject(p.id);
                        });
                      }}
                    />
                  </th>
                  <SortableHeader field="name" label="Проект" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  <SortableHeader field="type" label="Тип" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  <SortableHeader field="status" label="Статус" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  <SortableHeader field="startYear" label="Год запуска" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} align="right" />
                  <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Этапность</th>
                  <SortableHeader field="length" label="Протяжённость" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} align="right" />
                  <SortableHeader field="investment" label="Инвестиции" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} align="right" />
                  <SortableHeader field="gdpEffect" label="Вклад в ВВП" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} align="right" />
                  <SortableHeader field="passengerFlow" label="Пассажиропоток" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} align="right" />
                  <SortableHeader field="population" label="Охват населения" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} align="right" />
                  <SortableHeader field="rollingStock" label="Потребный парк" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} align="right" />
                  <SortableHeader field="lastUpdated" label="Обновлено" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Сценарии</th>
                  <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Источник</th>
                </tr>
              </thead>
              <tbody>
                {sortedProjects.map((project) => (
                  <tr
                    key={project.id}
                    onClick={() => setSelectedRow(selectedRow?.id === project.id ? null : project)}
                    className={cn(
                      'border-b border-border last:border-0 cursor-pointer transition-colors',
                      selectedRow?.id === project.id ? 'bg-secondary/70' : 'hover:bg-secondary/40',
                      project.status === 'archived' && 'opacity-60'
                    )}
                  >
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedProjectIds.includes(project.id)}
                        onCheckedChange={() => onToggleProject(project.id)}
                      />
                    </td>
                    <td className="p-3">
                      <span className="text-sm font-medium text-foreground">{project.name}</span>
                      {project.hasMissingData && (
                        <span className="ml-2 text-xs text-amber-600">неполные данные</span>
                      )}
                    </td>
                    <td className="p-3"><RouteBadge type={project.type} /></td>
                    <td className="p-3"><StatusBadge status={project.status} /></td>
                    <td className="p-3 text-right text-sm text-foreground">{project.startYear}</td>
                    <td className="p-3 text-sm text-foreground">
                      {project.isStaged ? `${project.stages?.length || 0} этапа` : '—'}
                    </td>
                    <td className="p-3 text-right text-sm text-foreground">{project.length.toLocaleString('ru-RU')} км</td>
                    <td className="p-3 text-right text-sm text-foreground">{project.investment.toLocaleString('ru-RU')} млрд ₽</td>
                    <td className="p-3 text-right text-sm text-foreground">{project.gdpEffect.toLocaleString('ru-RU')} млрд ₽</td>
                    <td className="p-3 text-right text-sm text-foreground">{project.passengerFlow} млн/год</td>
                    <td className="p-3 text-right text-sm text-foreground">{project.population} млн чел</td>
                    <td className="p-3 text-right text-sm text-foreground">{project.rollingStock}</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {project.lastUpdated ? new Date(project.lastUpdated).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' }) : '—'}
                    </td>
                    <td className="p-3 text-sm text-muted-foreground max-w-[150px] truncate">
                      {project.scenarios?.join(', ') || '—'}
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">{project.dataSource}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sortedProjects.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center py-16">
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                <Search className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">Проекты не найдены</h3>
              <p className="text-sm text-muted-foreground">Попробуйте изменить параметры поиска или фильтры</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Panel */}
      {selectedRow && (
        <ProjectSummaryPanel
          project={selectedRow}
          onClose={() => setSelectedRow(null)}
          onOpenCard={() => onOpenCard(selectedRow)}
          onAddToCompare={() => onToggleProject(selectedRow.id)}
          onShowOnMap={() => onShowOnMap(selectedRow)}
          onExport={() => onExport(selectedRow)}
          isInCompare={selectedProjectIds.includes(selectedRow.id)}
        />
      )}
    </div>
  );
}

// Sortable header component
function SortableHeader({
  field,
  label,
  sortField,
  sortDirection,
  onSort,
  align = 'left',
}: {
  field: SortField;
  label: string;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  align?: 'left' | 'right';
}) {
  const isActive = sortField === field;
  return (
    <th
      className={cn(
        'p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors',
        align === 'right' ? 'text-right' : 'text-left'
      )}
      onClick={() => onSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {isActive && (
          <ArrowUpDown className={cn('h-3 w-3', sortDirection === 'desc' && 'rotate-180')} />
        )}
      </span>
    </th>
  );
}
