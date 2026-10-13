import type { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length)
    return (
      <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white p-10 text-center text-[var(--muted)]">
        কোনো পণ্য পাওয়া যায়নি।
      </div>
    );
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <ProductCard key={String(p.id)} product={p} />
      ))}
    </div>
  );
}
