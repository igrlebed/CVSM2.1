'use client';

import { AppShell } from '@/components/app-shell';
import { ProjectsRankingView } from '@/components/projects/projects-ranking-view';
import { projects } from '@/lib/data';

export default function RankingPage() {
  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="px-6 py-4 border-b border-border/40 bg-card">
          <h1 className="text-xl font-semibold text-foreground">Панели показателей</h1>
          <p className="text-sm text-muted-foreground">Ранжирование проектов: показатели, веса, правила предпочтения, пороговые отсечки</p>
        </div>
        <div className="flex-1 overflow-hidden p-6">
          <ProjectsRankingView
            onOpenCard={() => {}}
            onExport={() => {}}
          />
        </div>
        <div className="px-6 py-2 border-t border-border/40 bg-card/50">
          <p className="text-[10px] text-muted-foreground">Цифровая модель ВСМ • Версия 0.1.0 • ОАО «РЖД»</p>
        </div>
      </div>
    </AppShell>
  );
}
