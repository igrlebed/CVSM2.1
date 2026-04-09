import { cn } from "@/lib/utils"

export type ProjectType = "vsm" | "sm" | "international" | "implementation"

interface ProjectBadgeProps {
  type: ProjectType
  className?: string
}

const typeConfig: Record<ProjectType, { label: string; bgClass: string; textClass: string }> = {
  vsm: {
    label: "ВСМ",
    bgClass: "bg-vsm-orange-bg",
    textClass: "text-vsm-orange"
  },
  sm: {
    label: "СМ",
    bgClass: "bg-sm-blue-bg",
    textClass: "text-sm-blue"
  },
  international: {
    label: "Международный",
    bgClass: "bg-international-yellow-bg",
    textClass: "text-international-yellow"
  },
  implementation: {
    label: "В реализации",
    bgClass: "bg-implementation-green-bg",
    textClass: "text-implementation-green"
  }
}

export function ProjectBadge({ type, className }: ProjectBadgeProps) {
  const config = typeConfig[type]
  
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium",
      config.bgClass,
      config.textClass,
      className
    )}>
      {config.label}
    </span>
  )
}
