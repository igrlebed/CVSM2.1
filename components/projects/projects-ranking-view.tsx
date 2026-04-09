'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { RouteBadge, StatusBadge } from '@/components/route-badge';
import { projects as allProjects, defaultRankingGroups, type RankingGroup } from '@/lib/data';
import type { RouteProject } from '@/lib/data';
import { Download, RotateCcw, ChevronDown, ChevronRight, Trophy, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectsRankingViewProps {
  onOpenCard: (project: RouteProject) => void;
  onExport: () => void;
}

type RankedItem = {
  project: RouteProject;
  score: number;
  groupScores: Record<string, number>;
};

type RankedProjects = {
  domestic: RankedItem[];
  international: RankedItem[];
};

export function ProjectsRankingView({ onOpenCard, onExport }: ProjectsRankingViewProps) {
  const [rankingGroups, setRankingGroups] = useState<RankingGroup[]>(defaultRankingGroups);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(rankingGroups.map(g => g.id));

  const toggleGroupEnabled = (groupId: string) => {
    setRankingGroups(prev => prev.map(g =>
      g.id === groupId ? { ...g, enabled: !g.enabled } : g
    ));
  };

  const updateGroupWeight = (groupId: string, weight: number) => {
    setRankingGroups(prev => prev.map(g =>
      g.id === groupId ? { ...g, weight } : g
    ));
  };

  const toggleGroupExpanded = (groupId: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const resetToDefaults = () => {
    setRankingGroups(defaultRankingGroups);
  };

  // Calculate rankings
  const rankedProjects = useMemo<RankedProjects>(() => {
    const activeProjects = allProjects.filter(p => p.status !== 'archived');
    const enabledGroups = rankingGroups.filter(g => g.enabled);

    if (enabledGroups.length === 0) {
      return { domestic: [], international: [] };
    }

    // Normalize weights to sum to 100
    const totalWeight = enabledGroups.reduce((sum, g) => sum + g.weight, 0);

    const scores: RankedItem[] = activeProjects.map(project => {
      let totalScore = 0;
      const groupScores: Record<string, number> = {};

      enabledGroups.forEach(group => {
        const normalizedGroupWeight = (group.weight / totalWeight) * 100;
        let groupScore = 0;

        group.criteria.filter(c => c.enabled).forEach(criterion => {
          let value = 0;
          switch (criterion.id) {
            case 'passenger-flow':
              value = project.passengerFlow;
              break;
            case 'trains-per-day':
              value = project.trainsPerDay || 0;
              break;
            case 'population-coverage':
              value = project.population;
              break;
            case 'route-length':
              value = project.length;
              break;
            case 'max-speed':
              value = project.maxSpeed || 0;
              break;
            case 'total-investment':
              // Lower investment is better, invert
              value = 10000 / (project.investment + 1);
              break;
            case 'infra-investment':
              value = 10000 / ((project.infraInvestment || 0) + 1);
              break;
            case 'rolling-stock-investment':
              value = 10000 / ((project.rollingStockInvestment || 0) + 1);
              break;
            case 'gdp-effect':
              value = project.gdpEffect;
              break;
            case 'jobs-created':
              value = project.jobsCreated || 0;
              break;
            case 'tax-revenue':
              value = project.taxRevenue || 0;
              break;
            case 'accessibility':
              value = project.accessibilityImprovement || 0;
              break;
          }
          groupScore += value * (criterion.weight / 100);
        });

        groupScores[group.id] = groupScore;
        totalScore += groupScore * (normalizedGroupWeight / 100);
      });

      return {
        project,
        score: totalScore,
        groupScores,
      };
    });

    // Sort by score descending, but separate international projects
    const domestic = scores.filter(s => !s.project.isInternational);
    const international = scores.filter(s => s.project.isInternational);

    domestic.sort((a, b) => b.score - a.score);
    international.sort((a, b) => b.score - a.score);

    return { domestic, international };
  }, [rankingGroups]);

  const enabledGroupsCount = rankingGroups.filter(g => g.enabled).length;

  return (
    <div className="flex gap-5 h-full">
      {/* Left criteria configuration panel */}
      <div className="w-[320px] bg-card rounded-2xl p-4 shrink-0 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Критерии ранжирования</h3>
          <Button variant="ghost" size="sm" onClick={resetToDefaults}>
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Сбросить
          </Button>
        </div>

        <div className="space-y-3">
          {rankingGroups.map(group => (
            <div
              key={group.id}
              className={cn(
                'rounded-xl border border-border overflow-hidden transition-colors',
                !group.enabled && 'opacity-60'
              )}
            >
              {/* Group header */}
              <div className="p-3 bg-secondary/30">
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="flex items-center gap-2 cursor-pointer flex-1"
                    onClick={() => toggleGroupExpanded(group.id)}
                  >
                    {expandedGroups.includes(group.id) ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm font-medium text-foreground">{group.label}</span>
                  </div>
                  <Switch
                    checked={group.enabled}
                    onCheckedChange={() => toggleGroupEnabled(group.id)}
                  />
                </div>

                {/* Weight slider */}
                {group.enabled && (
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-muted-foreground w-10">Вес:</span>
                    <Slider
                      value={[group.weight]}
                      onValueChange={([value]) => updateGroupWeight(group.id, value)}
                      min={0}
                      max={100}
                      step={5}
                      className="flex-1"
                    />
                    <span className="text-xs font-medium text-foreground w-8 text-right">
                      {group.weight}%
                    </span>
                  </div>
                )}
              </div>

              {/* Criteria list */}
              {expandedGroups.includes(group.id) && group.enabled && (
                <div className="p-3 pt-0 space-y-1.5">
                  {group.criteria.map(criterion => (
                    <div
                      key={criterion.id}
                      className="flex items-start gap-2 py-1.5"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-1.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-foreground">{criterion.label}</span>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {criterion.description}
                        </p>
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {criterion.weight}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right ranking results */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              Активных групп: {enabledGroupsCount} из {rankingGroups.length}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Экспорт
          </Button>
        </div>

        {/* Results */}
        {enabledGroupsCount === 0 ? (
          <div className="flex-1 bg-card rounded-2xl flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Невозможно рассчитать ранжирование
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Включите хотя бы одну группу критериев для расчёта рейтинга проектов
            </p>
          </div>
        ) : (
          <div className="flex-1 bg-card rounded-2xl overflow-hidden flex flex-col">
            <div className="overflow-y-auto flex-1 p-4">
              {/* Domestic projects */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Внутренние проекты
                </h4>
                <div className="space-y-2">
                  {rankedProjects.domestic?.map((item, index) => (
                    <RankingRow
                      key={item.project.id}
                      rank={index + 1}
                      project={item.project}
                      score={item.score}
                      groupScores={item.groupScores}
                      rankingGroups={rankingGroups}
                      onOpenCard={() => onOpenCard(item.project)}
                    />
                  ))}
                </div>
              </div>

              {/* International projects - separate section */}
              {rankedProjects.international && rankedProjects.international.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Международные проекты
                    </h4>
                    <div className="flex items-center gap-1 text-[10px] text-international-yellow bg-international-yellow-bg px-2 py-0.5 rounded-full">
                      <Info className="h-3 w-3" />
                      Особый статус
                    </div>
                  </div>
                  <div className="space-y-2">
                    {rankedProjects.international.map((item, index) => (
                      <RankingRow
                        key={item.project.id}
                        rank={index + 1}
                        project={item.project}
                        score={item.score}
                        groupScores={item.groupScores}
                        rankingGroups={rankingGroups}
                        onOpenCard={() => onOpenCard(item.project)}
                        isInternational
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Ranking row component
function RankingRow({
  rank,
  project,
  score,
  groupScores,
  rankingGroups,
  onOpenCard,
  isInternational = false,
}: {
  rank: number;
  project: RouteProject;
  score: number;
  groupScores: Record<string, number>;
  rankingGroups: RankingGroup[];
  onOpenCard: () => void;
  isInternational?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        'rounded-xl border border-border overflow-hidden transition-colors',
        isInternational && 'border-international-yellow/30 bg-international-yellow-bg/20'
      )}
    >
      <div
        className="flex items-center gap-4 p-3 cursor-pointer hover:bg-secondary/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Rank */}
        <div className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0',
          rank === 1 && !isInternational && 'bg-amber-100 text-amber-700',
          rank === 2 && !isInternational && 'bg-gray-100 text-gray-600',
          rank === 3 && !isInternational && 'bg-orange-100 text-orange-700',
          (rank > 3 || isInternational) && 'bg-secondary text-muted-foreground'
        )}>
          {rank === 1 && !isInternational ? <Trophy className="h-4 w-4" /> : rank}
        </div>

        {/* Project info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <RouteBadge type={project.type} size="sm" />
            <StatusBadge status={project.status} size="sm" />
          </div>
          <h4 className="text-sm font-medium text-foreground mt-1 truncate">{project.name}</h4>
        </div>

        {/* Score */}
        <div className="text-right shrink-0">
          <div className="text-lg font-semibold text-foreground">{score.toFixed(1)}</div>
          <div className="text-[10px] text-muted-foreground">баллов</div>
        </div>

        {/* Expand indicator */}
        {expanded ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-3 pb-3 pt-0">
          <div className="grid grid-cols-4 gap-2 mb-3">
            {rankingGroups.filter(g => g.enabled).map(group => (
              <div key={group.id} className="bg-secondary/50 rounded-lg p-2">
                <div className="text-[10px] text-muted-foreground truncate mb-0.5">{group.label}</div>
                <div className="text-sm font-medium text-foreground">
                  {groupScores[group.id]?.toFixed(1) || '0'}
                </div>
              </div>
            ))}
          </div>

          {/* Key metrics */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
            <span>{project.length.toLocaleString('ru-RU')} км</span>
            <span>{project.investment.toLocaleString('ru-RU')} млрд ₽</span>
            <span>{project.gdpEffect.toLocaleString('ru-RU')} млрд ₽ ВВП</span>
            <span>{project.passengerFlow} млн пасс/год</span>
          </div>

          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onOpenCard(); }}>
            Открыть карточку
          </Button>
        </div>
      )}
    </div>
  );
}
