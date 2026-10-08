import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/types/product";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: { children: ReactNode; href: string }) => <a href={href} {...props}>{children}</a>,
}));

describe("ProductCard", () => {
  const base: Product = {
    id: 1,
    slug: "ignored-slug",
    name: "স্বর্ণমাছি চাল",
    categorySlug: "chal",
    categoryName: "চাল",
    unit: "প্রতি কেজি",
    price: 148,
    change: 2.1,
    emoji: "🍚",
    markets: [],
  };

  it("renders product information and uses the API identifier in the link", () => {
    render(<ProductCard product={base} />);
    expect(screen.getByRole("heading", { name: "স্বর্ণমাছি চাল" })).toBeInTheDocument();
    expect(screen.getByText("১৪৮")).toBeInTheDocument();
    expect(screen.getByText("▲ ২.১%")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/product/1");
  });

  it("renders green for a price decrease", () => {
    render(<ProductCard product={{ ...base, change: -2.9 }} />);
    expect(screen.getByText("▼ ২.৯%")).toHaveClass("text-emerald-600");
  });

  it("renders neutral for an unchanged price", () => {
    render(<ProductCard product={{ ...base, change: 0 }} />);
    expect(screen.getByText("— ০.০%")).toHaveClass("text-slate-500");
  });
});
