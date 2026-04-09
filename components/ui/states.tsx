'use client';

import { ReactNode } from 'react';
import { 
  Loader2, 
  Search, 
  Archive, 
  FileX, 
  AlertTriangle, 
  Lock, 
  FileEdit, 
  Download, 
  CheckCircle, 
  BarChart3, 
  RefreshCw,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StateProps {
  className?: string;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

// Loading skeleton
export function LoadingSkeleton({ className, rows = 5 }: { className?: string; rows?: number }) {
  return (
    <div className={cn('space-y-4 animate-pulse', className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded bg-muted" />
            <div className="h-3 w-1/2 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Loading table skeleton
export function LoadingTableSkeleton({ className, rows = 5, cols = 5 }: { className?: string; rows?: number; cols?: number }) {
  return (
    <div className={cn('space-y-3 animate-pulse', className)}>
      <div className="flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-8 flex-1 rounded bg-muted" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-12 flex-1 rounded bg-muted/50" />
          ))}
        </div>
      ))}
    </div>
  );
}

// No data state
export function NoDataState({ className, title, description, action }: StateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <FileX className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-medium text-foreground">
        {title || 'Нет данных'}
      </h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        {description || 'Данные отсутствуют или ещё не загружены'}
      </p>
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  );
}

// Empty list state
export function EmptyListState({ className, title, description, action }: StateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
        <BarChart3 className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-medium text-foreground">
        {title || 'Список пуст'}
      </h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        {description || 'Добавьте элементы, чтобы начать работу'}
      </p>
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  );
}

// No search results state
export function NoSearchResultsState({ className, title, description, action }: StateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-medium text-foreground">
        {title || 'Ничего не найдено'}
      </h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        {description || 'Попробуйте изменить параметры поиска или сбросить фильтры'}
      </p>
      {action && (
        <Button variant="outline" onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  );
}

// Validation error state
export function ValidationErrorState({ 
  className, 
  title, 
  description, 
  errors,
  action 
}: StateProps & { errors?: string[] }) {
  return (
    <div className={cn('rounded-xl border border-destructive/20 bg-destructive/5 p-6', className)}>
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
          <AlertTriangle className="h-5 w-5 text-destructive" />
        </div>
        <div className="flex-1">
          <h3 className="mb-1 font-medium text-foreground">
            {title || 'Ошибки валидации'}
          </h3>
          <p className="mb-3 text-sm text-muted-foreground">
            {description || 'Обнаружены проблемы, требующие исправления'}
          </p>
          {errors && errors.length > 0 && (
            <ul className="mb-4 space-y-1">
              {errors.map((error, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-destructive">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-destructive" />
                  {error}
                </li>
              ))}
            </ul>
          )}
          {action && (
            <Button variant="outline" size="sm" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Archived entity state
export function ArchivedEntityState({ className, title, description, action }: StateProps) {
  return (
    <div className={cn('rounded-xl border border-border bg-muted/30 p-6', className)}>
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Archive className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="mb-1 font-medium text-foreground">
            {title || 'Архивный элемент'}
          </h3>
          <p className="mb-3 text-sm text-muted-foreground">
            {description || 'Этот элемент находится в архиве и доступен только для просмотра'}
          </p>
          {action && (
            <Button variant="outline" size="sm" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Draft entity state
export function DraftEntityBadge({ className }: { className?: string }) {
  return (
    <div className={cn('inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700', className)}>
      <FileEdit className="h-3 w-3" />
      Черновик
    </div>
  );
}

// Restricted action state
export function RestrictedActionState({ className, title, description }: StateProps) {
  return (
    <div className={cn('rounded-xl border border-border bg-muted/30 p-6', className)}>
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Lock className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="mb-1 font-medium text-foreground">
            {title || 'Действие недоступно'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {description || 'У вас нет прав для выполнения этого действия'}
          </p>
        </div>
      </div>
    </div>
  );
}

// Read-only state banner
export function ReadOnlyBanner({ className, message }: { className?: string; message?: string }) {
  return (
    <div className={cn('flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm text-muted-foreground', className)}>
      <Lock className="h-4 w-4" />
      {message || 'Режим просмотра. Редактирование недоступно.'}
    </div>
  );
}

// Export in progress state
export function ExportInProgressState({ className, progress, entityName }: { className?: string; progress?: number; entityName?: string }) {
  return (
    <div className={cn('rounded-xl border border-border bg-card p-6', className)}>
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="mb-1 font-medium text-foreground">Формирование экспорта</h3>
          <p className="text-sm text-muted-foreground">
            {entityName ? `Экспорт: ${entityName}` : 'Подготовка файла...'}
          </p>
          {progress !== undefined && (
            <div className="mt-3">
              <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                <span>Прогресс</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div 
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Export ready state
export function ExportReadyState({ 
  className, 
  entityName, 
  size,
  onDownload,
  onClose
}: { 
  className?: string; 
  entityName?: string;
  size?: string;
  onDownload?: () => void;
  onClose?: () => void;
}) {
  return (
    <div className={cn('rounded-xl border border-implementation-green/20 bg-implementation-green/5 p-6', className)}>
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-implementation-green/10">
          <CheckCircle className="h-6 w-6 text-implementation-green" />
        </div>
        <div className="flex-1">
          <h3 className="mb-1 font-medium text-foreground">Экспорт готов</h3>
          <p className="text-sm text-muted-foreground">
            {entityName || 'Файл'}{size ? ` (${size})` : ''}
          </p>
          <div className="mt-4 flex gap-2">
            <Button size="sm" onClick={onDownload}>
              <Download className="mr-2 h-4 w-4" />
              Скачать
            </Button>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                Закрыть
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Compare empty state
export function CompareEmptyState({ className, title, description, action }: StateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
        <BarChart3 className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-medium text-foreground">
        {title || 'Выберите элементы для сравнения'}
      </h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        {description || 'Добавьте минимум 2 элемента, чтобы начать сравнение'}
      </p>
      {action && (
        <Button variant="outline" onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  );
}

// Ranking unavailable state
export function RankingUnavailableState({ className, action }: StateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
        <BarChart3 className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-medium text-foreground">
        Ранжирование недоступно
      </h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        Все группы критериев отключены. Включите хотя бы одну группу для расчёта рейтинга.
      </p>
      {action && (
        <Button variant="outline" onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  );
}

// Unsaved changes banner
export function UnsavedChangesBanner({ 
  className, 
  onSave, 
  onDiscard 
}: { 
  className?: string; 
  onSave?: () => void;
  onDiscard?: () => void;
}) {
  return (
    <div className={cn('flex items-center justify-between rounded-lg bg-amber-50 border border-amber-200 px-4 py-3', className)}>
      <div className="flex items-center gap-2 text-sm text-amber-800">
        <Save className="h-4 w-4" />
        Есть несохранённые изменения
      </div>
      <div className="flex gap-2">
        {onDiscard && (
          <Button variant="ghost" size="sm" onClick={onDiscard} className="text-amber-800 hover:text-amber-900 hover:bg-amber-100">
            Отменить
          </Button>
        )}
        {onSave && (
          <Button size="sm" onClick={onSave} className="bg-amber-600 hover:bg-amber-700 text-white">
            Сохранить
          </Button>
        )}
      </div>
    </div>
  );
}

// Generic loading overlay
export function LoadingOverlay({ message }: { message?: string }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{message || 'Загрузка...'}</p>
      </div>
    </div>
  );
}
