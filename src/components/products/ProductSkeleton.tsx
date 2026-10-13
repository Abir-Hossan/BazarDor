export function ProductSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-[var(--border)] bg-white p-4">
      <div className="flex gap-3">
        <div className="h-11 w-11 rounded-xl bg-slate-200" />
        <div className="flex-1">
          <div className="h-4 w-32 rounded bg-slate-200" />
          <div className="mt-2 h-3 w-20 rounded bg-slate-200" />
        </div>
      </div>
      <div className="mt-6 h-7 w-24 rounded bg-slate-200" />
    </div>
  );
}
