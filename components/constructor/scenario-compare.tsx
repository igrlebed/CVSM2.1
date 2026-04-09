'use client';

import { useState } from 'react';
import { 
  X, 
  Plus, 
  Download, 
  Map, 
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Minus,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Scenario, scenarios as allScenarios, getScenarioStatusLabel } from '@/lib/data';
import { CompareEmptyState } from '@/components/ui/states';

interface ScenarioCompareProps {
  selectedIds: string[];
  onRemove: (id: string) => void;
  onAdd: (id: string) => void;
  onExport?: () => void;
  onShowOnMap?: () => void;
}

const comparisonGroups = [
  {
    id: 'kpi',
    label: 'Ключевые показатели',
    metrics: [
      { id: 'networkLength', label: 'Протяжённость сети', unit: 'км', higherIsBetter: true },
      { id: 'totalInvestment', label: 'Общие инвестиции', unit: 'млрд ₽', higherIsBetter: false },
      { id: 'gdpEffect', label: 'Эффект на ВВП', unit: 'млрд ₽', higherIsBetter: true },
      { id: 'passengerFlow', label: 'Пассажиропоток', unit: 'млн чел/год', higherIsBetter: true },
      { id: 'population', label: 'Охват населения', unit: 'млн чел', higherIsBetter: true },
      { id: 'rollingStock', label: 'Потребный парк', unit: 'составов', higherIsBetter: false },
    ],
  },
  {
    id: 'efficiency',
    label: 'Показатели эффективности',
    metrics: [
      { id: 'gdpPerKm', label: 'ВВП на км сети', unit: 'млрд ₽/км', higherIsBetter: true, computed: true },
      { id: 'investPerPassenger', label: 'Инвестиции на пассажира', unit: 'тыс ₽/чел', higherIsBetter: false, computed: true },
      { id: 'passengersPerKm', label: 'Пассажиропоток на км', unit: 'тыс чел/км', higherIsBetter: true, computed: true },
    ],
  },
  {
    id: 'projects',
    label: 'Состав проектов',
    metrics: [
      { id: 'projectCount', label: 'Количество проектов', unit: 'шт', higherIsBetter: null },
      { id: 'vsmCount', label: 'Проектов ВСМ', unit: 'шт', higherIsBetter: null },
      { id: 'internationalCount', label: 'Международных', unit: 'шт', higherIsBetter: null },
    ],
  },
  {
    id: 'timeline',
    label: 'Сроки реализации',
    metrics: [
      { id: 'firstCompletion', label: 'Первый ввод', unit: 'год', higherIsBetter: false },
      { id: 'lastCompletion', label: 'Полное завершение', unit: 'год', higherIsBetter: false },
      { id: 'avgDuration', label: 'Средний срок проекта', unit: 'лет', higherIsBetter: false },
    ],
  },
];

