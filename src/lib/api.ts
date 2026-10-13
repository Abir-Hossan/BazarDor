import type { Category, MarketPrice, Product } from "@/types/product";
import { parseNumericPrice } from "./bengali";

const PRIMARY = process.env.BAZARDOR_API_URL ?? "https://api.api-store.workers.dev/api/bazardor";
const FALLBACK = process.env.BAZARDOR_API_FALLBACK_URL ?? "https://api.abcz.workers.dev/api/bazardor";

export class BazarDorApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = "BazarDorApiError";
  }
}

async function requestJson<T>(path: string): Promise<T> {
  const urls = [`${PRIMARY}${path}`, `${FALLBACK}${path}`];
  const errors: unknown[] = [];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        next: { revalidate: 300 },
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        // A failure from the primary endpoint should not prevent the fallback
        // endpoint from answering. Both endpoints are attempted.
        errors.push(new BazarDorApiError(`API ${res.status}`, res.status));
        continue;
      }

      return (await res.json()) as T;
    } catch (error) {
      errors.push(error);
    }
  }

  const apiErrors = errors.filter((error): error is BazarDorApiError => error instanceof BazarDorApiError);
  // Preserve a meaningful non-404 failure when the fallback itself says 404.
  const selectedError = apiErrors.find((error) => error.status !== 404) ?? apiErrors[0] ?? errors[errors.length - 1];
  const status = selectedError instanceof BazarDorApiError ? selectedError.status : undefined;
  throw new BazarDorApiError(
    `বাজারের তথ্য লোড করা যায়নি: ${selectedError instanceof Error ? selectedError.message : "অজানা ত্রুটি"}`,
    status,
  );
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function pick(obj: Record<string, unknown>, keys: string[]): unknown {
  for (const key of keys) {
    if (key in obj) return obj[key];
  }
  return undefined;
}

function unwrap(value: unknown, keys: string[]): unknown[] {
  if (Array.isArray(value)) return value;
  const object = asRecord(value);
  if (!object) return [];

  for (const key of keys) {
    const nested = object[key];
    if (Array.isArray(nested)) return nested;
    const nestedObject = asRecord(nested);
    if (nestedObject) {
      const nestedArray = unwrap(nestedObject, keys);
      if (nestedArray.length) return nestedArray;
    }
  }

  return [];
}

function unwrapRecord(value: unknown, keys: string[]): Record<string, unknown> | null {
  const object = asRecord(value);
  if (!object) return null;
  for (const key of keys) {
    const nested = asRecord(object[key]);
    if (nested) {
      const resolved = unwrapRecord(nested, keys);
      return resolved ?? nested;
    }
  }
  return object;
}


function normalizeMarket(rawValue: unknown): MarketPrice {
  const raw = asRecord(rawValue) ?? {};

  const min = parseNumericPrice(
    pick(raw, ["min", "minimum", "lowest", "minPrice", "minimumPrice", "সর্বনিম্ন"])
  );

  const max = parseNumericPrice(
    pick(raw, ["max", "maximum", "highest", "maxPrice", "maximumPrice", "সর্বাধিক"])
  );

  const apiAvg = parseNumericPrice(
    pick(raw, ["avg", "average", "mean", "avgPrice", "averagePrice", "গড়", "গড়"])
  );

  // API average না দিলে minimum ও maximum থেকে midpoint হিসাব করা হবে।
  const avg =
    apiAvg ??
    (min !== null && max !== null
      ? (min + max) / 2
      : null);

  return {
    market: String(
      pick(raw, ["market", "marketName", "name", "বাজার"]) ?? "অজানা বাজার"
    ),
    division:
      String(pick(raw, ["division", "region", "বিভাগ"]) ?? "") || undefined,
    min,
    max,
    avg,
  };
}


function deriveMarketSummary(markets: MarketPrice[]) {
  const mins = markets.map((market) => market.min).filter((value): value is number => value !== null);
  const maxes = markets.map((market) => market.max).filter((value): value is number => value !== null);
  const avgs = markets.map((market) => market.avg).filter((value): value is number => value !== null);

  return {
    min: mins.length ? Math.min(...mins) : null,
    max: maxes.length ? Math.max(...maxes) : null,
    avg: avgs.length ? avgs.reduce((sum, value) => sum + value, 0) / avgs.length : null,
  };
}

