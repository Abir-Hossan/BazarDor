import type { Product } from "@/types/product";
import { ProductGrid } from "@/components/products/ProductGrid";
export function PriceSection({title,products,down=false}:{title:string;products:Product[];down?:boolean}){return <section className="mt-10"><h2 className="mb-4 flex items-center gap-2 text-2xl font-bold"><span className={down?"text-emerald-600":"text-red-500"}>{down?"▼":"▲"}</span>{title}</h2><ProductGrid products={products}/></section>}
