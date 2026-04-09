'use client';

import { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  FileDown, 
  FileSpreadsheet, 
  FileText, 
  Presentation,
  Map,
  BarChart3,
  GitCompare,
  FileCheck,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Clock,
  Download,
  RefreshCw,
  Eye,
  ChevronDown
} from 'lucide-react';
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
import { 
  recentExports, 
  ExportJob, 
  ExportEntityType, 
  ExportFormat,
  getExportEntityTypeLabel,
  getExportStatusLabel,
  projects,
  scenarios
} from '@/lib/data';
import { 
  ExportInProgressState, 
  ExportReadyState,
  EmptyListState 
} from '@/components/ui/states';

const entityTypes: { id: ExportEntityType; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'project', label: 'Проект', icon: FileCheck, description: 'Карточка отдельного проекта' },
  { id: 'project-comparison', label: 'Сравнение проектов', icon: GitCompare, description: 'Сравнительная таблица проектов' },
  { id: 'scenario', label: 'Сценарий', icon: FileText, description: 'Полное описание сценария' },
  { id: 'scenario-comparison', label: 'Сравнение сценариев', icon: GitCompare, description: 'Сравнение альтернативных сценариев' },
  { id: 'executive-summary', label: 'Executive Summary', icon: Presentation, description: 'Краткая презентация для руководства' },
  { id: 'map', label: 'Карта', icon: Map, description: 'Схематическая карта сети' },
  { id: 'ranking', label: 'Ранжирование', icon: BarChart3, description: 'Результаты ранжирования проектов' },
];

const formats: { id: ExportFormat; label: string; icon: React.ElementType }[] = [
  { id: 'xlsx', label: 'Excel (.xlsx)', icon: FileSpreadsheet },
  { id: 'docx', label: 'Word (.docx)', icon: FileText },
  { id: 'pdf', label: 'PDF (.pdf)', icon: FileText },
  { id: 'pptx', label: 'PowerPoint (.pptx)', icon: Presentation },
];

const sectionGroups = [
  {
    id: 'overview',
    label: 'Обзор',
    sections: [
      { id: 'summary', label: 'Сводка и KPI', default: true },
      { id: 'description', label: 'Описание', default: true },
      { id: 'metadata', label: 'Метаданные', default: false },
    ],
  },
  {
    id: 'data',
    label: 'Данные',
    sections: [
      { id: 'projects-table', label: 'Таблица проектов', default: true },
      { id: 'investments', label: 'Инвестиции', default: true },
      { id: 'passengers', label: 'Пассажиропоток', default: false },
      { id: 'timeline', label: 'График реализации', default: false },
    ],
  },
  {
    id: 'visuals',
    label: 'Визуализации',
    sections: [
      { id: 'map-image', label: 'Карта сети', default: true },
      { id: 'charts', label: 'Диаграммы', default: true },
      { id: 'gantt', label: 'Диаграмма Ганта', default: false },
    ],
  },
];

function getStatusIcon(status: ExportJob['status']) {
  switch (status) {
    case 'ready': return <CheckCircle className="h-4 w-4 text-implementation-green" />;
    case 'in-progress': return <Loader2 className="h-4 w-4 text-sm-blue animate-spin" />;
    case 'queued': return <Clock className="h-4 w-4 text-muted-foreground" />;
    case 'failed': return <AlertTriangle className="h-4 w-4 text-destructive" />;
  }
}

