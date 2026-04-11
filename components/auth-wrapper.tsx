'use client';

import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { LoginScreen } from '@/components/login-screen';

export function AuthWrapper({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, needsPasswordChange } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && needsPasswordChange) {
      router.push('/auth/first-login');
    }
  }, [isAuthenticated, needsPasswordChange, router]);

  if (!user) {
    return <LoginScreen />;
  }

  if (needsPasswordChange) {
    return null; // redirecting
  }

  return <>{children}</>;
}
