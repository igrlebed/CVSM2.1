'use client';

import { useState } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Lock,
  CheckCircle,
  AlertTriangle,
  Clock,
  Archive,
  FileEdit,
  GitCompare,
  Trash2,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Scenario, ScenarioStatus, getScenarioStatusLabel } from '@/lib/data';

interface ScenarioListProps {
  scenarios: Scenario[];
  selectedId?: string;
  onSelect: (scenario: Scenario) => void;
  onAddToCompare?: (scenario: Scenario) => void;
  onDelete?: (scenario: Scenario) => void;
  onArchive?: (scenario: Scenario) => void;
  onCreateNew?: () => void;
  compareIds?: string[];
}

function getStatusIcon(status: ScenarioStatus) {
  switch (status) {
    case 'published':
      return <CheckCircle className="h-3.5 w-3.5 text-implementation-green" />;
    case 'ready-for-review':
      return <Clock className="h-3.5 w-3.5 text-sm-blue" />;
    case 'validation-error':
      return <AlertTriangle className="h-3.5 w-3.5 text-destructive" />;
    case 'draft':
      return <FileEdit className="h-3.5 w-3.5 text-amber-500" />;
    case 'archived':
      return <Archive className="h-3.5 w-3.5 text-muted-foreground" />;
  }
}

function getStatusColor(status: ScenarioStatus) {
  switch (status) {
    case 'published':
      return 'bg-implementation-green/10 text-implementation-green';
    case 'ready-for-review':
      return 'bg-sm-blue/10 text-sm-blue';
    case 'validation-error':
      return 'bg-destructive/10 text-destructive';
    case 'draft':
      return 'bg-amber-100 text-amber-700';
    case 'archived':
      return 'bg-muted text-muted-foreground';
  }
}

export function ScenarioList({
  scenarios,
  selectedId,
  onSelect,
  onAddToCompare,
  onDelete,
  onArchive,
  onCreateNew,
  compareIds = [],
}: ScenarioListProps) {
  const [search, setSearch] = useState('');

  const filteredScenarios = scenarios.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.description?.toLowerCase().includes(search.toLowerCase())
  );

  // Separate base scenario from others
  const baseScenario = filteredScenarios.find(s => s.isBase);
  const otherScenarios = filteredScenarios.filter(s => !s.isBase);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Сценарии</h2>
          <Button size="sm" onClick={onCreateNew} className="h-8 gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Новый
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск сценариев..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-9"
          />
        </div>
      </div>

      {/* Scenario list */}
      <div className="flex-1 overflow-y-auto p-2">
        {/* Base scenario - always first */}
        {baseScenario && (
          <div className="mb-2">
            <div className="mb-1 px-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Базовый
            </div>
            <ScenarioCard
              scenario={baseScenario}
              isSelected={selectedId === baseScenario.id}
              isInCompare={compareIds.includes(baseScenario.id)}
              onClick={() => onSelect(baseScenario)}
              onAddToCompare={onAddToCompare ? () => onAddToCompare(baseScenario) : undefined}
            />
          </div>
        )}

        {/* Other scenarios */}
        {otherScenarios.length > 0 && (
          <div>
            <div className="mb-1 px-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Альтернативы
            </div>
            <div className="space-y-1">
              {otherScenarios.map((scenario) => (
                <ScenarioCard
                  key={scenario.id}
                  scenario={scenario}
                  isSelected={selectedId === scenario.id}
                  isInCompare={compareIds.includes(scenario.id)}
                  onClick={() => onSelect(scenario)}
                  onAddToCompare={onAddToCompare ? () => onAddToCompare(scenario) : undefined}
                  onDelete={onDelete && !scenario.isBase ? () => onDelete(scenario) : undefined}
                  onArchive={onArchive && !scenario.isBase && scenario.status !== 'archived' ? () => onArchive(scenario) : undefined}
                />
              ))}
            </div>
          </div>
        )}

        {filteredScenarios.length === 0 && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Сценарии не найдены
          </div>
        )}
      </div>
    </div>
  );
}

