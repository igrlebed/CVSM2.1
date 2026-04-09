'use client';

import { useState } from 'react';
import { 
  History, 
  Eye, 
  GitCompare, 
  RotateCcw, 
  Archive,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileEdit,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScenarioVersion, ScenarioStatus, getScenarioStatusLabel } from '@/lib/data';

interface VersionHistoryProps {
  versions: ScenarioVersion[];
  currentVersion: number;
  onOpen?: (version: ScenarioVersion) => void;
  onCompare?: (v1: ScenarioVersion, v2: ScenarioVersion) => void;
  onRestore?: (version: ScenarioVersion) => void;
  onArchive?: (version: ScenarioVersion) => void;
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

export function VersionHistory({
  versions,
  currentVersion,
  onOpen,
  onCompare,
  onRestore,
  onArchive,
}: VersionHistoryProps) {
  const [selectedForCompare, setSelectedForCompare] = useState<ScenarioVersion | null>(null);

  const handleCompareClick = (version: ScenarioVersion) => {
    if (selectedForCompare) {
      if (selectedForCompare.id !== version.id) {
        onCompare?.(selectedForCompare, version);
      }
      setSelectedForCompare(null);
    } else {
      setSelectedForCompare(version);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">История версий</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Текущая версия: v{currentVersion}
        </p>
      </div>

      {selectedForCompare && (
        <div className="px-4 py-2 bg-sm-blue/10 border-b border-sm-blue/20 flex items-center justify-between">
          <span className="text-sm text-sm-blue">
            Выберите вторую версию для сравнения с v{selectedForCompare.version}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSelectedForCompare(null)}
            className="text-sm-blue hover:text-sm-blue"
          >
            Отмена
          </Button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

            {/* Version items */}
            <div className="space-y-4">
              {versions.map((version, index) => {
                const isCurrent = version.version === currentVersion;
                const isSelectedForCompare = selectedForCompare?.id === version.id;

                return (
                  <div key={version.id} className="relative pl-10">
                    {/* Timeline dot */}
                    <div className={cn(
                      'absolute left-2 top-2 w-4 h-4 rounded-full border-2 bg-background',
                      isCurrent 
                        ? 'border-primary' 
                        : isSelectedForCompare
                          ? 'border-sm-blue'
                          : 'border-border'
                    )}>
                      {isCurrent && (
                        <div className="absolute inset-1 rounded-full bg-primary" />
                      )}
                    </div>

                    {/* Version card */}
                    <div className={cn(
                      'rounded-lg border p-3 transition-colors',
                      isCurrent 
                        ? 'border-primary/50 bg-primary/5' 
                        : isSelectedForCompare
                          ? 'border-sm-blue bg-sm-blue/5'
                          : 'border-border bg-card hover:border-primary/30'
                    )}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                              Версия {version.version}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-primary text-primary-foreground">
                                Текущая
                              </span>
                            )}
                            <span className={cn(
                              'inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full',
                              version.status === 'published' && 'bg-implementation-green/10 text-implementation-green',
                              version.status === 'draft' && 'bg-amber-100 text-amber-700',
                              version.status === 'ready-for-review' && 'bg-sm-blue/10 text-sm-blue'
                            )}>
                              {getStatusIcon(version.status)}
                              {getScenarioStatusLabel(version.status)}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                            {version.comment}
                          </p>
                          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{new Date(version.date).toLocaleDateString('ru-RU')}</span>
                            <span>·</span>
                            <span>{version.author}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-3 flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 gap-1.5 text-xs"
                          onClick={() => onOpen?.(version)}
                        >
                          <Eye className="h-3 w-3" />
                          Открыть
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={cn(
                            'h-7 gap-1.5 text-xs',
                            isSelectedForCompare && 'bg-sm-blue/10 text-sm-blue'
                          )}
                          onClick={() => handleCompareClick(version)}
                        >
                          <GitCompare className="h-3 w-3" />
                          {isSelectedForCompare ? 'Отменить' : 'Сравнить'}
                        </Button>
                        {!isCurrent && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 gap-1.5 text-xs"
                              onClick={() => onRestore?.(version)}
                            >
                              <RotateCcw className="h-3 w-3" />
                              Восстановить
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 gap-1.5 text-xs text-muted-foreground"
                              onClick={() => onArchive?.(version)}
                            >
                              <Archive className="h-3 w-3" />
                              В архив
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