export function ScenarioCompare({
  selectedIds,
  onRemove,
  onAdd,
  onExport,
  onShowOnMap,
}: ScenarioCompareProps) {
  const [openGroups, setOpenGroups] = useState<string[]>(['kpi', 'efficiency']);
  const [comment, setComment] = useState('');

  const selectedScenarios = selectedIds
    .map(id => allScenarios.find(s => s.id === id))
    .filter((s): s is Scenario => s !== undefined);

  const availableToAdd = allScenarios.filter(s => !selectedIds.includes(s.id) && s.status !== 'archived');
  const baseScenario = selectedScenarios.find(s => s.isBase);

  const toggleGroup = (groupId: string) => {
    setOpenGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  if (selectedScenarios.length < 2) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8">
        <CompareEmptyState
          title="Сравнение сценариев"
          description="Выберите минимум 2 сценария для сравнения. Рекомендуется включить базовый сценарий."
          action={{
            label: 'Выбрать сценарии',
            onClick: () => {},
          }}
        />
      </div>
    );
  }

  // Compute derived metrics
  const getMetricValue = (scenario: Scenario, metricId: string): number => {
    switch (metricId) {
      case 'gdpPerKm':
        return Math.round((scenario.gdpEffect / scenario.networkLength) * 100) / 100;
      case 'investPerPassenger':
        return Math.round((scenario.totalInvestment / scenario.passengerFlow) * 10) / 10;
      case 'passengersPerKm':
        return Math.round((scenario.passengerFlow / scenario.networkLength) * 1000 * 10) / 10;
      case 'projectCount':
        return scenario.projectIds.length;
      case 'vsmCount':
        return scenario.projectIds.filter(id => {
          const p = allScenarios.find(s => s.id === id);
          return p;
        }).length; // Simplified
      case 'internationalCount':
        return 0; // Simplified
      case 'firstCompletion':
        return 2028; // Placeholder
      case 'lastCompletion':
        return 2042; // Placeholder
      case 'avgDuration':
        return 5.2; // Placeholder
      default:
        // Safe fallback for metrics that map directly to numeric scenario fields.
        // (Some metrics are derived above; this keeps typing strict without unsafe casts.)
        return typeof (scenario as any)[metricId] === 'number' ? (scenario as any)[metricId] : 0;
    }
  };

  const getBestValue = (metricId: string, higherIsBetter: boolean | null): number | null => {
    if (higherIsBetter === null) return null;
    const values = selectedScenarios.map(s => getMetricValue(s, metricId));
    return higherIsBetter ? Math.max(...values) : Math.min(...values);
  };

  const getDiffFromBase = (scenario: Scenario, metricId: string): { value: number; percentage: number } | null => {
    if (!baseScenario || scenario.isBase) return null;
    const baseValue = getMetricValue(baseScenario, metricId);
    const currentValue = getMetricValue(scenario, metricId);
    if (baseValue === 0) return null;
    const diff = currentValue - baseValue;
    const percentage = (diff / baseValue) * 100;
    return { value: diff, percentage };
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Сравнение сценариев</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onShowOnMap}>
              <Map className="mr-2 h-4 w-4" />
              На карте
            </Button>
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="mr-2 h-4 w-4" />
              Экспорт
            </Button>
          </div>
        </div>

        {/* Scenario selector row */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {selectedScenarios.map((scenario) => (
            <div 
              key={scenario.id}
              className={cn(
                'flex-shrink-0 w-48 rounded-lg border p-3',
                scenario.isBase ? 'border-primary bg-primary/5' : 'border-border bg-card'
              )}
            >
              <div className="flex items-start justify-between mb-1">
                <span className="text-sm font-medium text-foreground truncate flex-1">
                  {scenario.name}
                </span>
                {!scenario.isBase && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5 -mr-1 -mt-1"
                    onClick={() => onRemove(scenario.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <div className="text-[10px] text-muted-foreground">
                {getScenarioStatusLabel(scenario.status)}
                {scenario.isBase && ' · Базовый'}
              </div>
            </div>
          ))}

          {/* Add scenario button */}
          {availableToAdd.length > 0 && selectedScenarios.length < 5 && (
            <Select onValueChange={onAdd}>
              <SelectTrigger className="w-48 flex-shrink-0 h-auto min-h-[72px] border-dashed">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Plus className="h-4 w-4" />
                  <span className="text-sm">Добавить</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                {availableToAdd.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Comparison table */}
      <div className="flex-1 overflow-y-auto p-4">
        {comparisonGroups.map((group) => (
          <Collapsible 
            key={group.id}
            open={openGroups.includes(group.id)}
            onOpenChange={() => toggleGroup(group.id)}
            className="mb-3"
          >
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-between h-auto py-2.5 px-3 bg-secondary/50 hover:bg-secondary rounded-lg"
              >
                <span className="text-sm font-medium text-foreground">{group.label}</span>
                <ChevronDown className={cn('h-4 w-4 transition-transform', openGroups.includes(group.id) && 'rotate-180')} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-1 rounded-lg border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground w-48">Показатель</th>
                      {selectedScenarios.map((s) => (
                        <th key={s.id} className="px-3 py-2 text-right font-medium text-muted-foreground">
                          {s.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {group.metrics.map((metric) => {
                      const bestValue = getBestValue(metric.id, metric.higherIsBetter);
                      
                      return (
                        <tr key={metric.id} className="border-t border-border">
                          <td className="px-3 py-2.5 text-muted-foreground">
                            {metric.label}
                            <span className="ml-1 text-[10px] text-muted-foreground/70">{metric.unit}</span>
                          </td>
                          {selectedScenarios.map((scenario) => {
                            const value = getMetricValue(scenario, metric.id);
                            const isBest = bestValue !== null && value === bestValue;
                            const diff = getDiffFromBase(scenario, metric.id);

                            return (
                              <td key={scenario.id} className="px-3 py-2.5 text-right">
                                <div className={cn(
                                  'tabular-nums font-medium',
                                  isBest && metric.higherIsBetter !== null && 'text-implementation-green'
                                )}>
                                  {typeof value === 'number' 
                                    ? value.toLocaleString('ru-RU', { maximumFractionDigits: 1 })
                                    : value
                                  }
                                </div>
                                {diff && (
                                  <div className={cn(
                                    'text-[10px] flex items-center justify-end gap-0.5',
                                    diff.value > 0 
                                      ? (metric.higherIsBetter ? 'text-implementation-green' : 'text-destructive')
                                      : (metric.higherIsBetter === false ? 'text-implementation-green' : 'text-destructive')
                                  )}>
                                    {diff.value > 0 ? (
                                      <TrendingUp className="h-3 w-3" />
                                    ) : diff.value < 0 ? (
                                      <TrendingDown className="h-3 w-3" />
                                    ) : (
                                      <Minus className="h-3 w-3" />
                                    )}
                                    {diff.percentage > 0 ? '+' : ''}{diff.percentage.toFixed(1)}%
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}

        {/* Charts placeholder */}
        <div className="mb-4 rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-medium text-foreground">Визуализация</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[4/3] rounded-lg bg-secondary/50 flex items-center justify-center text-sm text-muted-foreground">
              Диаграмма инвестиций
            </div>
            <div className="aspect-[4/3] rounded-lg bg-secondary/50 flex items-center justify-center text-sm text-muted-foreground">
              Диаграмма эффектов
            </div>
          </div>
        </div>

        {/* Comments / insights */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium text-foreground">Комментарии и выводы</h3>
          </div>
          <Textarea 
            placeholder="Добавьте комментарии к сравнению..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>
      </div>
    </div>
  );
}
