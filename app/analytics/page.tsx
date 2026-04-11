'use client';

import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart3, TrendingUp, Calculator, FileText, Clock, Building2, DollarSign, Scale } from 'lucide-react';
import Link from 'next/link';

const SECTIONS = [
  { title: 'Дашборды', desc: 'Оперативные показатели и визуальная аналитика', icon: BarChart3, href: '/analytics/dashboards', color: 'text-blue-500' },
  { title: 'Панели показателей', desc: 'Ранжирование: показатели, веса, правила предпочтения', icon: TrendingUp, href: '/analytics/ranking', color: 'text-emerald-500' },
  { title: 'Отчёты и выгрузки', desc: 'Формирование отчётов в xlsx, docx, pdf', icon: FileText, href: '/analytics/reports', color: 'text-purple-500' },
  { title: 'Проекты до 2050', desc: 'Перечень и сроки реализации проектов', icon: Clock, href: '/analytics/timeline-2050', color: 'text-amber-500' },
  { title: 'Предварительное ТЭО', desc: 'Показатели технико-экономического обоснования', icon: Calculator, href: '/analytics/feasibility', color: 'text-cyan-500' },
  { title: 'Потребные инвестиции', desc: 'Итоговая величина капитальных вложений', icon: DollarSign, href: '/analytics/investments', color: 'text-orange-500' },
  { title: 'Эффективность', desc: 'Экономическая и социально-экономическая эффективность', icon: TrendingUp, href: '/analytics/effectiveness', color: 'text-pink-500' },
  { title: 'Орг. модель', desc: 'Организационно-правовая модель проектов', icon: Building2, href: '/analytics/org-model', color: 'text-indigo-500' },
];

export default function AnalyticsPage() {
  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="px-6 py-4 border-b border-border/40 bg-card">
          <h1 className="text-xl font-semibold text-foreground">Аналитика</h1>
          <p className="text-sm text-muted-foreground">Комплексная аналитическая отчётность и визуализация данных</p>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {SECTIONS.map(s => (
              <Card key={s.href} className="hover:shadow-md transition-shadow cursor-pointer">
                <Link href={s.href}>
                  <CardHeader className="pb-2">
                    <s.icon className={`h-6 w-6 mb-2 ${s.color}`} />
                    <CardTitle className="text-sm">{s.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{s.desc}</CardDescription>
                  </CardContent>
                </Link>
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
