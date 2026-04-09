'use client';

import { useState } from 'react';
import { usePermission } from '@/hooks/use-permission';
import { 
  Save, 
  Copy, 
  Send, 
  Globe, 
  Download, 
  Archive,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Lock,
  Plus,
  Minus,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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
import { cn } from '@/lib/utils';
import { Scenario, projects, getProjectTypeLabel, getProjectStatusLabel, getScenarioStatusLabel } from '@/lib/data';
import { 
  ValidationErrorState, 
  ReadOnlyBanner, 
  UnsavedChangesBanner,
  DraftEntityBadge
} from '@/components/ui/states';

interface ScenarioEditorProps {
  scenario: Scenario;
  onSave?: () => void;
  onSaveAsNew?: () => void;
  onSendForReview?: () => void;
  onPublish?: () => void;
  onExport?: () => void;
  onArchive?: () => void;
}

export function ScenarioEditor({
  scenario,
  onSave,
  onSaveAsNew,
  onSendForReview,
  onPublish,
  onExport,
  onArchive,
}: ScenarioEditorProps) {
  const { can } = usePermission();
  const [isKpiOpen, setIsKpiOpen] = useState(true);
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const [isParamsOpen, setIsParamsOpen] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [isValidationOpen, setIsValidationOpen] = useState(true);

  const scenarioProjects = projects.filter(p => scenario.projectIds.includes(p.id));
  const isReadOnly = scenario.isBase;
  const hasErrors = scenario.validationIssues && scenario.validationIssues.length > 0;

  return (
    <div className="flex h-full">
      {/* Main editing area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Read-only banner for base scenario */}
          {isReadOnly && (
            <ReadOnlyBanner 
              className="mb-4" 
              message="Базовый сценарий. Создайте копию для редактирования."
            />
          )}

          {/* Unsaved changes banner */}
          {scenario.hasUnsavedChanges && !isReadOnly && (
            <UnsavedChangesBanner 
              className="mb-4"
              onSave={onSave}
              onDiscard={() => {}}
            />
          )}

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Input
                    value={scenario.name}
                    disabled={isReadOnly}
                    className={cn(
                      'text-xl font-semibold h-auto py-1 px-2 -ml-2',
                      isReadOnly && 'border-transparent bg-transparent'
                    )}
                  />
                  {isReadOnly && <Lock className="h-4 w-4 text-muted-foreground" />}
                  {scenario.status === 'draft' && <DraftEntityBadge />}
                </div>
                <p className="text-sm text-muted-foreground">
                  {scenario.description}
                </p>
              </div>
              <StatusBadge status={scenario.status} />
            </div>
          </div>

          {/* Validation errors */}
          {hasErrors && (
            <Collapsible open={isValidationOpen} onOpenChange={setIsValidationOpen} className="mb-6">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between h-auto py-3 px-4 bg-destructive/5 hover:bg-destructive/10 rounded-xl">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="font-medium text-foreground">Ошибки валидации ({scenario.validationIssues?.length})</span>
                  </div>
                  <ChevronDown className={cn('h-4 w-4 transition-transform', isValidationOpen && 'rotate-180')} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ValidationErrorState 
                  className="mt-2"
                  errors={scenario.validationIssues}
                  action={{ label: 'Исправить', onClick: () => {} }}
                />
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* KPI Block */}
          <Collapsible open={isKpiOpen} onOpenChange={setIsKpiOpen} className="mb-4">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between h-auto py-3 px-4 bg-card border rounded-xl hover:bg-secondary/50">
                <span className="font-medium text-foreground">Ключевые показатели</span>
                <ChevronDown className={cn('h-4 w-4 transition-transform', isKpiOpen && 'rotate-180')} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 grid grid-cols-3 gap-3 p-4 bg-card border rounded-xl">
                <KpiItem label="Протяжённость сети" value={scenario.networkLength} unit="км" />
                <KpiItem label="Инвестиции" value={scenario.totalInvestment} unit="млрд ₽" />
                <KpiItem label="Эффект на ВВП" value={scenario.gdpEffect} unit="млрд ₽" />
                <KpiItem label="Пассажиропоток" value={scenario.passengerFlow} unit="млн чел/год" />
                <KpiItem label="Охват населения" value={scenario.population} unit="млн чел" />
                <KpiItem label="Потребный парк" value={scenario.rollingStock} unit="составов" />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Projects in scenario */}
          <Collapsible open={isProjectsOpen} onOpenChange={setIsProjectsOpen} className="mb-4">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between h-auto py-3 px-4 bg-card border rounded-xl hover:bg-secondary/50">
                <span className="font-medium text-foreground">Проекты в сценарии ({scenarioProjects.length})</span>
                <ChevronDown className={cn('h-4 w-4 transition-transform', isProjectsOpen && 'rotate-180')} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 bg-card border rounded-xl overflow-hidden">
                <div className="max-h-[400px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/50 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-muted-foreground">Включён</th>
                        <th className="px-4 py-2 text-left font-medium text-muted-foreground">Проект</th>
                        <th className="px-4 py-2 text-left font-medium text-muted-foreground">Тип</th>
                        <th className="px-4 py-2 text-left font-medium text-muted-foreground">Статус</th>
                        <th className="px-4 py-2 text-right font-medium text-muted-foreground">Протяж.</th>
                        <th className="px-4 py-2 text-right font-medium text-muted-foreground">Инвест.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.filter(p => p.status !== 'archived').map((project) => {
                        const isIncluded = scenario.projectIds.includes(project.id);
                        return (
                          <tr key={project.id} className={cn('border-t border-border', !isIncluded && 'opacity-50')}>
                            <td className="px-4 py-3">
                              <Switch checked={isIncluded} disabled={isReadOnly} />
                            </td>
                            <td className="px-4 py-3 font-medium text-foreground">
                              {project.name}
                              {project.isStaged && (
                                <span className="ml-2 text-[10px] text-muted-foreground">этапный</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">{getProjectTypeLabel(project.type)}</td>
                            <td className="px-4 py-3 text-muted-foreground">{getProjectStatusLabel(project.status)}</td>
                            <td className="px-4 py-3 text-right tabular-nums">{project.length.toLocaleString('ru-RU')} км</td>
                            <td className="px-4 py-3 text-right tabular-nums">{project.investment.toLocaleString('ru-RU')} млрд</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {!isReadOnly && (
                  <div className="border-t border-border p-3 bg-secondary/30">
                    <Button variant="ghost" size="sm" className="gap-1.5">
                      <Plus className="h-3.5 w-3.5" />
                      Добавить новый маршрут
                    </Button>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Model parameters */}
          <Collapsible open={isParamsOpen} onOpenChange={setIsParamsOpen} className="mb-4">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between h-auto py-3 px-4 bg-card border rounded-xl hover:bg-secondary/50">
                <span className="font-medium text-foreground">Параметры модели</span>
                <ChevronDown className={cn('h-4 w-4 transition-transform', isParamsOpen && 'rotate-180')} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 p-4 bg-card border rounded-xl space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Горизонт планирования</label>
                    <Select defaultValue="2050" disabled={isReadOnly}>
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2035">2035</SelectItem>
                        <SelectItem value="2040">2040</SelectItem>
                        <SelectItem value="2045">2045</SelectItem>
                        <SelectItem value="2050">2050</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Ставка дисконтирования</label>
                    <Input defaultValue="6%" disabled={isReadOnly} className="h-9" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Сценарий макроэкономики</label>
                    <Select defaultValue="base" disabled={isReadOnly}>
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="base">Базовый</SelectItem>
                        <SelectItem value="optimistic">Оптимистичный</SelectItem>
                        <SelectItem value="conservative">Консервативный</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Прогноз пассажиропотока</label>
                    <Select defaultValue="moderate" disabled={isReadOnly}>
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Низкий</SelectItem>
                        <SelectItem value="moderate">Умеренный</SelectItem>
                        <SelectItem value="high">Высокий</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Implementation timeline placeholder */}
          <Collapsible open={isTimelineOpen} onOpenChange={setIsTimelineOpen} className="mb-4">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between h-auto py-3 px-4 bg-card border rounded-xl hover:bg-secondary/50">
                <span className="font-medium text-foreground">График реализации</span>
                <ChevronDown className={cn('h-4 w-4 transition-transform', isTimelineOpen && 'rotate-180')} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 p-8 bg-card border rounded-xl">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                    <Info className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Диаграмма Ганта с этапами реализации проектов</p>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      {/* Actions panel */}
      <div className="w-64 border-l border-border bg-secondary/30 p-4">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Действия</h3>
        
        <div className="space-y-2">
          {can('edit:scenario') && (
            <>
              <Button 
                className="w-full justify-start gap-2" 
                disabled={isReadOnly}
                onClick={onSave}
              >
                <Save className="h-4 w-4" />
                Сохранить
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={onSaveAsNew}
              >
                <Copy className="h-4 w-4" />
                Сохранить как новый
              </Button>

              <div className="h-px bg-border my-3" />

              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                disabled={isReadOnly || hasErrors}
                onClick={onSendForReview}
              >
                <Send className="h-4 w-4" />
                На рассмотрение
              </Button>
            </>
          )}

          {can('approve:scenario') && (
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              disabled={isReadOnly || scenario.status !== 'ready-for-review'}
              onClick={onPublish}
            >
              <Globe className="h-4 w-4" />
              Опубликовать
            </Button>
          )}

          <div className="h-px bg-border my-3" />

          <Button 
            variant="outline" 
            className="w-full justify-start gap-2"
            onClick={onExport}
          >
            <Download className="h-4 w-4" />
            Экспортировать
          </Button>

          {can('edit:scenario') && (
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-2 text-muted-foreground"
              disabled={isReadOnly}
              onClick={onArchive}
            >
              <Archive className="h-4 w-4" />
              В архив
            </Button>
          )}
        </div>

        {/* Metadata */}
        <div className="mt-8 space-y-3 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Версия</span>
            <span className="font-medium text-foreground">v{scenario.version}</span>
          </div>
          <div className="flex justify-between">
            <span>Автор</span>
            <span className="font-medium text-foreground">{scenario.author}</span>
          </div>
          <div className="flex justify-between">
            <span>Создан</span>
            <span>{new Date(scenario.createdAt).toLocaleDateString('ru-RU')}</span>
          </div>
          <div className="flex justify-between">
            <span>Изменён</span>
            <span>{new Date(scenario.lastModified).toLocaleDateString('ru-RU')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiItem({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="text-center p-3 rounded-lg bg-secondary/50">
      <div className="text-lg font-semibold text-foreground tabular-nums">
        {value.toLocaleString('ru-RU')}
      </div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{unit}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: Scenario['status'] }) {
  const config = {
    'published': { icon: CheckCircle, color: 'bg-implementation-green/10 text-implementation-green border-implementation-green/20' },
    'ready-for-review': { icon: Clock, color: 'bg-sm-blue/10 text-sm-blue border-sm-blue/20' },
    'validation-error': { icon: AlertTriangle, color: 'bg-destructive/10 text-destructive border-destructive/20' },
    'draft': { icon: Clock, color: 'bg-amber-100 text-amber-700 border-amber-200' },
    'archived': { icon: Archive, color: 'bg-muted text-muted-foreground border-border' },
  };

  const { icon: Icon, color } = config[status];

  return (
    <div className={cn('inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium', color)}>
      <Icon className="h-3.5 w-3.5" />
      {getScenarioStatusLabel(status)}
    </div>
  );
}
