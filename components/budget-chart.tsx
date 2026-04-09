"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { year: "2024", vsm: 120, sm: 80, international: 45 },
  { year: "2025", vsm: 280, sm: 150, international: 95 },
  { year: "2026", vsm: 420, sm: 220, international: 180 },
  { year: "2027", vsm: 380, sm: 290, international: 260 },
  { year: "2028", vsm: 320, sm: 340, international: 310 },
  { year: "2029", vsm: 180, sm: 280, international: 350 },
]

export function BudgetChart() {
  return (
    <div className="rounded-2xl bg-card p-6">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-foreground">Распределение бюджета</h2>
        <p className="text-sm text-muted-foreground mt-0.5">По типам проектов, млрд ₽</p>
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-vsm-orange" />
          <span className="text-sm text-muted-foreground">ВСМ</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-sm-blue" />
          <span className="text-sm text-muted-foreground">СМ</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-international-yellow" />
          <span className="text-sm text-muted-foreground">Международные</span>
        </div>
      </div>
      
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis 
              dataKey="year" 
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
            <Bar dataKey="vsm" fill="var(--vsm-orange)" radius={[4, 4, 0, 0]} name="ВСМ" />
            <Bar dataKey="sm" fill="var(--sm-blue)" radius={[4, 4, 0, 0]} name="СМ" />
            <Bar dataKey="international" fill="var(--international-yellow)" radius={[4, 4, 0, 0]} name="Международные" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
