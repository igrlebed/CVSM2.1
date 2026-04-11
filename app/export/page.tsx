'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ExportPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/analytics/reports');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40">
      <p className="text-muted-foreground">Перенаправление в раздел отчётов...</p>
    </div>
  );
}
