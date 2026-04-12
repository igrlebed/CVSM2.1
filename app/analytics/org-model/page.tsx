'use client';

import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Download, Scale } from 'lucide-react';

export default function OrgModelPage() {
  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <PageHeader
          title="Организационно-правовая модель"
          description="Модель управления проектами организации высокоскоростного движения"
          breadcrumbs={[{ label: 'Аналитика', href: '/analytics' }, { label: 'Орг. модель' }]}
          actions={<Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /> Экспорт</Button>}
        />
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" /> Модель управления</CardTitle>
              <CardDescription>
                Организационно-правовая модель определяет схему финансирования, управления и реализации проектов развития сети ВСМ.
              </CardDescription>
            </CardHeader>
          </Card>

          {[
            { title: 'Федеральный бюджет', desc: 'Прямое финансирование из федерального бюджета для проектов стратегического значения', share: '35%' },
            { title: 'ОАО «РЖД»', desc: 'Собственные средства компании, заёмное финансирование', share: '25%' },
            { title: 'ГЧП / Концессия', desc: 'Государственно-частное партнёрство, концессионные соглашения', share: '30%' },
            { title: 'Облигационные займы', desc: 'Выпуск инфраструктурных облигаций', share: '10%' },
          ].map((item, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                  <span className="text-lg font-bold text-primary">{item.share}</span>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2"><Scale className="h-4 w-4 text-amber-500" /> Правовое регулирование</CardTitle>
              <CardDescription>
                Реализация проектов ВСМ требует изменения нормативно-правовой базы в сфере железнодорожного транспорта, градостроительства и землепользования.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        <div className="px-6 py-2 border-t border-border/40 bg-card/50">
          <p className="text-[10px] text-muted-foreground">Цифровая модель ВСМ • Версия 0.1.0 • ОАО «РЖД»</p>
        </div>
      </div>
    </AppShell>
  );
}
