"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { month: "Янв", completed: 12, planned: 15 },
  { month: "Фев", completed: 18, planned: 20 },
  { month: "Мар", completed: 24, planned: 25 },
  { month: "Апр", completed: 32, planned: 32 },
  { month: "Май", completed: 38, planned: 40 },
  { month: "Июн", completed: 45, planned: 48 },
  { month: "Июл", completed: 52, planned: 56 },
  { month: "Авг", completed: 58, planned: 64 },
  { month: "Сен", completed: 65, planned: 72 },
  { month: "Окт", completed: 70, planned: 80 },
  { month: "Ноя", completed: 0, planned: 88 },
  { month: "Дек", completed: 0, planned: 96 },
]

export function TimelineChart() {
  return (
    <div className="rounded-2xl bg-card p-6">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-foreground">Выполнение плана</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Сравнение плановых и фактических показателей</p>
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-implementation-green" />
          <span className="text-sm text-muted-foreground">Выполнено</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-muted-foreground/30" />
          <span className="text-sm text-muted-foreground">План</span>
        </div>
      </div>
      
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--implementation-green)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--implementation-green)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPlanned" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--muted-foreground)" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="var(--muted-foreground)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }}
              labelStyle={{ color: 'var(--foreground)', fontWeight: 600 }}
            />
            <Area 
              type="monotone" 
              dataKey="planned" 
              stroke="var(--muted-foreground)" 
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fillOpacity={1} 
              fill="url(#colorPlanned)" 
              name="План"
            />
            <Area 
              type="monotone" 
              dataKey="completed" 
              stroke="var(--implementation-green)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorCompleted)" 
              name="Выполнено"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
