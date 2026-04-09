import { notFound } from 'next/navigation';
import { projects, type RouteProject } from '@/lib/data';
import { ProjectPageClient } from './project-page-client';

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project: RouteProject | undefined = projects.find((p) => p.id === id);

  if (!project) notFound();

  return <ProjectPageClient project={project} />;
}

