import { cn } from "@/lib/utils"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  change?: {
    value: string
    positive: boolean
  }
  subtitle?: string
  icon?: LucideIcon
  className?: string
}

export function StatCard({ title, value, change, subtitle, icon: Icon, className }: StatCardProps) {
  return (
    <div className={cn(
      "p-6 rounded-2xl bg-card",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-foreground tracking-tight">{value}</span>
            {change && (
              <span className={cn(
                "flex items-center text-sm font-medium",
                change.positive ? "text-implementation-green" : "text-destructive"
              )}>
                {change.positive ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {change.value}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="p-3 rounded-xl bg-secondary">
            <Icon className="w-5 h-5 text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  )
}
