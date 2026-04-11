'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Download, ChevronDown, LogOut, Settings, Users, FileText, ShieldCheck, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import { usePermission } from '@/hooks/use-permission';
import { ROLE_LABELS } from '@/lib/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const navigation = [
  { name: 'Обзор', href: '/', permission: 'view:dashboard' },
  { name: 'Карта', href: '/map', permission: 'view:map' },
  { name: 'Проекты', href: '/projects', permission: 'view:projects' },
  { name: 'Конструктор', href: '/constructor', permission: 'view:constructor' },
];

export function AppHeader() {
  const { user, logout } = useAuth();
  const { can } = usePermission();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

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
            if (item.permission && !can(item.permission as any)) return null;

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

          <div className="h-8 w-px bg-border mx-2" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 gap-3 px-2 hover:bg-secondary/50">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>{user?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-left hidden md:flex">
                  <span className="text-sm font-medium leading-none">{user?.name}</span>
                  <Badge variant="secondary" className="mt-1 text-[10px] h-4 px-1 uppercase">
                    {user && user.roles.length > 0 ? user.roles.map(r => ROLE_LABELS[r]).join(', ') : ''}
                  </Badge>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user && user.roles.length > 0 ? user.roles.map(r => ROLE_LABELS[r]).join(', ') : ''}</p>
                </div>
              </div>
              <div className="h-px bg-border my-1" />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Личный кабинет</span>
                </Link>
              </DropdownMenuItem>
              
              {/* Admin section (only for admin role) */}
              {can('manage:users') && (
                <>
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Администрирование</div>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/users" className="cursor-pointer">
                      <Users className="mr-2 h-4 w-4" />
                      <span>Пользователи</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/roles" className="cursor-pointer">
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      <span>Роли и права</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/journal" className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Журнал событий</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/audit" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Аудит</span>
                    </Link>
                  </DropdownMenuItem>
                  <div className="h-px bg-border my-1" />
                </>
              )}
              
              <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Выйти</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
