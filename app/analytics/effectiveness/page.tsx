'use client';

import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Download } from 'lucide-react';

const MOCK_EFFECTIVENESS = [
  { project: 'Москва – Санкт-Петербург', gdpEffect: 1850, jobsCreated: 45000, taxRevenue: 280, accessibility: 34, commercialEff: '12.4%' },
  { project: 'Москва – Казань', gdpEffect: 1450, jobsCreated: 52000, taxRevenue: 185, accessibility: 32, commercialEff: '9.8%' },
  { project: 'Москва – Екатеринбург', gdpEffect: 3200, jobsCreated: 125000, taxRevenue: 520, accessibility: 48, commercialEff: '8.2%' },
];

export default function EffectivenessPage() {
  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <PageHeader
          title="Экономическая эффективность"
          description="Параметры оценки экономической и социально-экономической эффективности"
          breadcrumbs={[{ label: 'Аналитика', href: '/analytics' }, { label: 'Эффективность' }]}
          actions={<Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /> Экспорт</Button>}
        />
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {MOCK_EFFECTIVENESS.map((item, i) => (
            <Card key={i}>
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" />{item.project}</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-4">
                  <div><p className="text-[10px] text-muted-foreground">Эффект на ВВП</p><p className="text-sm font-medium">{item.gdpEffect} млрд ₽</p></div>
                  <div><p className="text-[10px] text-muted-foreground">Рабочие места</p><p className="text-sm font-medium">{item.jobsCreated.toLocaleString('ru-RU')}</p></div>
                  <div><p className="text-[10px] text-muted-foreground">Налоговые поступления</p><p className="text-sm font-medium">{item.taxRevenue} млрд ₽</p></div>
                  <div><p className="text-[10px] text-muted-foreground">Доступность</p><p className="text-sm font-medium">{item.accessibility}%</p></div>
                  <div><p className="text-[10px] text-muted-foreground">Коммерч. эфф.</p><p className="text-sm font-medium">{item.commercialEff}</p></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="px-6 py-2 border-t border-border/40 bg-card/50">
          <p className="text-[10px] text-muted-foreground">Цифровая модель ВСМ • Версия 0.1.0 • ОАО «РЖД»</p>
        </div>
      </div>
    </AppShell>
  );
}
