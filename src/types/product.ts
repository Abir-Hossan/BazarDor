export type PriceChange = number | string | null | undefined;

export interface MarketPrice {
  market: string;
  division?: string;
  min: number | null;
  max: number | null;
  avg: number | null;
}

export interface Product {
  id: string | number;
  slug: string;
  name: string;
  categorySlug: string;
  categoryName: string;
  unit: string;
  price: number | null;
  change: number | null;
  emoji?: string;
  image?: string | null;
  markets: MarketPrice[];
}

export interface Category { slug: string; name: string; icon?: string; }
