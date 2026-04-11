"use client"

import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FolderKanban,
  Map,
  BarChart3,
  Settings,
  ChevronLeft,
  Train,
  Layers
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { usePermission } from "@/hooks/use-permission"

const navigation = [
  { name: "Обзор", href: "/", icon: LayoutDashboard },
  { name: "Проекты", href: "/projects", icon: FolderKanban },
  { name: "Карта", href: "/map", icon: Map },
  { name: "Аналитика", href: "/analytics", icon: BarChart3 },
  { name: "Конструктор", href: "/constructor", icon: Layers },
  { name: "Администрирование", href: "/admin/users", icon: Settings, permission: 'manage:users' },
]

export function Sidebar() {
  const { can } = usePermission()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-card border-r border-border/50 transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-border/50">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
          <Train className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground tracking-tight">Цифровая модель ВСМ</span>
            <span className="text-[11px] text-muted-foreground">Стратегическое планирование</span>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navigation.map((item) => {
          if (item.permission && !can(item.permission as any)) return null

          const isActive = pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Collapse Button */}
      <div className="py-4 px-3 border-t border-border/50">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors w-full"
        >
          <ChevronLeft className={cn(
            "w-5 h-5 shrink-0 transition-transform",
            collapsed && "rotate-180"
          )} />
          {!collapsed && <span>Свернуть</span>}
        </button>
      </div>
    </aside>
  )
}
