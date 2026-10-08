import { Hero } from "@/components/home/Hero";
import { PriceSection } from "@/components/home/PriceSections";
import { AllProductsSection } from "@/components/home/AllProductsSection";
import { getProducts } from "@/lib/api";
import { topRisers,topFallers } from "@/lib/utils";
import type { Product } from "@/types/product";
export default async function Home(){let products: Product[]=[];try{products=await getProducts()}catch{}return <div className="container-page py-6 sm:py-8"><Hero/><PriceSection title="আজ দাম বেড়েছে" products={topRisers(products)}/><PriceSection title="আজ দাম কমেছে" products={topFallers(products)} down/><AllProductsSection products={products}/></div>}
