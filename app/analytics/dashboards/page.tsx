'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40">
      <p className="text-muted-foreground">Перенаправление в обзор...</p>
    </div>
  );
}
