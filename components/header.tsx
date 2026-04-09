"use client"

import { Search, Calendar, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="flex items-center justify-between h-16 px-8 bg-card border-b border-border/50">
      <div>
        <h1 className="text-lg font-semibold text-foreground tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Поиск проектов..."
            className="w-64 pl-9 h-9 bg-secondary border-0 text-sm"
          />
        </div>
        
        {/* Date Filter */}
        <Button variant="outline" className="h-9 gap-2 text-sm border-border/50 bg-card">
          <Calendar className="w-4 h-4" />
          <span>2024 год</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </Button>
      </div>
    </header>
  )
}
