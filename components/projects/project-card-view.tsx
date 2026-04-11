'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RouteBadge, StatusBadge } from '@/components/route-badge';
import type { RouteProject } from '@/lib/data';
import { 
  ArrowLeft, Map, GitCompareArrows, Pencil, Download, History, 
  TrendingUp, Banknote, Users, Train, MapPin, Gauge, 
  Building2, Mountain, Route as RouteIcon, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectCardViewProps {
  project: RouteProject;
  onBack: () => void;
  onShowOnMap: () => void;
  onAddToCompare: () => void;
  onOpenInConstructor: () => void;
  onExport: () => void;
  isInCompare?: boolean;
}

type CardTab = 'overview' | 'passenger' | 'socioeconomic' | 'investment' | 'traffic' | 'population' | 'technical' | 'history';

const tabs: { id: CardTab; label: string }[] = [
  { id: 'overview', label: 'Обзор' },
  { id: 'passenger', label: 'Пассажиропоток' },
  { id: 'socioeconomic', label: 'Социально-экономические эффекты' },
  { id: 'investment', label: 'Инвестиции' },
  { id: 'traffic', label: 'Размеры движения' },
  { id: 'population', label: 'Охват населения' },
  { id: 'technical', label: 'Технические параметры' },
  { id: 'history', label: 'История изменений' },
];

export function ProjectCardView({
  project,
  onBack,
  onShowOnMap,
  onAddToCompare,
  onOpenInConstructor,
  onExport,
  isInCompare = false,
}: ProjectCardViewProps) {
  const [activeTab, setActiveTab] = useState<CardTab>('overview');

  return (
    <div className="flex gap-5 h-full">
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Проекты
          </button>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm text-foreground font-medium">{project.name}</span>
        </div>

        {/* Header */}
        <div className="bg-card rounded-2xl p-5 mb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <RouteBadge type={project.type} size="md" />
                <StatusBadge status={project.status} size="md" />
                {project.isInternational && (
                  <span className="text-xs px-2 py-0.5 bg-international-yellow-bg text-international-yellow rounded-full">
                    Международный
                  </span>
                )}
                {project.hasMissingData && (
                  <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full">
                    Неполные данные
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-semibold text-foreground mb-1">{project.name}</h1>
              <p className="text-sm text-muted-foreground">
                {project.startYear} – {project.endYear} гг. • {project.endYear - project.startYear} лет реализации
              </p>
            </div>

            {/* Mini map preview */}
            <div className="w-[180px] h-[100px] bg-secondary rounded-xl flex items-center justify-center shrink-0">
              <div className="text-center">
                <MapPin className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
                <span className="text-xs text-muted-foreground">Превью карты</span>
              </div>
            </div>
          </div>

          {/* KPI row */}
          <div className="grid grid-cols-6 gap-3">
            <KpiItem icon={MapPin} label="Протяжённость" value={`${project.length.toLocaleString('ru-RU')} км`} />
            <KpiItem icon={TrendingUp} label="Вклад в ВВП" value={`${project.gdpEffect.toLocaleString('ru-RU')} млрд ₽`} />
            <KpiItem icon={Banknote} label="Инвестиции" value={`${project.investment.toLocaleString('ru-RU')} млрд ₽`} />
            <KpiItem icon={Users} label="Пассажиропоток" value={`${project.passengerFlow} млн/год`} />
            <KpiItem icon={Users} label="Охват населения" value={`${project.population} млн чел`} />
            <KpiItem icon={Train} label="Потребный парк" value={`${project.rollingStock} составов`} />
          </div>

          {/* Map CTA */}
          <Button variant="outline" size="sm" onClick={onShowOnMap} className="mt-4">
            <Map className="h-4 w-4 mr-2" />
            Показать на карте
          </Button>
        </div>

        {/* Tabs */}
        <div className="bg-card rounded-2xl flex-1 flex flex-col overflow-hidden">
          <div className="border-b border-border px-1 pt-1">
            <div className="flex gap-1 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'px-3 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap',
                    activeTab === tab.id
                      ? 'bg-secondary text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-5">
            {activeTab === 'overview' && <OverviewTab project={project} />}
            {activeTab === 'passenger' && <PassengerTab project={project} />}
            {activeTab === 'socioeconomic' && <SocioeconomicTab project={project} />}
            {activeTab === 'investment' && <InvestmentTab project={project} />}
            {activeTab === 'traffic' && <TrafficTab project={project} />}
            {activeTab === 'population' && <PopulationTab project={project} />}
            {activeTab === 'technical' && <TechnicalTab project={project} />}
            {activeTab === 'history' && <HistoryTab project={project} />}
          </div>
        </div>
      </div>

      {/* Action panel */}
      <div className="w-[220px] shrink-0">
        <div className="bg-card rounded-2xl p-4 sticky top-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Действия
          </h3>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start" onClick={onShowOnMap}>
              <Map className="h-4 w-4 mr-2" />
              Показать на карте
            </Button>
            <Button
              variant={isInCompare ? 'secondary' : 'outline'}
              size="sm"
              className="w-full justify-start"
              onClick={onAddToCompare}
            >
              <GitCompareArrows className="h-4 w-4 mr-2" />
              {isInCompare ? 'В сравнении' : 'К сравнению'}
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start whitespace-normal h-auto py-2 text-left" onClick={onOpenInConstructor}>
              <Pencil className="h-4 w-4 mr-2 shrink-0" />
              <span className="leading-tight">Открыть в конструкторе</span>
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Экспортировать
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" onClick={() => setActiveTab('history')}>
              <History className="h-4 w-4 mr-2" />
              История изменений
            </Button>
          </div>

          {/* Meta info */}
          <div className="mt-6 pt-4 border-t border-border space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Источник</span>
              <span className="text-foreground">{project.dataSource}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Обновлено</span>
              <span className="text-foreground">
                {project.lastUpdated ? new Date(project.lastUpdated).toLocaleDateString('ru-RU') : '—'}
              </span>
            </div>
            {project.scenarios && (
              <div className="text-xs">
                <span className="text-muted-foreground">Сценарии:</span>
                <div className="text-foreground mt-0.5">{project.scenarios.join(', ')}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// KPI item component
function KpiItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="bg-secondary/50 rounded-xl p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-[10px] text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}

// Tab components
function OverviewTab({ project }: { project: RouteProject }) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Общая информация</h3>
        <div className="grid grid-cols-2 gap-4">
          <InfoRow label="Тип проекта" value={project.type === 'vsm' ? 'ВСМ' : project.type === 'sm' ? 'СМ' : project.type === 'international' ? 'Международный' : 'В реализации'} />
          <InfoRow label="Статус" value={project.status === 'approved' ? 'Утверждён' : project.status === 'in-progress' ? 'В реализации' : project.status === 'in-development' ? 'В разработке' : project.status === 'experimental' ? 'Экспериментальный' : 'Архивный'} />
          <InfoRow label="Год начала" value={`${project.startYear} г.`} />
          <InfoRow label="Год завершения" value={`${project.endYear} г.`} />
          <InfoRow label="Срок реализации" value={`${project.endYear - project.startYear} лет`} />
          <InfoRow label="Этапность" value={project.isStaged ? `${project.stages?.length} этапа` : 'Без этапов'} />
        </div>
      </div>

      {/* Stages */}
      {project.stages && project.stages.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Этапы реализации</h3>
          <div className="space-y-2">
            {project.stages.map((stage, index) => (
              <div key={index} className="flex items-center justify-between bg-secondary/50 rounded-lg px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground">{stage.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">{stage.length} км</span>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{stage.year} г.</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Linked scenarios */}
      {project.scenarios && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Связанные сценарии</h3>
          <div className="flex flex-wrap gap-2">
            {project.scenarios.map(scenario => (
              <span key={scenario} className="px-3 py-1.5 bg-secondary rounded-lg text-sm text-foreground">
                {scenario}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PassengerTab({ project }: { project: RouteProject }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <MetricCard
          icon={Users}
          label="Годовой пассажиропоток"
          value={`${project.passengerFlow} млн`}
          subtext="человек в год"
        />
        <MetricCard
          icon={Train}
          label="Поездов в сутки"
          value={`${project.trainsPerDay || '—'}`}
          subtext="пар поездов"
        />
        <MetricCard
          icon={Clock}
          label="Время в пути"
          value="2ч 15м"
          subtext="прогнозное"
        />
      </div>

      {/* Chart placeholder */}
      <div className="bg-secondary/30 rounded-xl p-6 h-[200px] flex items-center justify-center">
        <span className="text-sm text-muted-foreground">График динамики пассажиропотока</span>
      </div>
    </div>
  );
}

function SocioeconomicTab({ project }: { project: RouteProject }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          icon={TrendingUp}
          label="Вклад в ВВП"
          value={`${project.gdpEffect.toLocaleString('ru-RU')}`}
          subtext="млрд ₽"
        />
        <MetricCard
          icon={Users}
          label="Рабочие места"
          value={`${(project.jobsCreated || 0).toLocaleString('ru-RU')}`}
          subtext="человек"
        />
        <MetricCard
          icon={Banknote}
          label="Налоговые поступления"
          value={`${project.taxRevenue || '—'}`}
          subtext="млрд ₽"
        />
        <MetricCard
          icon={TrendingUp}
          label="Рост доступности"
          value={`${project.accessibilityImprovement || '—'}%`}
          subtext="улучшение"
        />
      </div>

      {/* Interpretation */}
      <div className="bg-secondary/30 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-foreground mb-2">Интерпретация</h4>
        <p className="text-sm text-muted-foreground">
          Реализация проекта позволит создать {(project.jobsCreated || 0).toLocaleString('ru-RU')} рабочих мест 
          и обеспечить прирост ВВП на {project.gdpEffect.toLocaleString('ru-RU')} млрд рублей. 
          Транспортная доступность территорий тяготения увеличится на {project.accessibilityImprovement || '—'}%.
        </p>
      </div>
    </div>
  );
}

function InvestmentTab({ project }: { project: RouteProject }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <MetricCard
          icon={Banknote}
          label="Общий объём"
          value={`${project.investment.toLocaleString('ru-RU')}`}
          subtext="млрд ₽"
        />
        <MetricCard
          icon={Building2}
          label="Инфраструктура"
          value={`${(project.infraInvestment || 0).toLocaleString('ru-RU')}`}
          subtext="млрд ₽"
        />
        <MetricCard
          icon={Train}
          label="Подвижной состав"
          value={`${(project.rollingStockInvestment || 0).toLocaleString('ru-RU')}`}
          subtext="млрд ₽"
        />
      </div>

      {/* Chart placeholder */}
      <div className="bg-secondary/30 rounded-xl p-6 h-[200px] flex items-center justify-center">
        <span className="text-sm text-muted-foreground">График динамики инвестиций по годам</span>
      </div>
    </div>
  );
}

function TrafficTab({ project }: { project: RouteProject }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <MetricCard
          icon={Train}
          label="Поездов в сутки"
          value={`${project.trainsPerDay || '—'}`}
          subtext="пар"
        />
        <MetricCard
          icon={Train}
          label="Потребный парк"
          value={`${project.rollingStock}`}
          subtext="составов"
        />
        <MetricCard
          icon={Gauge}
          label="Максимальная скорость"
          value={`${project.maxSpeed || '—'}`}
          subtext="км/ч"
        />
      </div>
    </div>
  );
}

function PopulationTab({ project }: { project: RouteProject }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          icon={Users}
          label="Численность населения"
          value={`${project.population}`}
          subtext="млн человек"
        />
        <MetricCard
          icon={MapPin}
          label="Количество остановок"
          value={`${project.stops || '—'}`}
          subtext="станций"
        />
      </div>
    </div>
  );
}

function TechnicalTab({ project }: { project: RouteProject }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <MetricCard icon={RouteIcon} label="Протяжённость" value={`${project.length.toLocaleString('ru-RU')}`} subtext="км" />
        <MetricCard icon={Gauge} label="Максимальная скорость" value={`${project.maxSpeed || '—'}`} subtext="км/ч" />
        <MetricCard icon={MapPin} label="Остановки" value={`${project.stops || '—'}`} subtext="станций" />
        <MetricCard icon={Building2} label="Мосты" value={`${project.bridges || '—'}`} subtext="сооружений" />
        <MetricCard icon={Mountain} label="Тоннели" value={`${project.tunnels || '—'}`} subtext="сооружений" />
        <MetricCard icon={RouteIcon} label="Эстакады" value={`${project.viaducts || '—'}`} subtext="сооружений" />
      </div>
    </div>
  );
}

function HistoryTab({ project }: { project: RouteProject }) {
  // Mock history data
  const historyItems = [
    { date: '2026-03-15', source: 'ОАО «РЖД»', changeType: 'Обновление данных', comment: 'Уточнены показатели пассажиропотока', version: '3.2' },
    { date: '2026-02-20', source: 'Минтранс', changeType: 'Корректировка сроков', comment: 'Изменён год завершения проекта', version: '3.1' },
    { date: '2026-01-10', source: 'ОАО «РЖД»', changeType: 'Обновление инвестиций', comment: 'Уточнён объём капитальных вложений', version: '3.0' },
    { date: '2025-11-05', source: 'НИИ транспорта', changeType: 'Технические параметры', comment: 'Добавлены данные по инженерным сооружениям', version: '2.5' },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-secondary/30 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Дата</th>
              <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Источник</th>
              <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Тип изменения</th>
              <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Комментарий</th>
              <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Версия</th>
            </tr>
          </thead>
          <tbody>
            {historyItems.map((item, index) => (
              <tr key={index} className="border-b border-border last:border-0">
                <td className="p-3 text-sm text-foreground">{new Date(item.date).toLocaleDateString('ru-RU')}</td>
                <td className="p-3 text-sm text-foreground">{item.source}</td>
                <td className="p-3 text-sm text-foreground">{item.changeType}</td>
                <td className="p-3 text-sm text-muted-foreground">{item.comment}</td>
                <td className="p-3 text-sm text-muted-foreground">v{item.version}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Helper components
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-border">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, subtext }: { icon: React.ElementType; label: string; value: string; subtext: string }) {
  return (
    <div className="bg-secondary/50 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="text-2xl font-semibold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground">{subtext}</div>
    </div>
  );
}
