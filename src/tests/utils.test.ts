import { describe, expect, it } from "vitest";
import {
  formatBanglaDate,
  formatBanglaNumber,
  formatBanglaPercentage,
  parseNumericPrice,
} from "@/lib/bengali";
import { sortByPrice, topFallers, topRisers } from "@/lib/utils";
import type { Product } from "@/types/product";

const product = (id: string, price: number | null, change: number | null): Product => ({
  id,
  slug: id,
  name: id,
  categorySlug: "chal",
  categoryName: "চাল",
  unit: "প্রতি কেজি",
  price,
  change,
  markets: [],
});

describe("Bengali number utilities", () => {
  it("formats grouped integers", () => expect(formatBanglaNumber(1850)).toBe("১,৮৫০"));
  it("formats decimals", () => expect(formatBanglaNumber(2.9)).toBe("২.৯"));
  it("formats prices", () => expect(formatBanglaNumber("১,৮৫০ টাকা")).toBe("১,৮৫০"));
  it("formats price with currency", () => expect(formatBanglaNumber(148) + " টাকা").toBe("১৪৮ টাকা"));
  it("formats absolute percentage", () => expect(formatBanglaPercentage(-2.9)).toBe("২.৯%"));
  it("handles missing percentage", () => expect(formatBanglaPercentage(null)).toBe("০.০%"));
  it("parses Bengali digits, commas and currency", () => expect(parseNumericPrice("১,৮৫০ টাকা")).toBe(1850));
  it("parses numeric strings", () => expect(parseNumericPrice("2.75")).toBe(2.75));
  it("rejects invalid values", () => expect(parseNumericPrice("abc")).toBeNull());
  it("formats Bengali dates", () => expect(formatBanglaDate(new Date("2026-10-06T00:00:00Z"))).toMatch(/২০২৬/));
});

describe("price sorting and movement", () => {
  const products = [
    product("a", 100, 2.1),
    product("b", 50, -4.2),
    product("c", 80, 1),
    product("d", 150, -1),
    product("e", null, 0),
  ];

  it("sorts ascending numerically", () => expect(sortByPrice(products, "asc").map((item) => item.id)).toEqual(["b", "c", "a", "d", "e"]));
  it("sorts descending numerically", () => expect(sortByPrice(products, "desc").map((item) => item.id)).toEqual(["e", "d", "a", "c", "b"]));
  it("gets top risers", () => expect(topRisers(products).map((item) => item.id)).toEqual(["a", "c"]));
  it("gets top fallers", () => expect(topFallers(products).map((item) => item.id)).toEqual(["b", "d"]));
  it("limits risers and fallers to six", () => {
    const many = Array.from({ length: 10 }, (_, index) => product(String(index), 100 + index, index + 1));
    expect(topRisers(many)).toHaveLength(6);
    expect(topFallers(many.map((item, index) => ({ ...item, change: -(index + 1) })))).toHaveLength(6);
  });
});
