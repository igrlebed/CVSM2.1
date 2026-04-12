'use client';

import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calculator, Download, AlertCircle } from 'lucide-react';

const MOCK_FEASIBILITY = [
  { project: 'Москва – Санкт-Петербург', length: 679, investment: 1420, gdpEffect: 1850, paybackPeriod: '18 лет', irr: '12.4%', npv: '420 млрд ₽' },
  { project: 'Москва – Казань', length: 770, investment: 1850, gdpEffect: 1450, paybackPeriod: '22 года', irr: '9.8%', npv: '280 млрд ₽' },
  { project: 'Москва – Екатеринбург', length: 1775, investment: 4850, gdpEffect: 3200, paybackPeriod: '25 лет', irr: '8.2%', npv: '610 млрд ₽' },
];

export default function FeasibilityPage() {
  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <PageHeader
          title="Предварительное ТЭО"
          description="Показатели технико-экономического обоснования проектов"
          breadcrumbs={[{ label: 'Аналитика', href: '/analytics' }, { label: 'ПредТЭО' }]}
          actions={<Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /> Экспорт</Button>}
        />
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2"><AlertCircle className="h-4 w-4 text-amber-500" /> Методология расчёта</CardTitle>
              <CardDescription>Предварительное ТЭО формируется на основе прогнозных пассажиропотоков, стоимости строительства и операционных затрат. Данные носят оценочный характер.</CardDescription>
            </CardHeader>
          </Card>
          <div className="space-y-3">
            {MOCK_FEASIBILITY.map((item, i) => (
              <Card key={i}>
                <CardHeader className="pb-2"><CardTitle className="text-sm">{item.project}</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div><p className="text-[10px] text-muted-foreground">Протяжённость</p><p className="text-sm font-medium">{item.length} км</p></div>
                    <div><p className="text-[10px] text-muted-foreground">Инвестиции</p><p className="text-sm font-medium">{item.investment} млрд ₽</p></div>
                    <div><p className="text-[10px] text-muted-foreground">Эффект на ВВП</p><p className="text-sm font-medium">{item.gdpEffect} млрд ₽</p></div>
                    <div><p className="text-[10px] text-muted-foreground">Срок окупаемости</p><p className="text-sm font-medium">{item.paybackPeriod}</p></div>
                    <div><p className="text-[10px] text-muted-foreground">IRR</p><p className="text-sm font-medium">{item.irr}</p></div>
                    <div><p className="text-[10px] text-muted-foreground">NPV</p><p className="text-sm font-medium">{item.npv}</p></div>
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