export function normalizeProduct(rawValue: unknown, categories: Category[] = []): Product {
  const raw = unwrapRecord(rawValue, ["product", "data", "result"]) ?? {};
  const id = pick(raw, ["id", "_id", "productId", "product_id"]) ?? "";
  const slugValue = pick(raw, ["slug", "code", "key"]);
  const categoryRaw = pick(raw, ["category", "categorySlug", "category_id", "categoryId", "category_slug"]);
  const categoryObject = asRecord(categoryRaw);
  const categorySlug = String(
    categoryObject ? pick(categoryObject, ["slug", "code", "id"]) : categoryRaw ?? "",
  );
  const category = categories.find(
    (item) => item.slug === categorySlug || String(item.slug) === String(categoryRaw),
  );
  const categoryName = categoryObject
  ? pick(categoryObject, ["nameBn", "name", "title"])
  : undefined;
const name = String(
  pick(raw, ["nameBn", "name", "title", "productName", "product_name"]) ??
    "পণ্য",
);
  const markets = unwrap(
    pick(raw, ["markets", "marketPrices", "market_prices", "prices", "বাজার"]),
    ["data", "markets", "prices"],
  ).map(normalizeMarket);
  const directMin = parseNumericPrice(pick(raw, ["minPrice", "minimumPrice", "lowestPrice", "min"]));
  const directMax = parseNumericPrice(pick(raw, ["maxPrice", "maximumPrice", "highestPrice", "max"]));
  const directAvg = parseNumericPrice(pick(raw, ["averagePrice", "avgPrice", "average", "avg"]));
  const derived = deriveMarketSummary(markets);
  const imageValue = pick(raw, ["imageUrl", "image_url", "image"]);
  const emojiValue = pick(raw, ["emoji", "categoryIcon", "icon", "symbol"]);

  const rawChange = pick(raw, [
  "change",
  "changePercent",
  "change_percentage",
  "percentageChange",
  "priceChange",
  "price_change",
]);

const changeObject = asRecord(rawChange);

const changeValue = parseNumericPrice(
  changeObject
    ? pick(changeObject, ["pct", "percentage", "value"])
    : rawChange,
);

  return {
    id: typeof id === "string" || typeof id === "number" ? id : String(id),
    slug: String(slugValue ?? id),
    name,
    categorySlug: category?.slug ?? categorySlug,
categoryName:
  category?.name ?? String(pick(raw, ["categoryNameBn"]) ?? categoryName ?? "পণ্য"),    unit: String(pick(raw, ["unit", "measurement", "quantity", "একক"]) ?? "প্রতি কেজি"),

price:
  parseNumericPrice(
    pick(raw, [
      "today",
      "price",
      "currentPrice",
      "current_price",
      "todayPrice",
      "today_price",
      "দাম",
    ]),
  ) ??
  directAvg ??
  derived.avg ??
  (derived.min !== null && derived.max !== null
    ? (derived.min + derived.max) / 2
    : derived.min ?? derived.max),
    // Preserve missing change data as unknown instead of reporting a false 0% change.
    change: changeValue,
    // An image URL must never be rendered as an emoji. Emoji and image fields are distinct.
    emoji: typeof emojiValue === "string" ? emojiValue : "🛒",
    image: typeof imageValue === "string" && /^https?:\/\//i.test(imageValue) ? imageValue : null,
    markets:
      markets.length > 0
        ? markets
        : directMin !== null || directMax !== null || directAvg !== null
          ? [{ market: "সামগ্রিক বাজার", min: directMin, max: directMax, avg: directAvg }]
          : [],
  };
}

export async function getCategories(): Promise<Category[]> {
  const raw = await requestJson<unknown>("/categories");
  return unwrap(raw, ["categories", "data", "results"])
    .map((value) => {
      const item: Record<string, unknown> = asRecord(value) ?? {};
      return {
        slug: String(pick(item, ["slug", "code", "id"]) ?? ""),
        name: String(
  pick(item, ["nameBn", "categoryNameBn", "name", "title", "categoryName"]) ?? "",
),
        icon: String(pick(item, ["icon", "emoji", "symbol"]) ?? "🛒"),
      };
    })
    .filter((category) => category.slug && category.name);
}

export async function getCategory(slug: string): Promise<Category | null> {
  try {
    const raw = await requestJson<unknown>(`/categories/${encodeURIComponent(slug)}`);
    const candidate = unwrapRecord(raw, ["category", "data", "result"]);
    if (!candidate) return null;
    const category = {
      slug: String(pick(candidate, ["slug", "code", "id"]) ?? slug),
      name: String(
  pick(candidate, ["nameBn", "categoryNameBn", "name", "title", "categoryName"]) ?? "",
),
      icon: String(pick(candidate, ["icon", "emoji", "symbol"]) ?? "🛒"),
    };
    return category.name ? category : null;
  } catch (error) {
    if (error instanceof BazarDorApiError && error.status === 404) return null;
    throw error;
  }
}

export async function getProducts(category?: string): Promise<Product[]> {
  const categories = await getCategories().catch(() => []);
  try {
    const raw = await requestJson<unknown>(
      category ? `/products?category=${encodeURIComponent(category)}` : "/products",
    );
    return unwrap(raw, ["products", "data", "results"]).map((product) =>
      normalizeProduct(product, categories),
    );
  } catch (error) {
    if (category && error instanceof BazarDorApiError && (error.status === 400 || error.status === 404)) {
      return [];
    }
    throw error;
  }
}

export async function getProduct(idOrSlug: string): Promise<Product | null> {
  try {
    const categories = await getCategories().catch(() => []);
    const raw = await requestJson<unknown>(`/products/${encodeURIComponent(idOrSlug)}`);
    const candidate = unwrapRecord(raw, ["product", "data", "result"]);
    return candidate ? normalizeProduct(candidate, categories) : null;
  } catch (error) {
    if (error instanceof BazarDorApiError && error.status === 404) return null;
    throw error;
  }
}
