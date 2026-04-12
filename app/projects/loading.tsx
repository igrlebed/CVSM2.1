import { LoadingTableSkeleton } from '@/components/ui/states';

export default function Loading() {
  return (
    <div className="p-6">
      <LoadingTableSkeleton rows={8} cols={6} />
    </div>
  );
}
