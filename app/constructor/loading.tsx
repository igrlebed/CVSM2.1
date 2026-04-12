import { LoadingSkeleton } from '@/components/ui/states';

export default function Loading() {
  return (
    <div className="p-6">
      <LoadingSkeleton rows={6} />
    </div>
  );
}
