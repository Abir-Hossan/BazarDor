import Link from "next/link";
import { formatBanglaNumber, formatBanglaPercentage } from "@/lib/bengali";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  const change = product.change ?? 0;
  const tone = change > 0
    ? "text-red-500 bg-red-50"
    : change < 0
      ? "text-emerald-600 bg-emerald-50"
      : "text-slate-500 bg-slate-50";

  return (
    <Link
      href={`/product/${encodeURIComponent(String(product.id))}`}
      className="card-hover block rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm focus-visible:ring-2 focus-visible:ring-[var(--green)]"
      aria-label={`${product.name} — বিস্তারিত দেখুন`}
    >
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#f1f6f2] text-2xl" aria-hidden="true">
          {product.emoji ?? "🛒"}
        </span>
        <div className="min-w-0">
          <h3 className="font-semibold leading-tight">{product.name}</h3>
          <p className="text-sm text-[var(--muted)]">{product.unit}</p>
        </div>
      </div>
      <div className="mt-5 flex items-end justify-between gap-2">
        <div>
          <p className="text-xs text-[var(--muted)]">আজকের দাম</p>
          <p className="mt-1 text-xl font-bold">
            {formatBanglaNumber(product.price)} <span className="text-sm font-medium">টাকা</span>
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>
          {change > 0 ? "▲" : change < 0 ? "▼" : "—"} {formatBanglaPercentage(change)}
        </span>
      </div>
    </Link>
  );
}
