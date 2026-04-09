"use client"

import { cn } from "@/lib/utils"
import { ProjectBadge, type ProjectType } from "@/components/project-badge"

interface Activity {
  id: string
  project: string
  projectType: ProjectType
  action: string
  timestamp: string
  user: string
}

const activities: Activity[] = [
  {
    id: "1",
    project: "ВСМ Москва — СПб",
    projectType: "vsm",
    action: "Обновлён прогресс строительства: 34%",
    timestamp: "2 часа назад",
    user: "А. Иванов"
  },
  {
    id: "2",
    project: "Коридор Север — Юг",
    projectType: "international",
    action: "Добавлен новый контракт на 12,5 млрд ₽",
    timestamp: "5 часов назад",
    user: "М. Петрова"
  },
  {
    id: "3",
    project: "СМ Москва — Казань",
    projectType: "sm",
    action: "Согласован план на 2025 год",
    timestamp: "вчера",
    user: "К. Сидоров"
  },
  {
    id: "4",
    project: "ВСМ Москва — Екатеринбург",
    projectType: "vsm",
    action: "Завершена предпроектная документация",
    timestamp: "вчера",
    user: "Е. Козлова"
  },
  {
    id: "5",
    project: "СМ Сочи — Краснодар",
    projectType: "sm",
    action: "Начата экологическая экспертиза",
    timestamp: "2 дня назад",
    user: "Д. Новиков"
  },
]

export function ActivityFeed() {
  return (
    <div className="rounded-2xl bg-card p-6">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-foreground">Последние события</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Активность по проектам</p>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div 
            key={activity.id}
            className={cn(
              "flex gap-4 pb-4",
              index !== activities.length - 1 && "border-b border-border/50"
            )}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-foreground truncate">{activity.project}</span>
                <ProjectBadge type={activity.projectType} />
              </div>
              <p className="text-sm text-muted-foreground">{activity.action}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-muted-foreground">{activity.user}</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
