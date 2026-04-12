import { LoadingSkeleton } from '@/components/ui/states';

export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      <LoadingSkeleton rows={3} />
      <LoadingSkeleton rows={5} />
    </div>
  );
}
