'use client';

import { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { KPICard } from '@/components/kpi-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Download, Calendar, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { kpiData } from '@/lib/data';
import { usePermission } from '@/hooks/use-permission';

const SYSTEM_VERSION = '0.1.0';

export default function DashboardsPage() {
  const { can } = usePermission();
  const [period, setPeriod] = useState('2050');
  const [isLoading, setIsLoading] = useState(false);
  const [screenshotStatus, setScreenshotStatus] = useState<'idle' | 'loading' | 'ready'>('idle');

  const handleScreenshot = async () => {
    setIsLoading(true);
    setScreenshotStatus('loading');
    // Имитация формирования скриншота
    await new Promise(r => setTimeout(r, 2000));
    setScreenshotStatus('ready');
    setIsLoading(false);
    // Автосброс через 5 секунд
    setTimeout(() => setScreenshotStatus('idle'), 5000);
  };

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border/40 bg-card">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">Дашборды</h1>
              <p className="text-sm text-muted-foreground">Оперативные показатели развития сети ВСМ</p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[180px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2035">До 2035 года</SelectItem>
                  <SelectItem value="2040">До 2040 года</SelectItem>
                  <SelectItem value="2050">До 2050 года</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={handleScreenshot}
                disabled={isLoading}
                className="gap-2"
              >
                {screenshotStatus === 'loading' ? (
                  <>Формирование...</>
                ) : screenshotStatus === 'ready' ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Готово
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4" />
                    Скриншот HQ
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* KPI Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <KPICard
              label={kpiData.gdpGrowth.label}
              value={kpiData.gdpGrowth.value}
              unit={kpiData.gdpGrowth.unit}
              description={kpiData.gdpGrowth.description}
              trend={{ value: 12.4, direction: 'up' }}
            />
            <KPICard
              label={kpiData.investment.label}
              value={kpiData.investment.value}
              unit={kpiData.investment.unit}
              description={kpiData.investment.description}
            />
            <KPICard
              label={kpiData.passengerFlow.label}
              value={kpiData.passengerFlow.value}
              unit={kpiData.passengerFlow.unit}
              description={kpiData.passengerFlow.description}
              trend={{ value: 8.2, direction: 'up' }}
            />
            <KPICard
              label={kpiData.population.label}
              value={kpiData.population.value}
              unit={kpiData.population.unit}
              description={kpiData.population.description}
            />
            <KPICard
              label={kpiData.networkLength.label}
              value={kpiData.networkLength.value}
              unit={kpiData.networkLength.unit}
              description={kpiData.networkLength.description}
            />
            <KPICard
              label={kpiData.rollingStock.label}
              value={kpiData.rollingStock.value}
              unit={kpiData.rollingStock.unit}
              description={kpiData.rollingStock.description}
            />
          </div>

          {/* Analytics panels */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Динамика инвестиций
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-muted/30 rounded-lg flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Диаграмма инвестиций по годам</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  Сигналы и статусы
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { status: 'success' as const, text: 'МСК-СПБ: этап 1 завершён в срок' },
                    { status: 'warning' as const, text: 'МСК-Казань: риск отставания на 2 кв.' },
                    { status: 'info' as const, text: 'МСК-Екатеринбург: обновление данных' },
                    { status: 'pending' as const, text: 'МСК-Адлер: ожидание согласования' },
                  ].map((signal, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/30">
                      <Badge variant={signal.status === 'success' ? 'default' : 'secondary'} className="text-[10px] h-5">
                        {signal.status === 'success' ? '✓' : signal.status === 'warning' ? '!' : 'i'}
                      </Badge>
                      <span className="text-muted-foreground">{signal.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Export panel */}
          <Card className="mt-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Download className="h-4 w-4 text-primary" />
                Выгрузка отчёта
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Excel (.xlsx)
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Word (.docx)
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer with version */}
        <div className="px-6 py-2 border-t border-border/40 bg-card/50">
          <p className="text-[10px] text-muted-foreground">Цифровая модель ВСМ · Версия {SYSTEM_VERSION} · ОАО «РЖД»</p>
        </div>
      </div>
    </AppShell>
  );
}
