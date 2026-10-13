export default function Loading() {
  return (
    <div className="container-page py-8">
      <div className="animate-pulse rounded-3xl bg-white p-8">
        <div className="h-20 w-20 rounded-2xl bg-slate-200" />
        <div className="mt-5 h-8 w-64 rounded bg-slate-200" />
        <div className="mt-8 h-40 rounded bg-slate-200" />
      </div>
    </div>
  );
}
