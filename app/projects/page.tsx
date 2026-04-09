'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { ProjectsNav, type ProjectsMode } from '@/components/projects/projects-nav';
import { ProjectsListView } from '@/components/projects/projects-list-view';
import { ProjectsCompareView } from '@/components/projects/projects-compare-view';
import { ProjectsRankingView } from '@/components/projects/projects-ranking-view';
import { ProjectCardView } from '@/components/projects/project-card-view';
import { CompareTray } from '@/components/projects/compare-tray';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { projects } from '@/lib/data';
import type { RouteProject } from '@/lib/data';
import { Search, Download } from 'lucide-react';

function ProjectsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<ProjectsMode>('list');
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [activeProject, setActiveProject] = useState<RouteProject | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedProjects = selectedProjectIds
    .map(id => projects.find(p => p.id === id))
    .filter((p): p is RouteProject => p !== undefined);

  const handleToggleProject = useCallback((id: string) => {
    setSelectedProjectIds(prev =>
      prev.includes(id)
        ? prev.filter(pid => pid !== id)
        : [...prev, id]
    );
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedProjectIds([]);
  }, []);

  const handleOpenCard = useCallback((project: RouteProject) => {
    setActiveProject(project);
    setMode('card');
  }, []);

  const handleBackFromCard = useCallback(() => {
    setActiveProject(null);
    setMode('list');
  }, []);

  const handleShowOnMap = useCallback((project?: RouteProject) => {
    if (project) {
      router.push(`/map?route=${project.id}`);
    } else if (selectedProjectIds.length > 0) {
      router.push(`/map?projects=${selectedProjectIds.join(',')}`);
    } else {
      router.push('/map');
    }
  }, [router, selectedProjectIds]);

  const handleExport = useCallback((project?: RouteProject) => {
    router.push('/export');
  }, [router]);

  const handleOpenInConstructor = useCallback(() => {
    router.push('/constructor');
  }, [router]);

  const handleCompare = useCallback(() => {
    setMode('compare');
  }, []);

  // Deep-link support (used by Map compare panel and other entry points)
  useEffect(() => {
    const compare = searchParams.get('compare');
    if (!compare) return;
    const ids = compare.split(',').map((s) => s.trim()).filter(Boolean);
    if (ids.length === 0) return;
    setSelectedProjectIds(Array.from(new Set(ids)));
    setMode('compare');
  }, [searchParams]);

  return (
    <AppShell>
      <div className="min-h-[calc(100vh-4rem)] p-6 flex flex-col">
        {/* Page header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Проекты</h1>
              {mode !== 'card' && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {projects.filter(p => p.status !== 'archived').length} активных проектов
                </p>
              )}
            </div>

            {/* Secondary navigation */}
            {mode !== 'card' && (
              <ProjectsNav
                mode={mode}
                onModeChange={setMode}
                projectName={activeProject?.name}
              />
            )}
          </div>

          {/* Global search and export */}
          {mode !== 'card' && mode !== 'compare' && (
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск проектов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm" onClick={() => handleExport()}>
                <Download className="h-4 w-4 mr-2" />
                Экспорт
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0">
          {mode === 'list' && (
            <ProjectsListView
              projects={projects.filter(p => 
                searchQuery ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
              )}
              selectedProjectIds={selectedProjectIds}
              onToggleProject={handleToggleProject}
              onOpenCard={handleOpenCard}
              onShowOnMap={handleShowOnMap}
              onExport={handleExport}
            />
          )}

          {mode === 'compare' && (
            <ProjectsCompareView
              selectedProjectIds={selectedProjectIds}
              onToggleProject={handleToggleProject}
              onShowOnMap={() => handleShowOnMap()}
              onExport={() => handleExport()}
            />
          )}

          {mode === 'ranking' && (
            <ProjectsRankingView
              onOpenCard={handleOpenCard}
              onExport={() => handleExport()}
            />
          )}

          {mode === 'card' && activeProject && (
            <ProjectCardView
              project={activeProject}
              onBack={handleBackFromCard}
              onShowOnMap={() => handleShowOnMap(activeProject)}
              onAddToCompare={() => handleToggleProject(activeProject.id)}
              onOpenInConstructor={handleOpenInConstructor}
              onExport={() => handleExport(activeProject)}
              isInCompare={selectedProjectIds.includes(activeProject.id)}
            />
          )}
        </div>

        {/* Compare Tray - visible in list and card modes */}
        {(mode === 'list' || mode === 'card') && (
          <CompareTray
            selectedProjects={selectedProjects}
            onRemove={handleToggleProject}
            onClear={handleClearSelection}
            onCompare={handleCompare}
            onShowOnMap={() => handleShowOnMap()}
          />
        )}
      </div>
    </AppShell>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={null}>
      <ProjectsPageContent />
    </Suspense>
  );
}
