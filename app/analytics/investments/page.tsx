'use client';

import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Download } from 'lucide-react';

const MOCK_INVESTMENTS = [
  { period: '2024–2028', total: 1420, infra: 1120, rollingStock: 300, source: 'Фед. бюджет + ОАО «РЖД»' },
  { period: '2029–2033', total: 1000, infra: 830, rollingStock: 170, source: 'Фед. бюджет + концессия' },
  { period: '2034–2038', total: 6700, infra: 5800, rollingStock: 900, source: 'ГЧП + облигации' },
  { period: '2039–2050', total: 3280, infra: 2800, rollingStock: 480, source: 'ОАО «РЖД» + ГЧП' },
];

export default function InvestmentsPage() {
  const totalAll = MOCK_INVESTMENTS.reduce((s, i) => s + i.total, 0);

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <PageHeader
          title="Потребные инвестиции"
          description="Итоговая величина потребных инвестиций до 2050 года"
          breadcrumbs={[{ label: 'Аналитика', href: '/analytics' }, { label: 'Инвестиции' }]}
          actions={<Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /> Экспорт</Button>}
        />
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <DollarSign className="h-10 w-10 text-primary" />
                <div>
                  <p className="text-3xl font-bold text-foreground">{totalAll.toLocaleString('ru-RU')} млрд ₽</p>
                  <p className="text-sm text-muted-foreground">Суммарный объём капитальных вложений до 2050 года</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="space-y-3">
            {MOCK_INVESTMENTS.map((item, i) => (
              <Card key={i}>
                <CardHeader className="pb-2"><CardTitle className="text-sm">{item.period}</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div><p className="text-[10px] text-muted-foreground">Общие</p><p className="text-sm font-medium">{item.total} млрд ₽</p></div>
                    <div><p className="text-[10px] text-muted-foreground">Инфраструктура</p><p className="text-sm font-medium">{item.infra} млрд ₽</p></div>
                    <div><p className="text-[10px] text-muted-foreground">Подвижной состав</p><p className="text-sm font-medium">{item.rollingStock} млрд ₽</p></div>
                    <div><p className="text-[10px] text-muted-foreground">Источник</p><p className="text-sm">{item.source}</p></div>
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
