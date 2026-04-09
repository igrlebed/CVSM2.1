'use client';

import { useState } from 'react';
import { 
  Globe, 
  CheckCircle, 
  AlertTriangle,
  Map,
  Eye,
  EyeOff,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Scenario } from '@/lib/data';

interface PublishScenarioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scenario: Scenario;
  onPublish?: (visibility: string) => void;
}

const checklistItems = [
  { id: 'validated', label: 'Все данные проверены и не содержат ошибок' },
  { id: 'reviewed', label: 'Сценарий прошёл внутреннее рассмотрение' },
  { id: 'approved', label: 'Получено одобрение ответственного лица' },
  { id: 'documented', label: 'Изменения задокументированы' },
];

const visibilityOptions = [
  { 
    id: 'approved', 
    label: 'Только утверждённые', 
    description: 'Маршруты со статусом "Утверждён" видны на общей карте',
    icon: CheckCircle,
  },
  { 
    id: 'in-development', 
    label: 'Включая в разработке', 
    description: 'Маршруты "В разработке" также видны на карте',
    icon: Eye,
  },
  { 
    id: 'experimental', 
    label: 'Все маршруты', 
    description: 'Включая экспериментальные проекты',
    icon: Map,
  },
];

export function PublishScenarioModal({ open, onOpenChange, scenario, onPublish }: PublishScenarioModalProps) {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<string>('approved');

  const allChecked = checklistItems.every(item => checkedItems.includes(item.id));

  const toggleItem = (id: string) => {
    setCheckedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handlePublish = () => {
    onPublish?.(visibility);
    onOpenChange(false);
    setCheckedItems([]);
  };

  // Count entities to be published
  const projectCount = scenario.projectIds.length;
  const approvedCount = 5; // Placeholder
  const inDevCount = 2; // Placeholder
  const experimentalCount = 1; // Placeholder

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Публикация сценария
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Summary */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-medium text-foreground mb-3">Сводка публикации</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Сценарий</span>
                <span className="font-medium text-foreground">{scenario.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Версия</span>
                <span className="font-medium text-foreground">v{scenario.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Проектов</span>
                <span className="font-medium text-foreground">{projectCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Протяжённость сети</span>
                <span className="font-medium text-foreground">{scenario.networkLength.toLocaleString('ru-RU')} км</span>
              </div>
            </div>
          </div>

          {/* Entities to be published */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-2">Публикуемые объекты</h3>
            <div className="rounded-lg border border-border divide-y divide-border">
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-implementation-green" />
                  <span className="text-sm">Утверждённые проекты</span>
                </div>
                <span className="text-sm font-medium">{approvedCount}</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">В разработке</span>
                </div>
                <span className="text-sm font-medium">{inDevCount}</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Экспериментальные</span>
                </div>
                <span className="text-sm font-medium">{experimentalCount}</span>
              </div>
            </div>
          </div>

          {/* Visibility selection */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-2">Видимость на карте</h3>
            <div className="space-y-2">
              {visibilityOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = visibility === option.id;
                
                return (
                  <div
                    key={option.id}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                      isSelected 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    )}
                    onClick={() => setVisibility(option.id)}
                  >
                    <div className={cn(
                      'flex h-5 w-5 items-center justify-center rounded-full border-2 mt-0.5',
                      isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                    )}>
                      {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">{option.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{option.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Confirmation checklist */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-2">Подтверждение</h3>
            <div className="space-y-2">
              {checklistItems.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 cursor-pointer"
                  onClick={() => toggleItem(item.id)}
                >
                  <Checkbox 
                    checked={checkedItems.includes(item.id)}
                    onCheckedChange={() => toggleItem(item.id)}
                  />
                  <span className="text-sm text-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button 
            onClick={handlePublish}
            disabled={!allChecked}
            className="gap-2"
          >
            <Globe className="h-4 w-4" />
            Опубликовать
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
