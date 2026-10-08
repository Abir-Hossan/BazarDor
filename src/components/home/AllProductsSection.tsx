import type { Product } from "@/types/product";
import { ProductGrid } from "@/components/products/ProductGrid";
export function AllProductsSection({products}:{products:Product[]}){return <section id="সব-পণ্য" className="mt-10 scroll-mt-40"><h2 className="text-2xl font-bold">সব পণ্য</h2><p className="mt-1 mb-4 text-sm text-[var(--muted)]">মোট {new Intl.NumberFormat("bn-BD").format(products.length)}টি পণ্য দেখানো হচ্ছে</p><ProductGrid products={products}/></section>}
