"use client"

import { cn } from "@/lib/utils"

interface Region {
  name: string
  projects: number
  budget: string
  percentage: number
}

const regions: Region[] = [
  { name: "Центральный ФО", projects: 8, budget: "2,4 трлн ₽", percentage: 32 },
  { name: "Северо-Западный ФО", projects: 4, budget: "1,1 трлн ₽", percentage: 15 },
  { name: "Приволжский ФО", projects: 5, budget: "980 млрд ₽", percentage: 13 },
  { name: "Южный ФО", projects: 6, budget: "1,5 трлн ₽", percentage: 20 },
  { name: "Уральский ФО", projects: 3, budget: "720 млрд ₽", percentage: 10 },
  { name: "Сибирский ФО", projects: 2, budget: "450 млрд ₽", percentage: 6 },
  { name: "Дальневосточный ФО", projects: 2, budget: "300 млрд ₽", percentage: 4 },
]

export function RegionsDistribution() {
  return (
    <div className="rounded-2xl bg-card p-6">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-foreground">Распределение по регионам</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Инвестиции в инфраструктуру по федеральным округам</p>
      </div>
      
      <div className="space-y-4">
        {regions.map((region) => (
          <div key={region.name} className="group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-foreground">{region.name}</span>
                <span className="text-xs text-muted-foreground">{region.projects} проектов</span>
              </div>
              <span className="text-sm font-medium text-foreground">{region.budget}</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  region.percentage >= 25 ? "bg-vsm-orange" :
                  region.percentage >= 15 ? "bg-sm-blue" :
                  region.percentage >= 10 ? "bg-international-yellow" :
                  "bg-muted-foreground/40"
                )}
                style={{ width: `${region.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
