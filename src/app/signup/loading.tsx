export default function Loading() {
  return (
    <div className="container-page flex min-h-[720px] items-center justify-center py-10">
      <div className="w-full max-w-[520px]">
        <div className="mx-auto h-10 w-56 animate-pulse rounded bg-white" />
        <div className="mx-auto mt-3 h-5 w-80 max-w-full animate-pulse rounded bg-white" />
        <div className="mt-6 h-[500px] animate-pulse rounded-2xl border border-[var(--border)] bg-white" />
      </div>
    </div>
  );
}
