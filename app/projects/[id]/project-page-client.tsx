'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { ProjectCardView } from '@/components/projects/project-card-view';
import type { RouteProject } from '@/lib/data';

export function ProjectPageClient({ project }: { project: RouteProject }) {
  const router = useRouter();

  const handleBack = useCallback(() => {
    router.push('/projects');
  }, [router]);

  return (
    <AppShell>
      <div className="min-h-[calc(100vh-4rem)] p-6">
        <ProjectCardView
          project={project}
          onBack={handleBack}
          onShowOnMap={() => router.push(`/map?route=${project.id}`)}
          onAddToCompare={() => router.push(`/projects?compare=${project.id}`)}
          onOpenInConstructor={() => router.push('/constructor')}
          onExport={() => router.push('/export')}
          isInCompare={false}
        />
      </div>
    </AppShell>
  );
}

