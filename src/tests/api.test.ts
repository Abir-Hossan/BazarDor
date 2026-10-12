import { describe, expect, it } from "vitest";
import { normalizeProduct } from "@/lib/api";

describe("API response normalization", () => {
  it("normalizes a realistic product object without changing numeric values", () => {
    const product = normalizeProduct({
      id: 7,
      slug: "basmati",
      name: "বাসমতি চাল",
      category: { slug: "chal", name: "চাল" },
      unit: "প্রতি কেজি",
      price: "১,৮৫০",
      change_percentage: "2.9",
      emoji: "🍚",
      markets: [
        { marketName: "সদর বাজার", division: "রাজশাহী", min: "১৮০০", max: "১৯০০", avg: "১৮৫০" },
        { marketName: "মাঠ বাজার", division: "ময়মনসিংহ", min: 1790, max: 1860, avg: 1825 },
      ],
    }, [{ slug: "chal", name: "চাল", icon: "🍚" }]);

    expect(product.id).toBe(7);
    expect(product.slug).toBe("basmati");
    expect(product.price).toBe(1850);
    expect(product.change).toBe(2.9);
    expect(product.categoryName).toBe("চাল");
    expect(product.markets).toHaveLength(2);
    expect(product.markets[0].min).toBe(1800);
  });

  it("derives average price when current price is absent", () => {
    const product = normalizeProduct({
      id: 1,
      name: "পণ্য",
      markets: [{ market: "A", min: 10, max: 20, avg: 15 }, { market: "B", min: 20, max: 30, avg: 25 }],
    });
    expect(product.price).toBe(20);
  });

  it("does not produce Infinity when market bounds are missing", () => {
    const product = normalizeProduct({ id: 2, name: "পণ্য", markets: [{ market: "A", min: null, max: null, avg: null }] });
    expect(product.price).toBeNull();
    expect(product.markets[0]).toMatchObject({ min: null, max: null, avg: null });
  });

  it("keeps image URLs separate from emoji and preserves unknown price changes", () => {
    const product = normalizeProduct({
      id: 10,
      name: "পেঁয়াজ",
      image: "https://example.com/onion.png",
    });

    expect(product.emoji).toBe("🛒");
    expect(product.image).toBe("https://example.com/onion.png");
    expect(product.change).toBeNull();
  });

  it("uses an explicit emoji when both emoji and image URL are provided", () => {
    const product = normalizeProduct({
      id: 11,
      name: "চাল",
      emoji: "🍚",
      imageUrl: "https://example.com/rice.png",
    });

    expect(product.emoji).toBe("🍚");
    expect(product.image).toBe("https://example.com/rice.png");
  });

  it("unwraps nested data and product response envelopes", () => {
    const product = normalizeProduct(
      { data: { product: { id: 9, name: "নেস্টেড পণ্য", price: "১২৫" } } },
      [],
    );
    expect(product.id).toBe(9);
    expect(product.name).toBe("নেস্টেড পণ্য");
    expect(product.price).toBe(125);
  });
});
