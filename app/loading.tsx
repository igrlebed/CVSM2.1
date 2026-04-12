import { LoadingSkeleton } from '@/components/ui/states';

export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
      <LoadingSkeleton rows={4} />
    </div>
  );
}
