'use client';

import { useState, useCallback } from 'react';
import { usePermission } from '@/hooks/use-permission';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Upload, 
  GitCompare, 
  History,
  Map,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { scenarios, scenarioVersions, Scenario } from '@/lib/data';
import { ScenarioList } from '@/components/constructor/scenario-list';
import { ScenarioEditor, ScenarioEditorMode } from '@/components/constructor/scenario-editor';
import { ScenarioCompare } from '@/components/constructor/scenario-compare';
import { ImportDataModal } from '@/components/constructor/import-data-modal';
import { NewRouteEditor, RouteUploadedState } from '@/components/constructor/new-route-editor';
import { PublishScenarioModal } from '@/components/constructor/publish-scenario-modal';
import { VersionHistory } from '@/components/constructor/version-history';
import { CompareSelectionBar } from '@/components/constructor/compare-selection-bar';
import { AccessDeniedState } from '@/components/ui/access-denied-state';

type ConstructorMode = 'list' | 'edit' | 'compare' | 'new-route' | 'route-uploaded' | 'history';

export default function ConstructorPage() {
  const { can, role } = usePermission();
  
  // Guard: basic access to constructor
  const canViewConstructor = can('view:constructor');
  const canCreateScenario = can('create:scenario');
  const canEditScenario = can('edit:scenario');
  const canApproveScenario = can('approve:scenario');
  const canCompareScenario = can('compare:scenario');

  const [mode, setMode] = useState<ConstructorMode>('list');
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);

  const handleSelectScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setMode('edit');
  };

  const handleAddToCompare = (scenario: Scenario) => {
    if (!canCompareScenario) return;
    setCompareIds(prev => 
      prev.includes(scenario.id) 
        ? prev.filter(id => id !== scenario.id)
        : [...prev, scenario.id]
    );
  };

  const handleRemoveFromCompare = (id: string) => {
    setCompareIds(prev => prev.filter(i => i !== id));
  };

  const handleClearSelection = () => {
    setCompareIds([]);
  };

  const handleOpenCompare = () => {
    if (canCompareScenario && compareIds.length >= 2) {
      setMode('compare');
    }
  };

  const handleBack = () => {
    if (mode === 'edit' || mode === 'compare' || mode === 'new-route' || mode === 'route-uploaded' || mode === 'history') {
      setMode('list');
      if (mode !== 'compare') {
        setSelectedScenario(null);
      }
    }
  };

  // Determine Editor Mode based on role and scenario status
  const getEditorMode = (): ScenarioEditorMode => {
    if (!selectedScenario) return 'readonly';
    if (selectedScenario.isBase) return 'readonly';

    // Approver: never full edit. Only review when scenario is ready, otherwise readonly.
    if (role === 'approver') {
      return selectedScenario.status === 'ready-for-review' ? 'review' : 'readonly';
    }

    // Admin: full access (except base).
    if (role === 'admin') return 'edit';

    // Analyst: edit when allowed.
    if (canEditScenario) return 'edit';

    return 'readonly';
  };

  if (!canViewConstructor) {
    return (
      <AppShell>
        <AccessDeniedState />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-4rem)] relative">
        {/* Left sidebar - Scenario list */}
        {(mode === 'list' || mode === 'edit' || mode === 'history') && (
          <div className="w-72 border-r border-border bg-card flex-shrink-0">
            <ScenarioList
              scenarios={scenarios}
              selectedId={selectedScenario?.id}
              compareIds={compareIds}
              onSelect={handleSelectScenario}
              onAddToCompare={handleAddToCompare}
              onCreateNew={canCreateScenario ? () => {} : undefined}
              onDelete={canEditScenario ? () => {} : undefined}
              onArchive={canEditScenario ? () => {} : undefined}
            />
          </div>
        )}

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50">
            <div className="flex items-center gap-3">
              {mode !== 'list' && (
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <h1 className="text-lg font-semibold text-foreground">
                {mode === 'list' && 'Конструктор'}
                {mode === 'edit' && selectedScenario?.name}
                {mode === 'compare' && 'Сравнение сценариев'}
                {mode === 'new-route' && 'Новый маршрут'}
                {mode === 'route-uploaded' && 'Маршрут загружен'}
                {mode === 'history' && 'История версий'}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {mode === 'list' && (
                <>
                  {canEditScenario && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1.5"
                        onClick={() => setMode('new-route')}
                      >
                        <Map className="h-3.5 w-3.5" />
                        Новый маршрут
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1.5"
                        onClick={() => setImportModalOpen(true)}
                      >
                        <Upload className="h-3.5 w-3.5" />
                        Импорт данных
                      </Button>
                    </>
                  )}
                  {canCompareScenario && (
                    <Button 
                      variant={compareIds.length >= 2 ? 'default' : 'outline'}
                      size="sm" 
                      className="gap-1.5"
                      onClick={handleOpenCompare}
                      disabled={compareIds.length < 2}
                    >
                      <GitCompare className="h-3.5 w-3.5" />
                      Сравнить ({compareIds.length})
                    </Button>
                  )}
                </>
              )}
              {mode === 'edit' && selectedScenario && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1.5"
                  onClick={() => setMode('history')}
                >
                  <History className="h-3.5 w-3.5" />
                  История
                </Button>
              )}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-hidden">
            {mode === 'list' && (
              <div className="h-full flex items-center justify-center p-8">
                <div className="text-center max-w-md">
                  <div className="mb-4 flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-secondary">
                    <GitCompare className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h2 className="text-lg font-medium text-foreground mb-2">
                    Выберите сценарий
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Выберите сценарий из списка слева для {canEditScenario ? 'редактирования' : 'просмотра'} или создайте новый
                  </p>
                  <div className="flex justify-center gap-3">
                    {canCreateScenario && (
                      <>
                        <Button variant="outline" onClick={() => {}}>
                          <Plus className="mr-2 h-4 w-4" />
                          Новый сценарий
                        </Button>
                        <Button variant="outline" onClick={() => setImportModalOpen(true)}>
                          <Upload className="mr-2 h-4 w-4" />
                          Импортировать
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {mode === 'edit' && selectedScenario && (
              <ScenarioEditor
                scenario={selectedScenario}
                mode={getEditorMode()}
                onSave={() => {}}
                onSaveAsNew={() => {}}
                onSendForReview={() => {}}
                onApprove={() => {}}
                onReject={() => {}}
                onPublish={() => setPublishModalOpen(true)}
                onExport={() => {}}
                onArchive={() => {}}
                onOpenCompare={handleOpenCompare}
              />
            )}

            {mode === 'compare' && (
              <ScenarioCompare
                selectedIds={compareIds}
                onRemove={handleRemoveFromCompare}
                onAdd={(id) => setCompareIds(prev => [...prev, id])}
                onExport={() => {}}
                onShowOnMap={() => {}}
              />
            )}

            {mode === 'new-route' && (
              <NewRouteEditor
                onSave={() => setMode('route-uploaded')}
                onSendForReview={() => {}}
                onAddToScenario={() => {}}
              />
            )}

            {mode === 'route-uploaded' && (
              <RouteUploadedState
                routeName="Москва – Тула"
                onSaveAsDraft={() => setMode('list')}
                onAddToScenario={() => setMode('list')}
                onSendForReview={() => setMode('list')}
              />
            )}

            {mode === 'history' && selectedScenario && (
              <VersionHistory
                versions={scenarioVersions.filter(v => v.scenarioId === selectedScenario.id)}
                currentVersion={selectedScenario.version}
                onOpen={() => {}}
                onCompare={() => {}}
                onRestore={() => {}}
                onArchive={() => {}}
              />
            )}
          </div>
        </div>

        {/* Persistent Compare Bar */}
        {mode !== 'compare' && compareIds.length > 0 && canCompareScenario && (
          <CompareSelectionBar
            count={compareIds.length}
            onCompare={handleOpenCompare}
            onClear={handleClearSelection}
          />
        )}
      </div>

      {/* Modals */}
      <ImportDataModal
        open={importModalOpen}
        onOpenChange={setImportModalOpen}
        onComplete={() => {}}
      />

      {selectedScenario && (
        <PublishScenarioModal
          open={publishModalOpen}
          onOpenChange={setPublishModalOpen}
          scenario={selectedScenario}
          onPublish={() => {}}
        />
      )}
    </AppShell>
  );
}
