'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { ProjectCardView } from '@/components/projects/project-card-view';
import type { RouteProject } from '@/lib/data';
import { PageHeader } from '@/components/page-header';

export function ProjectPageClient({ project }: { project: RouteProject }) {
  const router = useRouter();

  const handleBack = useCallback(() => {
    router.push('/projects');
  }, [router]);

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <PageHeader
          title={project.name}
          description={`${project.startYear} – ${project.endYear} гг.`}
          breadcrumbs={[
            { label: 'Проекты', href: '/projects' },
            { label: project.name },
          ]}
          actions={
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Назад к списку
            </button>
          }
        />
        <div className="flex-1 overflow-y-auto p-6">
          <ProjectCardView
            project={project}
            onBack={handleBack}
            onShowOnMap={() => router.push(`/map?route=${project.id}`)}
            onAddToCompare={() => router.push(`/projects?compare=${project.id}`)}
            onOpenInConstructor={() => router.push('/constructor')}
            onExport={() => router.push('/analytics/reports')}
            isInCompare={false}
          />
        </div>
      </div>
    </AppShell>
  );
}