interface ScenarioCardProps {
  scenario: Scenario;
  isSelected: boolean;
  isInCompare: boolean;
  onClick: () => void;
  onAddToCompare?: () => void;
  onDelete?: () => void;
  onArchive?: () => void;
}

function ScenarioCard({ 
  scenario, 
  isSelected, 
  isInCompare,
  onClick,
  onAddToCompare,
  onDelete,
  onArchive,
}: ScenarioCardProps) {
  return (
    <div
      className={cn(
        'group relative rounded-lg border p-3 transition-all cursor-pointer flex flex-col gap-2',
        isSelected 
          ? 'border-primary bg-primary/5 shadow-sm' 
          : 'border-border/40 bg-card hover:border-border hover:bg-secondary/50',
        isInCompare && 'border-sm-blue/50 ring-1 ring-sm-blue/20',
        scenario.status === 'archived' && 'opacity-60'
      )}
      onClick={onClick}
    >
      {/* Compare Control - Visible direct action */}
      <div className="absolute right-2 top-2 z-10 flex items-center gap-1">
        {onAddToCompare && (
          <Button
            variant={isInCompare ? "default" : "outline"}
            size="sm"
            className={cn(
              "h-7 px-2 text-[10px] font-medium transition-all gap-1 rounded-md border-border/50 shadow-none",
              isInCompare 
                ? "bg-sm-blue hover:bg-sm-blue/90 text-white border-transparent" 
                : "bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCompare();
            }}
            aria-label={isInCompare ? "Убрать из сравнения" : "Добавить к сравнению"}
          >
            {isInCompare ? (
              <>
                <Check className="h-3 w-3" />
                <span>В сравнении</span>
              </>
            ) : (
              <>
                <GitCompare className="h-3 w-3" />
                <span>Сравнить</span>
              </>
            )}
          </Button>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity rounded-md"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onAddToCompare && (
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onAddToCompare(); }}>
                <GitCompare className="mr-2 h-4 w-4" />
                {isInCompare ? 'Убрать из сравнения' : 'Добавить к сравнению'}
              </DropdownMenuItem>
            )}
            {onArchive && (
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onArchive(); }}>
                <Archive className="mr-2 h-4 w-4" />
                В архив
              </DropdownMenuItem>
            )}
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={(e) => { e.stopPropagation(); onDelete(); }}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Удалить
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Header row: Title */}
      <div className="pr-16 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-semibold text-foreground">
            {scenario.name}
          </span>
          {scenario.isBase && (
            <Lock className="h-3 w-3 shrink-0 text-muted-foreground" />
          )}
          {scenario.hasUnsavedChanges && (
            <span className="h-2 w-2 shrink-0 rounded-full bg-amber-500" title="Несохранённые изменения" />
          )}
        </div>
      </div>

      {/* Description row */}
      {scenario.description && (
        <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
          {scenario.description}
        </p>
      )}

      {/* Status & Metadata row */}
      <div className="mt-auto flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
          <span className={cn(
            'inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium leading-none whitespace-nowrap', 
            getStatusColor(scenario.status)
          )}>
            {getStatusIcon(scenario.status)}
            {getScenarioStatusLabel(scenario.status)}
          </span>
          
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-border" />
              {scenario.projectIds.length} проектов
            </span>
            <span className="flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-border" />
              {scenario.networkLength.toLocaleString('ru-RU')} км
            </span>
          </div>
        </div>

        {/* Footer: Date & Author */}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground/70 border-t border-border/40 pt-1.5">
          <span>{new Date(scenario.lastModified).toLocaleDateString('ru-RU')}</span>
          <span className="truncate max-w-[100px]">{scenario.author}</span>
        </div>
      </div>
    </div>
  );
}
