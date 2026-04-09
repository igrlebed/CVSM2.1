"use client"

import { ProjectBadge, type ProjectType } from "@/components/project-badge"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

interface Project {
  id: string
  name: string
  type: ProjectType
  status: ProjectType
  region: string
  budget: string
  progress: number
  deadline: string
}

const projects: Project[] = [
  {
    id: "1",
    name: "ВСМ Москва — Санкт-Петербург",
    type: "vsm",
    status: "implementation",
    region: "ЦФО, СЗФО",
    budget: "1,7 трлн ₽",
    progress: 34,
    deadline: "2028"
  },
  {
    id: "2",
    name: "СМ Москва — Казань",
    type: "sm",
    status: "implementation",
    region: "ЦФО, ПФО",
    budget: "890 млрд ₽",
    progress: 12,
    deadline: "2030"
  },
  {
    id: "3",
    name: "Международный коридор Север — Юг",
    type: "international",
    status: "implementation",
    region: "ЮФО, СКФО",
    budget: "2,1 трлн ₽",
    progress: 8,
    deadline: "2032"
  },
  {
    id: "4",
    name: "ВСМ Москва — Екатеринбург",
    type: "vsm",
    status: "vsm",
    region: "ЦФО, УФО",
    budget: "4,2 трлн ₽",
    progress: 0,
    deadline: "2035"
  },
  {
    id: "5",
    name: "СМ Сочи — Краснодар",
    type: "sm",
    status: "sm",
    region: "ЮФО",
    budget: "320 млрд ₽",
    progress: 0,
    deadline: "2029"
  },
]

export function ProjectsTable() {
  return (
    <div className="rounded-2xl bg-card overflow-hidden">
      <div className="px-6 py-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Активные проекты</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Стратегические инфраструктурные проекты</p>
        </div>
        <Link 
          href="/projects"
          className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Все проекты
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-t border-border/50">
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Проект
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Тип
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Регион
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Бюджет
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Прогресс
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Срок
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-secondary/30 transition-colors">
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-foreground">{project.name}</span>
                </td>
                <td className="px-6 py-4">
                  <ProjectBadge type={project.type} />
                </td>
                <td className="px-6 py-4">
                  <ProjectBadge type={project.status} />
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-muted-foreground">{project.region}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-foreground">{project.budget}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 rounded-full bg-secondary overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-implementation-green transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">{project.progress}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-muted-foreground">{project.deadline}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
