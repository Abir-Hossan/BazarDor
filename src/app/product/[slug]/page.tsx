import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getProduct } from "@/lib/api";
import { formatBanglaNumber, formatBanglaPercentage } from "@/lib/bengali";
import { PriceSummary } from "@/components/products/PriceSummary";
import { MarketPriceTable } from "@/components/products/MarketPriceTable";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    const callbackUrl = `/product/${encodeURIComponent(slug)}`;
    redirect(
      `/signin?callbackUrl=${encodeURIComponent(callbackUrl)}&authRequired=1`,
    );
  }

  const product = await getProduct(slug);
  if (!product) notFound();

  const values = product.markets
    .flatMap((market) => [market.min, market.max])
    .filter((value): value is number => value !== null);
  const avgs = product.markets
    .map((market) => market.avg)
    .filter((value): value is number => value !== null);
  const min = values.length ? Math.min(...values) : product.price;
  const max = values.length ? Math.max(...values) : product.price;
  const avg = avgs.length
    ? avgs.reduce((sum, value) => sum + value, 0) / avgs.length
    : product.price;
  const change = product.change ?? 0;

  return (
    <div className="container-page py-8">
      <div className="mb-5 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--green)]">
          হোম
        </Link>
        <span className="mx-2">›</span>
        <Link
          href={`/category/${encodeURIComponent(product.categorySlug)}`}
          className="hover:text-[var(--green)]"
        >
          {product.categoryName}
        </Link>
        <span className="mx-2">›</span>
        <span>{product.name}</span>
      </div>

      <section className="rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <span className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-[#f1f6f2] text-5xl">
              {product.emoji ?? "🛒"}
            </span>

            <div className="min-w-0">
              <h1 className="text-2xl font-bold sm:text-3xl">{product.name}</h1>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {product.unit} · {product.categoryName}
              </p>
              <p className="mt-3 text-sm text-[var(--muted)]">
                গতকালের তুলনায় আজকের দামের পরিবর্তন
              </p>
            </div>
          </div>

          <div className="shrink-0 rounded-2xl bg-[#f1f6f2] px-6 py-4 text-center sm:min-w-32">
            <p className="text-sm text-[var(--muted)]">আজকের দাম</p>
            <p className="text-3xl font-bold">
              {formatBanglaNumber(product.price)}
            </p>
            <p className="text-sm text-[var(--muted)]">টাকা / {product.unit}</p>
            <p
              className={`mt-1 text-sm font-semibold ${
                change > 0
                  ? "text-red-500"
                  : change < 0
                    ? "text-emerald-600"
                    : "text-slate-500"
              }`}
            >
              {change > 0 ? "▲" : change < 0 ? "▼" : "—"}{" "}
              {formatBanglaPercentage(Math.abs(change))}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-2xl font-bold">দামের সারসংক্ষেপ</h2>
          <PriceSummary min={min} max={max} avg={avg} />
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-2xl font-bold">বাজারভিত্তিক আজকের দাম</h2>
          {product.markets.length ? (
            <MarketPriceTable markets={product.markets} />
          ) : (
            <div className="rounded-xl bg-slate-50 p-6 text-center text-[var(--muted)]">
              এই পণ্যের বাজারভিত্তিক তথ্য পাওয়া যায়নি।
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
