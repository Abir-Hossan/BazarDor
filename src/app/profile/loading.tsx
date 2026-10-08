export default function Loading() {
  return (
    <div className="container-page max-w-3xl py-12">
      <div className="h-10 w-56 animate-pulse rounded-lg bg-white" />
      <div className="mt-3 h-5 w-80 max-w-full animate-pulse rounded bg-white" />
      <div className="mt-6 h-44 animate-pulse rounded-2xl border border-[var(--border)] bg-white" />
    </div>
  );
}
