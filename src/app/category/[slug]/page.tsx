import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getCategory, getProducts } from "@/lib/api";
import { sortByPrice } from "@/lib/utils";
import { ProductGrid } from "@/components/products/ProductGrid";
import { SortDropdown } from "@/components/products/SortDropdown";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(slug),
  ]);
  const category = categories.find((item) => item.slug === slug) ?? (await getCategory(slug));
  const resolvedCategory = category;

  if (!resolvedCategory && products.length === 0) notFound();

  const sorted =
    sp.sort === "asc"
      ? sortByPrice(products, "asc")
      : sp.sort === "desc"
        ? sortByPrice(products, "desc")
        : products;

  return (
    <div className="container-page py-8">
      <div className="mb-6 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--green)]">হোম</Link>
        <span className="mx-2">›</span>
        <span>{resolvedCategory?.name ?? slug}</span>
      </div>

      <section className="rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[#f1f6f2] text-4xl">
            {resolvedCategory?.icon ?? "🛒"}
          </span>
          <div>
            <h1 className="text-3xl font-bold">{resolvedCategory?.name ?? slug}</h1>
            <p className="mt-1 text-[var(--muted)]">
              {new Intl.NumberFormat("bn-BD").format(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
            </p>
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-3xl border border-[var(--border)] bg-white p-4 sm:p-5">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-[var(--muted)]">
            মোট {new Intl.NumberFormat("bn-BD").format(products.length)}টি পণ্য দেখানো হচ্ছে
          </p>
          <SortDropdown />
        </div>
      </section>

      <div className="mt-5">
        <ProductGrid products={sorted} />
      </div>

      <Link href="/" className="mt-5 inline-block text-[var(--green)] hover:underline">
        ← হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}
