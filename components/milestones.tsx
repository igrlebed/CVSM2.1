"use client"

import { cn } from "@/lib/utils"
import { CheckCircle2, Circle, Clock } from "lucide-react"

type MilestoneStatus = "completed" | "in-progress" | "upcoming"

interface Milestone {
  id: string
  title: string
  project: string
  date: string
  status: MilestoneStatus
}

const milestones: Milestone[] = [
  {
    id: "1",
    title: "Завершение проектирования участка 1",
    project: "ВСМ Москва — СПб",
    date: "15 окт 2024",
    status: "completed"
  },
  {
    id: "2",
    title: "Подписание контракта с подрядчиком",
    project: "Коридор Север — Юг",
    date: "28 окт 2024",
    status: "completed"
  },
  {
    id: "3",
    title: "Начало строительства моста",
    project: "СМ Москва — Казань",
    date: "10 ноя 2024",
    status: "in-progress"
  },
  {
    id: "4",
    title: "Экспертиза проектной документации",
    project: "ВСМ Москва — Екатеринбург",
    date: "25 ноя 2024",
    status: "upcoming"
  },
  {
    id: "5",
    title: "Утверждение бюджета на 2025",
    project: "Общий",
    date: "15 дек 2024",
    status: "upcoming"
  },
]

const statusConfig: Record<MilestoneStatus, { icon: typeof CheckCircle2; className: string }> = {
  completed: {
    icon: CheckCircle2,
    className: "text-implementation-green"
  },
  "in-progress": {
    icon: Clock,
    className: "text-vsm-orange"
  },
  upcoming: {
    icon: Circle,
    className: "text-muted-foreground"
  }
}

export function Milestones() {
  return (
    <div className="rounded-2xl bg-card p-6">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-foreground">Ключевые вехи</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Ближайшие контрольные точки</p>
      </div>
      
      <div className="space-y-4">
        {milestones.map((milestone, index) => {
          const StatusIcon = statusConfig[milestone.status].icon
          
          return (
            <div 
              key={milestone.id}
              className={cn(
                "flex gap-3 pb-4",
                index !== milestones.length - 1 && "border-b border-border/50"
              )}
            >
              <StatusIcon className={cn("w-5 h-5 mt-0.5 shrink-0", statusConfig[milestone.status].className)} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{milestone.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{milestone.project}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{milestone.date}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
