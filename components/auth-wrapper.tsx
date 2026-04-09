'use client';

import React, { ReactNode } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { LoginScreen } from '@/components/login-screen';

export function AuthWrapper({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return <LoginScreen />;
  }

  return <>{children}</>;
}
