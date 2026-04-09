'use client';

import { useState } from 'react';
import { 
  Save, 
  Plus, 
  Upload, 
  PenTool, 
  Map,
  Calculator,
  AlertTriangle,
  CheckCircle,
  Info,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { DraftEntityBadge } from '@/components/ui/states';

type CreationMode = 'draw' | 'upload';

interface NewRouteEditorProps {
  onSave?: (data: unknown) => void;
  onSendForReview?: (data: unknown) => void;
  onAddToScenario?: (data: unknown) => void;
}

export function NewRouteEditor({
  onSave,
  onSendForReview,
  onAddToScenario,
}: NewRouteEditorProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<string>('vsm');
  const [status, setStatus] = useState<string>('in-development');
  const [source, setSource] = useState<string>('');
  const [creationMode, setCreationMode] = useState<CreationMode>('draw');
  const [comment, setComment] = useState('');
  const [startYear, setStartYear] = useState('2030');
  const [endYear, setEndYear] = useState('2035');

  // Calculated values (would be computed from geometry)
  const calculatedKpi = {
    length: 245,
    estimatedInvestment: 420,
    gdpEffect: 380,
    passengerFlow: 6.8,
    population: 8.2,
    rollingStock: 14,
  };

  const validationIssues = name.length === 0 ? ['Не указано название маршрута'] : [];
  const hasIssues = validationIssues.length > 0;

  return (
    <div className="flex h-full">
      {/* Left: Form */}
      <div className="w-80 border-r border-border overflow-y-auto">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-foreground">Новый маршрут</h2>
            <DraftEntityBadge />
          </div>
          <p className="text-xs text-muted-foreground">
            Создайте новый маршрут для включения в сценарий
          </p>
        </div>

        <div className="p-4 space-y-4">
          {/* Basic info */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Название маршрута <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="Москва – Город"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Тип</label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vsm">ВСМ</SelectItem>
                  <SelectItem value="sm">СМ</SelectItem>
                  <SelectItem value="international">Международный</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Статус</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Утверждён</SelectItem>
                  <SelectItem value="in-development">В разработке</SelectItem>
                  <SelectItem value="experimental">Экспериментальный</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Источник данных</label>
            <Input
              placeholder="ОАО «РЖД», Минтранс..."
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
          </div>

          {/* Creation mode */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Способ создания</label>
            <div className="flex gap-2">
              <Button
                variant={creationMode === 'draw' ? 'default' : 'outline'}
                size="sm"
                className="flex-1 gap-1.5"
                onClick={() => setCreationMode('draw')}
              >
                <PenTool className="h-3.5 w-3.5" />
                Нарисовать
              </Button>
              <Button
                variant={creationMode === 'upload' ? 'default' : 'outline'}
                size="sm"
                className="flex-1 gap-1.5"
                onClick={() => setCreationMode('upload')}
              >
                <Upload className="h-3.5 w-3.5" />
                Загрузить
              </Button>
            </div>
          </div>

          {/* Coordinates upload area (if upload mode) */}
          {creationMode === 'upload' && (
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
              <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                Перетащите файл с координатами (GeoJSON, KML)
              </p>
            </div>
          )}

          {/* Implementation horizon */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Горизонт реализации</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-muted-foreground mb-1 block">Начало</label>
                <Select value={startYear} onValueChange={setStartYear}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 15 }, (_, i) => 2028 + i).map((year) => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground mb-1 block">Завершение</label>
                <Select value={endYear} onValueChange={setEndYear}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 20 }, (_, i) => 2030 + i).map((year) => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Analyst comment */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Комментарий аналитика</label>
            <Textarea
              placeholder="Дополнительные заметки..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>
        </div>
      </div>

      {/* Center: Map / Drawing area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 bg-secondary/30 relative">
          {/* Map placeholder */}
          <div className="absolute inset-4 rounded-xl border border-border bg-card flex flex-col items-center justify-center">
            <Map className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm font-medium text-foreground mb-1">
              {creationMode === 'draw' ? 'Область рисования маршрута' : 'Предпросмотр загруженных координат'}
            </p>
            <p className="text-xs text-muted-foreground">
              {creationMode === 'draw' 
                ? 'Кликните для добавления точек маршрута'
                : 'Загрузите файл с координатами для отображения'
              }
            </p>
          </div>

          {/* Drawing tools (if draw mode) */}
          {creationMode === 'draw' && (
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <Button variant="secondary" size="icon" className="h-9 w-9">
                <PenTool className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Notice about visibility */}
        <div className="p-3 border-t border-border bg-amber-50 flex items-start gap-2">
          <Info className="h-4 w-4 text-amber-600 mt-0.5" />
          <p className="text-xs text-amber-800">
            Новый маршрут не отображается на общей карте до публикации через сценарий.
          </p>
        </div>
      </div>

      {/* Right: Calculated summary */}
      <div className="w-72 border-l border-border bg-secondary/30 overflow-y-auto">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Calculator className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Расчётные показатели</h3>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <KpiRow label="Протяжённость" value={calculatedKpi.length} unit="км" />
          <KpiRow label="Оценка инвестиций" value={calculatedKpi.estimatedInvestment} unit="млрд ₽" />
          <KpiRow label="Эффект на ВВП" value={calculatedKpi.gdpEffect} unit="млрд ₽" />
          <KpiRow label="Пассажиропоток" value={calculatedKpi.passengerFlow} unit="млн чел/год" />
          <KpiRow label="Охват населения" value={calculatedKpi.population} unit="млн чел" />
          <KpiRow label="Потребный парк" value={calculatedKpi.rollingStock} unit="составов" />
        </div>

        {/* Validation */}
        {hasIssues && (
          <div className="mx-4 mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-xs font-medium text-destructive">Требуется исправление</span>
            </div>
            <ul className="space-y-1">
              {validationIssues.map((issue, i) => (
                <li key={i} className="text-xs text-destructive flex items-start gap-1.5">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-destructive shrink-0" />
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="p-4 border-t border-border space-y-2">
          <Button className="w-full gap-2" disabled={hasIssues} onClick={() => onSave?.({})}>
            <Save className="h-4 w-4" />
            Сохранить черновик
          </Button>
          <Button variant="outline" className="w-full gap-2" disabled={hasIssues} onClick={() => onAddToScenario?.({})}>
            <Plus className="h-4 w-4" />
            Добавить в сценарий
          </Button>
          <Button variant="outline" className="w-full gap-2" disabled={hasIssues} onClick={() => onSendForReview?.({})}>
            <Send className="h-4 w-4" />
            На рассмотрение
          </Button>
        </div>
      </div>
    </div>
  );
}

function KpiRow({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground tabular-nums">
        {value.toLocaleString('ru-RU')} <span className="text-xs text-muted-foreground">{unit}</span>
      </span>
    </div>
  );
}

// Route Uploaded State component
export function RouteUploadedState({
  routeName = 'Новый маршрут',
  onSaveAsDraft,
  onAddToScenario,
  onSendForReview,
}: {
  routeName?: string;
  onSaveAsDraft?: () => void;
  onAddToScenario?: () => void;
  onSendForReview?: () => void;
}) {
  const calculatedParams = {
    length: 245,
    investment: 420,
    gdpEffect: 380,
    passengerFlow: 6.8,
  };

  const geometryWarnings = [
    'Обнаружено пересечение с существующим маршрутом МСК-Рязань',
  ];

  return (
    <div className="max-w-2xl mx-auto p-8">
      {/* Success header */}
      <div className="text-center mb-8">
        <div className="mb-4 flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-implementation-green/10">
          <CheckCircle className="h-8 w-8 text-implementation-green" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Маршрут загружен</h2>
        <p className="text-muted-foreground">{routeName}</p>
      </div>

      {/* Route preview placeholder */}
      <div className="rounded-xl border border-border bg-card p-4 mb-6">
        <div className="aspect-[2/1] rounded-lg bg-secondary/50 flex items-center justify-center">
          <Map className="h-8 w-8 text-muted-foreground" />
        </div>
      </div>

      {/* Calculated parameters */}
      <div className="rounded-xl border border-border bg-card p-4 mb-6">
        <h3 className="text-sm font-medium text-foreground mb-3">Расчётные параметры</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-secondary/50">
            <div className="text-lg font-semibold text-foreground">{calculatedParams.length} км</div>
            <div className="text-xs text-muted-foreground">Протяжённость</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-secondary/50">
            <div className="text-lg font-semibold text-foreground">{calculatedParams.investment} млрд</div>
            <div className="text-xs text-muted-foreground">Инвестиции</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-secondary/50">
            <div className="text-lg font-semibold text-foreground">{calculatedParams.gdpEffect} млрд</div>
            <div className="text-xs text-muted-foreground">Эффект на ВВП</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-secondary/50">
            <div className="text-lg font-semibold text-foreground">{calculatedParams.passengerFlow} млн</div>
            <div className="text-xs text-muted-foreground">Пассажиропоток</div>
          </div>
        </div>
      </div>

      {/* Geometry warnings */}
      {geometryWarnings.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-800">Возможные проблемы геометрии</span>
          </div>
          <ul className="space-y-1">
            {geometryWarnings.map((warning, i) => (
              <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-amber-500 shrink-0" />
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center gap-3">
        <Button variant="outline" onClick={onSaveAsDraft}>
          <Save className="mr-2 h-4 w-4" />
          Сохранить черновик
        </Button>
        <Button variant="outline" onClick={onAddToScenario}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить в сценарий
        </Button>
        <Button onClick={onSendForReview}>
          <Send className="mr-2 h-4 w-4" />
          На рассмотрение
        </Button>
      </div>
    </div>
  );
}
