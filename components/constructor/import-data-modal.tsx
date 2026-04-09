'use client';

import { useState } from 'react';
import { 
  Upload, 
  FileSpreadsheet, 
  AlertTriangle, 
  CheckCircle, 
  X,
  ChevronRight,
  ArrowRight,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

type ImportStep = 'upload' | 'mapping' | 'preview' | 'result';
type ImportStatus = 'idle' | 'validating' | 'success' | 'warning' | 'error';

interface ImportDataModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: (data: unknown) => void;
}

const requiredFields = [
  { id: 'name', label: 'Название маршрута', required: true },
  { id: 'length', label: 'Протяжённость', required: true },
  { id: 'investment', label: 'Инвестиции', required: true },
  { id: 'startYear', label: 'Год начала', required: true },
  { id: 'endYear', label: 'Год завершения', required: true },
  { id: 'gdpEffect', label: 'Эффект на ВВП', required: false },
  { id: 'passengerFlow', label: 'Пассажиропоток', required: false },
  { id: 'population', label: 'Население', required: false },
];

const sampleSourceColumns = ['Наименование', 'Длина (км)', 'Капвложения', 'Начало', 'Завершение', 'ВВП эффект', 'Пассажиры', 'Население региона'];

const samplePreviewData = [
  { name: 'Москва – Тула', length: 180, investment: 320, startYear: 2030, endYear: 2034, gdpEffect: 280, status: 'valid' },
  { name: 'Москва – Владимир', length: 190, investment: 340, startYear: 2031, endYear: 2035, gdpEffect: null, status: 'warning' },
  { name: 'Invalid Row', length: -50, investment: 'abc', startYear: 2025, endYear: 2024, gdpEffect: 100, status: 'error' },
  { name: 'Москва – Тверь', length: 167, investment: 280, startYear: 2032, endYear: 2036, gdpEffect: 220, status: 'valid' },
];

