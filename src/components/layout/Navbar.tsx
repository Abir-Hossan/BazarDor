"use client";

import Link from "next/link";
import { ChevronDown, ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { formatBanglaDate, formatBanglaNumber } from "@/lib/bengali";
import type { Category, Product } from "@/types/product";
import Image from "next/image";
const fallbackCategories: Category[] = [
  ["চাল", "chal", "🍚"],
  ["ডাল", "dal", "🫘"],
  ["তেল", "tel", "🫙"],
  ["সবজি", "sobji", "🥬"],
  ["মাছ", "mach", "🐟"],
  ["মাংস", "mangsho", "🍗"],
  ["ডিম-দুধ", "dim-dudh", "🥛"],
  ["মসলা", "mosla", "🌶️"],
].map(([name, slug, icon]) => ({ name, slug, icon }));

export function Navbar() {
  const path = usePathname();
  const [categories] = useState<Category[]>(fallbackCategories);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    function closeOnOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        setOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  async function signOut() {
    const result = await authClient.signOut();
    if (result.error) {
      toast.error("সাইন আউট করা যায়নি।");
      return;
    }
    toast.success("সফলভাবে সাইন আউট হয়েছে।");
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/95 backdrop-blur">
      <div className="container-page flex items-center justify-between py-3">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--green)] text-white">
            <ShoppingCart size={20} />
          </span>
          <span>
            <span className="block text-xl font-bold leading-none">
              বাজার দর
            </span>
            <span className="mt-1 block text-xs text-[var(--muted)]">
              {formatBanglaDate()}
            </span>
          </span>
        </Link>

        <div ref={menuRef} className="relative">
          {session?.user ? (
            <>
              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-haspopup="menu"
                aria-label="ব্যবহারকারী মেনু"
                className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-slate-50"
              >
                <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-slate-100 text-sm">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt=""
                      width={40}
                      height={40}
                      unoptimized
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </span>
                <span className="hidden font-medium sm:block">
                  {session.user.name}
                </span>
                <ChevronDown size={15} aria-hidden="true" />
              </button>
              {open && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-64 rounded-2xl border border-[var(--border)] bg-white p-4 shadow-xl"
                >
                  <p className="font-semibold">{session.user.name}</p>
                  <p className="break-all text-sm text-[var(--muted)]">
                    {session.user.email}
                  </p>
                  <Link
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    href="/profile"
                    className="mt-4 block rounded-lg px-2 py-2 hover:bg-slate-50"
                  >
                    👤 আমার প্রোফাইল
                  </Link>
                  <button
                    role="menuitem"
                    type="button"
                    onClick={signOut}
                    className="mt-1 w-full rounded-lg px-2 py-2 text-left text-red-500 hover:bg-red-50"
                  >
                    ↪ সাইন আউট
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/signin" className="font-medium">
                সাইন ইন
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-[var(--green)] px-4 py-2 text-white shadow-sm hover:brightness-95"
              >
                সাইন আপ
              </Link>
            </div>
          )}
        </div>
      </div>

      <nav
        aria-label="পণ্যের বিভাগ"
        className="border-t border-[var(--border)]"
      >
        <div className="container-page overflow-x-auto">
          <div className="flex min-w-max items-center gap-1 py-2">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${encodeURIComponent(category.slug)}`}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium ${path === `/category/${category.slug}` ? "bg-[var(--green)] text-white" : "hover:bg-slate-50"}`}
                aria-current={
                  path === `/category/${category.slug}` ? "page" : undefined
                }
              >
                {category.icon} {category.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <PriceTicker />
    </header>
  );
}

function PriceTicker() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const response = await fetch("/api/bazardor/products");

        if (!response.ok) return;

        const data: unknown = await response.json();

        if (
          !cancelled &&
          typeof data === "object" &&
          data !== null &&
          "products" in data &&
          Array.isArray(data.products)
        ) {
          setProducts(data.products as Product[]);
        }
      } catch {
        // Keep the ticker empty if the API is unavailable.
      }
    }

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const tickerProducts = products.filter(
    (product) =>
      product.name &&
      product.name !== "পণ্য" &&
      typeof product.price === "number" &&
      Number.isFinite(product.price),
  );

  if (tickerProducts.length === 0) {
    return (
      <div
        className="h-9 border-t border-[var(--border)] bg-white"
        aria-hidden="true"
      />
    );
  }

  function renderProduct(product: Product, index: number) {
    const change = Number(product.change ?? 0);
    const isUp = change > 0;
    const isDown = change < 0;

    const changeLabel = isUp
      ? `দাম বেড়েছে ${formatBanglaNumber(Math.abs(change))} শতাংশ`
      : isDown
        ? `দাম কমেছে ${formatBanglaNumber(Math.abs(change))} শতাংশ`
        : "দামের পরিবর্তন নেই";

    const changeColor = isUp
      ? "text-red-600"
      : isDown
        ? "text-emerald-600"
        : "text-gray-500";

    const arrow = isUp ? "▲" : isDown ? "▼" : "−";

    return (
      <span
        key={`${product.id}-${index}`}
        className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-base leading-7 text-gray-700"
      >
        <span>{product.name}:</span>

        <strong className="font-semibold">
          {formatBanglaNumber(product.price)} ৳
        </strong>

        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${changeColor}`}
          title={changeLabel}
        >
          <span aria-hidden="true">{arrow}</span>
          <span>
            {isUp || isDown ? `${formatBanglaNumber(Math.abs(change))}%` : "০%"}
          </span>
          <span className="sr-only">{changeLabel}</span>
        </span>
      </span>
    );
  }

  return (
    <div className="w-full min-w-0 border-t border-[var(--border)] bg-white">
      <div className="ticker-mask" aria-label="পণ্যের বর্তমান বাজারদর">
        <div className="ticker-track">
          <div className="ticker-group">
            {tickerProducts.map((product, index) =>
              renderProduct(product, index),
            )}
          </div>

          <div className="ticker-group" aria-hidden="true">
            {tickerProducts.map((product, index) =>
              renderProduct(product, index + tickerProducts.length),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