export default function ExportPage() {
  const [selectedEntityType, setSelectedEntityType] = useState<ExportEntityType>('scenario');
  const [selectedEntity, setSelectedEntity] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [selectedSections, setSelectedSections] = useState<string[]>(
    sectionGroups.flatMap(g => g.sections.filter(s => s.default).map(s => s.id))
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);

  const toggleSection = (sectionId: string) => {
    setSelectedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerationComplete(false);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerationComplete(true);
    }, 2000);
  };

  // Get entities based on selected type
  const getEntityOptions = () => {
    switch (selectedEntityType) {
      case 'project':
      case 'project-comparison':
        return projects.filter(p => p.status !== 'archived').map(p => ({ id: p.id, name: p.name }));
      case 'scenario':
      case 'scenario-comparison':
        return scenarios.map(s => ({ id: s.id, name: s.name }));
      default:
        return [];
    }
  };

  const needsEntitySelection = ['project', 'project-comparison', 'scenario', 'scenario-comparison'].includes(selectedEntityType);
  const entityOptions = getEntityOptions();

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-border">
            <h1 className="text-2xl font-semibold text-foreground">Экспорт / Отчёты</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Формирование отчётов и экспорт данных в различных форматах
            </p>
          </div>

          {/* Configuration */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-12 gap-6">
              {/* Left: Entity type selection */}
              <div className="col-span-4">
                <div className="rounded-xl bg-card border border-border p-5">
                  <h2 className="text-sm font-semibold text-foreground mb-4">Что экспортировать</h2>
                  <div className="space-y-2">
                    {entityTypes.map((type) => {
                      const Icon = type.icon;
                      const isSelected = selectedEntityType === type.id;

                      return (
                        <button
                          key={type.id}
                          onClick={() => {
                            setSelectedEntityType(type.id);
                            setSelectedEntity('');
                          }}
                          className={cn(
                            'w-full flex items-start gap-3 p-3 rounded-lg transition-colors text-left',
                            isSelected
                              ? 'bg-primary/10 border border-primary/20'
                              : 'bg-secondary/50 hover:bg-secondary border border-transparent'
                          )}
                        >
                          <div className={cn(
                            'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
                            isSelected ? 'bg-primary/20' : 'bg-card'
                          )}>
                            <Icon className={cn(
                              'h-4 w-4',
                              isSelected ? 'text-primary' : 'text-muted-foreground'
                            )} />
                          </div>
                          <div>
                            <span className={cn(
                              'text-sm font-medium block',
                              isSelected ? 'text-primary' : 'text-foreground'
                            )}>
                              {type.label}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {type.description}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Entity selector */}
                  {needsEntitySelection && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <label className="text-xs font-medium text-muted-foreground mb-2 block">
                        Выберите {selectedEntityType.includes('project') ? 'проект' : 'сценарий'}
                      </label>
                      <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите..." />
                        </SelectTrigger>
                        <SelectContent>
                          {entityOptions.map((opt) => (
                            <SelectItem key={opt.id} value={opt.id}>{opt.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>

              {/* Center: Format and sections */}
              <div className="col-span-4">
                {/* Format */}
                <div className="rounded-xl bg-card border border-border p-5 mb-4">
                  <h2 className="text-sm font-semibold text-foreground mb-4">Формат</h2>
                  <div className="grid grid-cols-2 gap-2">
                    {formats.map((format) => {
                      const Icon = format.icon;
                      const isSelected = selectedFormat === format.id;

                      return (
                        <button
                          key={format.id}
                          onClick={() => setSelectedFormat(format.id)}
                          className={cn(
                            'flex items-center gap-2 p-3 rounded-lg transition-colors text-left',
                            isSelected
                              ? 'bg-primary/10 border border-primary/20'
                              : 'bg-secondary/50 hover:bg-secondary border border-transparent'
                          )}
                        >
                          <Icon className={cn(
                            'h-4 w-4',
                            isSelected ? 'text-primary' : 'text-muted-foreground'
                          )} />
                          <span className={cn(
                            'text-sm',
                            isSelected ? 'font-medium text-primary' : 'text-foreground'
                          )}>
                            {format.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sections */}
                <div className="rounded-xl bg-card border border-border p-5">
                  <h2 className="text-sm font-semibold text-foreground mb-4">Разделы</h2>
                  <div className="space-y-3">
                    {sectionGroups.map((group) => (
                      <Collapsible key={group.id} defaultOpen>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" className="w-full justify-between h-auto py-2 px-2 -mx-2">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              {group.label}
                            </span>
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="space-y-2 mt-2">
                            {group.sections.map((section) => (
                              <label
                                key={section.id}
                                className="flex items-center gap-3 cursor-pointer py-1"
                              >
                                <Checkbox
                                  checked={selectedSections.includes(section.id)}
                                  onCheckedChange={() => toggleSection(section.id)}
                                />
                                <span className="text-sm text-foreground">{section.label}</span>
                              </label>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-border flex gap-3">
                    <button 
                      className="text-xs text-primary hover:underline"
                      onClick={() => setSelectedSections(sectionGroups.flatMap(g => g.sections.map(s => s.id)))}
                    >
                      Выбрать все
                    </button>
                    <button 
                      className="text-xs text-primary hover:underline"
                      onClick={() => setSelectedSections([])}
                    >
                      Снять выбор
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Preview and action */}
              <div className="col-span-4">
                <div className="rounded-xl bg-card border border-border p-5 sticky top-0">
                  <h2 className="text-sm font-semibold text-foreground mb-4">Предпросмотр</h2>

                  {/* Generation state */}
                  {isGenerating ? (
                    <ExportInProgressState 
                      progress={65} 
                      entityName={getExportEntityTypeLabel(selectedEntityType)}
                    />
                  ) : generationComplete ? (
                    <ExportReadyState
                      entityName={`${getExportEntityTypeLabel(selectedEntityType)}.${selectedFormat}`}
                      size="2.4 МБ"
                      onDownload={() => setGenerationComplete(false)}
                      onClose={() => setGenerationComplete(false)}
                    />
                  ) : (
                    <>
                      {/* Preview placeholder */}
                      <div className="aspect-[3/4] rounded-lg bg-secondary/50 flex items-center justify-center mb-4 border border-border">
                        <div className="text-center p-4">
                          <FileDown className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                          <p className="text-sm font-medium text-foreground mb-1">
                            {getExportEntityTypeLabel(selectedEntityType)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {selectedSections.length} разделов · {formats.find(f => f.id === selectedFormat)?.label}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2">
                        <Button 
                          className="w-full gap-2" 
                          onClick={handleGenerate}
                          disabled={needsEntitySelection && !selectedEntity}
                        >
                          <FileDown className="h-4 w-4" />
                          Сформировать отчёт
                        </Button>
                        <Button variant="outline" className="w-full gap-2">
                          <Eye className="h-4 w-4" />
                          Предпросмотр
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Recent exports */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">Недавние экспорты</h2>
              {recentExports.length === 0 ? (
                <EmptyListState
                  title="Нет экспортов"
                  description="Сформируйте первый отчёт"
                />
              ) : (
                <div className="rounded-xl bg-card border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Статус</th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Название</th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Тип</th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Формат</th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Дата</th>
                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentExports.map((exp) => (
                        <tr key={exp.id} className="border-t border-border">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(exp.status)}
                              <span className={cn(
                                'text-xs',
                                exp.status === 'ready' && 'text-implementation-green',
                                exp.status === 'failed' && 'text-destructive',
                                (exp.status === 'queued' || exp.status === 'in-progress') && 'text-muted-foreground'
                              )}>
                                {getExportStatusLabel(exp.status)}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium text-foreground">{exp.entityName}</td>
                          <td className="px-4 py-3 text-muted-foreground">{getExportEntityTypeLabel(exp.entityType)}</td>
                          <td className="px-4 py-3 text-muted-foreground uppercase">{exp.format}</td>
                          <td className="px-4 py-3 text-muted-foreground">{exp.createdAt}</td>
                          <td className="px-4 py-3 text-right">
                            {exp.status === 'ready' && (
                              <Button variant="ghost" size="sm" className="h-8 gap-1.5">
                                <Download className="h-3.5 w-3.5" />
                                Скачать
                              </Button>
                            )}
                            {exp.status === 'failed' && (
                              <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-destructive">
                                <RefreshCw className="h-3.5 w-3.5" />
                                Повторить
                              </Button>
                            )}
                            {exp.status === 'in-progress' && exp.progress && (
                              <span className="text-xs text-muted-foreground">{exp.progress}%</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
