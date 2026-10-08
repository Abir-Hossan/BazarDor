import { parseNumericPrice } from "./bengali";
import type { Product } from "@/types/product";

export function cn(...classes: Array<string | false | null | undefined>): string { return classes.filter(Boolean).join(" "); }
export function sortByPrice(products: Product[], direction: "asc" | "desc"): Product[] {
  return [...products].sort((a, b) => {
    const left = parseNumericPrice(a.price);
    const right = parseNumericPrice(b.price);
    if (left === null && right === null) return 0;
    if (left === null) return 1;
    if (right === null) return -1;
    return (left - right) * (direction === "asc" ? 1 : -1);
  });
}
export function topRisers(products: Product[], count = 6): Product[] {
  return [...products].filter((p) => (p.change ?? 0) > 0).sort((a,b) => (b.change ?? -Infinity) - (a.change ?? -Infinity)).slice(0,count);
}
export function topFallers(products: Product[], count = 6): Product[] {
  return [...products].filter((p) => (p.change ?? 0) < 0).sort((a,b) => (a.change ?? Infinity) - (b.change ?? Infinity)).slice(0,count);
}
export function safeReturnPath(path: string | null | undefined): string {
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return "/";
  return path;
}
