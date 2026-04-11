'use client';

import { AppShell } from '@/components/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { projects } from '@/lib/data';

const activeProjects = projects.filter(p => p.status !== 'archived');

export default function Timeline2050Page() {
  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="px-6 py-4 border-b border-border/40 bg-card">
          <h1 className="text-xl font-semibold text-foreground">Проекты до 2050 года</h1>
          <p className="text-sm text-muted-foreground">Перечень и сроки реализации проектов организации скоростного и высокоскоростного движения</p>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-3">
            {activeProjects
              .sort((a, b) => a.startYear - b.startYear)
              .map(p => (
                <Card key={p.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{p.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {p.startYear} — {p.endYear} • {p.length.toLocaleString('ru-RU')} км
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={p.status === 'in-progress' ? 'default' : 'secondary'} className="text-[10px]">
                          {p.status === 'approved' ? 'Утверждён' : p.status === 'in-progress' ? 'В реализации' : p.status === 'in-development' ? 'В разработке' : p.status === 'experimental' ? 'Экспериментальный' : p.status === 'international' ? 'Международный' : p.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{p.investment.toLocaleString('ru-RU')} млрд ₽</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
        <div className="px-6 py-2 border-t border-border/40 bg-card/50">
          <p className="text-[10px] text-muted-foreground">Цифровая модель ВСМ • Версия 0.1.0 • ОАО «РЖД»</p>
        </div>
      </div>
    </AppShell>
  );
}
