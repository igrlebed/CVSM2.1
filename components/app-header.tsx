'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Download, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Обзор сети', href: '/' },
  { name: 'Карта сети', href: '/map' },
  { name: 'Проекты', href: '/projects' },
  { name: 'Конструктор', href: '/constructor' },
  { name: 'Архив', href: '/archive' },
  { name: 'Экспорт', href: '/export' },
];

interface AppHeaderProps {
  role: 'lpr' | 'analyst';
  onRoleChange: (role: 'lpr' | 'analyst') => void;
}

const roleLabels = {
  lpr: 'ЛПР',
  analyst: 'Аналитик',
} as const;

export function AppHeader({ role, onRoleChange }: AppHeaderProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use a stable initial value for SSR to prevent hydration mismatch
  const displayRole = mounted ? roleLabels[role] : '\u00A0\u00A0\u00A0';

  return (
    <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left: System title */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              className="h-5 w-5 text-primary-foreground"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
              <line x1="4" x2="4" y1="22" y2="15" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-tight text-foreground">
              Цифровая модель ВСМ
            </span>
            <span className="text-[10px] text-muted-foreground leading-tight">
              Стратегическое планирование
            </span>
          </div>
        </div>

        {/* Center: Navigation */}
        <nav className="flex items-center gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Search className="h-4 w-4" />
            <span className="sr-only">Поиск</span>
          </Button>
          
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Download className="h-4 w-4" />
            <span className="sr-only">Экспорт</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-2">
                <span className="text-xs font-medium min-w-[60px] text-center">
                  {displayRole}
                </span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onRoleChange('lpr')}>
                <span className="font-medium">ЛПР</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  Лицо, принимающее решения
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRoleChange('analyst')}>
                <span className="font-medium">Аналитик</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  Анализ и сравнение
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
