import { ProductSkeleton } from "@/components/products/ProductSkeleton";
export default function Loading() {
  return (
    <div className="container-page py-8">
      <div className="h-40 animate-pulse rounded-3xl bg-white" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