export function ImportDataModal({ open, onOpenChange, onComplete }: ImportDataModalProps) {
  const [step, setStep] = useState<ImportStep>('upload');
  const [status, setStatus] = useState<ImportStatus>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sourceType, setSourceType] = useState<string>('xlsx');
  const [fieldMappings, setFieldMappings] = useState<Record<string, string>>({});

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setStatus('idle');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setStatus('idle');
    }
  };

  const handleNextStep = () => {
    switch (step) {
      case 'upload':
        setStep('mapping');
        break;
      case 'mapping':
        setStatus('validating');
        setTimeout(() => {
          setStatus('warning');
          setStep('preview');
        }, 1000);
        break;
      case 'preview':
        setStep('result');
        setStatus('success');
        break;
      case 'result':
        onComplete?.({});
        onOpenChange(false);
        resetState();
        break;
    }
  };

  const resetState = () => {
    setStep('upload');
    setStatus('idle');
    setSelectedFile(null);
    setFieldMappings({});
  };

  const validCount = samplePreviewData.filter(r => r.status === 'valid').length;
  const warningCount = samplePreviewData.filter(r => r.status === 'warning').length;
  const errorCount = samplePreviewData.filter(r => r.status === 'error').length;

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) resetState(); }}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Импорт данных</DialogTitle>
        </DialogHeader>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 py-3 border-b border-border">
          {[
            { id: 'upload', label: 'Загрузка' },
            { id: 'mapping', label: 'Сопоставление' },
            { id: 'preview', label: 'Предпросмотр' },
            { id: 'result', label: 'Результат' },
          ].map((s, i, arr) => (
            <div key={s.id} className="flex items-center">
              <div className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm',
                step === s.id 
                  ? 'bg-primary text-primary-foreground font-medium' 
                  : arr.findIndex(x => x.id === step) > i
                    ? 'bg-implementation-green/10 text-implementation-green'
                    : 'text-muted-foreground'
              )}>
                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-current/10 text-xs">
                  {arr.findIndex(x => x.id === step) > i ? <CheckCircle className="h-3.5 w-3.5" /> : i + 1}
                </span>
                {s.label}
              </div>
              {i < arr.length - 1 && <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4">
          {step === 'upload' && (
            <div className="space-y-4">
              {/* File drop zone */}
              <div
                className={cn(
                  'border-2 border-dashed rounded-xl p-8 text-center transition-colors',
                  selectedFile ? 'border-implementation-green bg-implementation-green/5' : 'border-border hover:border-primary/50'
                )}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileSpreadsheet className="h-10 w-10 text-implementation-green" />
                    <div className="text-left">
                      <p className="font-medium text-foreground">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(1)} КБ
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="ml-4"
                      onClick={() => setSelectedFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium text-foreground mb-1">
                      Перетащите файл сюда
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      или нажмите для выбора файла
                    </p>
                    <input
                      type="file"
                      accept=".xlsx,.csv"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button variant="outline" asChild>
                        <span>Выбрать файл</span>
                      </Button>
                    </label>
                  </>
                )}
              </div>

              {/* Source type */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Тип источника
                </label>
                <Select value={sourceType} onValueChange={setSourceType}>
                  <SelectTrigger className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xlsx">Microsoft Excel (.xlsx)</SelectItem>
                    <SelectItem value="csv">CSV (.csv)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 'mapping' && (
            <div className="space-y-4">
              <div className="flex items-start gap-2 p-3 rounded-lg bg-sm-blue/10 text-sm">
                <Info className="h-4 w-4 text-sm-blue mt-0.5" />
                <p className="text-sm-blue">
                  Сопоставьте колонки из вашего файла с полями системы. Обязательные поля отмечены звёздочкой.
                </p>
              </div>

              <div className="space-y-3">
                {requiredFields.map((field) => (
                  <div key={field.id} className="flex items-center gap-4">
                    <div className="w-48 text-sm">
                      {field.label}
                      {field.required && <span className="text-destructive ml-0.5">*</span>}
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <Select 
                      value={fieldMappings[field.id] || ''} 
                      onValueChange={(v) => setFieldMappings(prev => ({ ...prev, [field.id]: v }))}
                    >
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="Выберите колонку" />
                      </SelectTrigger>
                      <SelectContent>
                        {sampleSourceColumns.map((col) => (
                          <SelectItem key={col} value={col}>{col}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-4">
              {/* Validation summary */}
              <div className="flex gap-4">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-implementation-green/10">
                  <CheckCircle className="h-4 w-4 text-implementation-green" />
                  <span className="text-sm font-medium text-implementation-green">{validCount} корректных</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-100">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-700">{warningCount} с предупреждениями</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10">
                  <X className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium text-destructive">{errorCount} с ошибками</span>
                </div>
              </div>

              {/* Preview table */}
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground w-12">Статус</th>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground">Название</th>
                      <th className="px-3 py-2 text-right font-medium text-muted-foreground">Протяж.</th>
                      <th className="px-3 py-2 text-right font-medium text-muted-foreground">Инвест.</th>
                      <th className="px-3 py-2 text-right font-medium text-muted-foreground">Начало</th>
                      <th className="px-3 py-2 text-right font-medium text-muted-foreground">Заверш.</th>
                      <th className="px-3 py-2 text-right font-medium text-muted-foreground">ВВП</th>
                    </tr>
                  </thead>
                  <tbody>
                    {samplePreviewData.map((row, i) => (
                      <tr key={i} className={cn(
                        'border-t border-border',
                        row.status === 'error' && 'bg-destructive/5',
                        row.status === 'warning' && 'bg-amber-50'
                      )}>
                        <td className="px-3 py-2">
                          {row.status === 'valid' && <CheckCircle className="h-4 w-4 text-implementation-green" />}
                          {row.status === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                          {row.status === 'error' && <X className="h-4 w-4 text-destructive" />}
                        </td>
                        <td className="px-3 py-2 font-medium">{row.name}</td>
                        <td className={cn('px-3 py-2 text-right tabular-nums', typeof row.length !== 'number' || row.length < 0 ? 'text-destructive' : '')}>
                          {row.length}
                        </td>
                        <td className={cn('px-3 py-2 text-right tabular-nums', typeof row.investment !== 'number' ? 'text-destructive' : '')}>
                          {row.investment}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">{row.startYear}</td>
                        <td className={cn('px-3 py-2 text-right tabular-nums', row.endYear < row.startYear ? 'text-destructive' : '')}>
                          {row.endYear}
                        </td>
                        <td className={cn('px-3 py-2 text-right tabular-nums', row.gdpEffect === null ? 'text-amber-500' : '')}>
                          {row.gdpEffect ?? '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Warning notice */}
              {(warningCount > 0 || errorCount > 0) && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
                  <strong>Обратите внимание:</strong> Строки с ошибками будут пропущены при импорте. 
                  Строки с предупреждениями будут импортированы с пустыми значениями в проблемных полях.
                </div>
              )}
            </div>
          )}

          {step === 'result' && (
            <div className="text-center py-8">
              <div className="mb-4 flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-implementation-green/10">
                <CheckCircle className="h-8 w-8 text-implementation-green" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Импорт завершён</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Успешно импортировано {validCount + warningCount} записей из {samplePreviewData.length}.
                {errorCount > 0 && ` Пропущено ${errorCount} записей с ошибками.`}
              </p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Закрыть
                </Button>
                <Button onClick={handleNextStep}>
                  Применить к сценарию
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step !== 'result' && (
          <div className="flex justify-between pt-4 border-t border-border">
            <Button 
              variant="ghost" 
              onClick={() => {
                if (step === 'upload') {
                  onOpenChange(false);
                  resetState();
                } else {
                  const steps: ImportStep[] = ['upload', 'mapping', 'preview', 'result'];
                  const currentIndex = steps.indexOf(step);
                  setStep(steps[currentIndex - 1]);
                }
              }}
            >
              {step === 'upload' ? 'Отмена' : 'Назад'}
            </Button>
            <Button 
              onClick={handleNextStep}
              disabled={step === 'upload' && !selectedFile}
            >
              {step === 'preview' ? 'Импортировать' : 'Далее'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
