'use client';

import { useState, createContext, useContext, ReactNode } from 'react';
import { AppHeader } from './app-header';

type Role = 'lpr' | 'analyst';

interface AppContextValue {
  role: Role;
  setRole: (role: Role) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppShell');
  }
  return context;
}

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [role, setRole] = useState<Role>('lpr');
  const [selectedYear, setSelectedYear] = useState(2050);

  return (
    <AppContext.Provider value={{ role, setRole, selectedYear, setSelectedYear }}>
      <div className="min-h-screen bg-background">
        <AppHeader role={role} onRoleChange={setRole} />
        <main>{children}</main>
      </div>
    </AppContext.Provider>
  );
}
