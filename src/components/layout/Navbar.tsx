"use client";

import Link from "next/link";
import { ChevronDown, ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { formatBanglaDate, formatBanglaNumber, formatBanglaPercentage } from "@/lib/bengali";
import { getCategories, getProducts } from "@/lib/api";
import type { Category, Product } from "@/types/product";

const fallbackCategories: Category[] = [
  ["চাল", "chal", "🍚"], ["ডাল", "dal", "🫘"], ["তেল", "tel", "🫙"], ["সবজি", "sobji", "🥬"],
  ["মাছ", "mach", "🐟"], ["মাংস", "mangsho", "🍗"], ["ডিম-দুধ", "dim-dudh", "🥛"], ["মসলা", "mosla", "🌶️"],
].map(([name, slug, icon]) => ({ name, slug, icon }));

export function Navbar() {
  const path = usePathname();
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    getCategories().then((items) => {
      if (items.length) setCategories(items);
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    function closeOnOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpen(false);
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
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--green)] text-white"><ShoppingCart size={20} /></span>
          <span>
            <span className="block text-xl font-bold leading-none">বাজার দর</span>
            <span className="mt-1 block text-xs text-[var(--muted)]">{formatBanglaDate()}</span>
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
                  {session.user.image ? <img src={session.user.image} alt="" className="h-full w-full object-cover" /> : "👤"}
                </span>
                <span className="hidden font-medium sm:block">{session.user.name}</span>
                <ChevronDown size={15} aria-hidden="true" />
              </button>
              {open && (
                <div role="menu" className="absolute right-0 mt-2 w-64 rounded-2xl border border-[var(--border)] bg-white p-4 shadow-xl">
                  <p className="font-semibold">{session.user.name}</p>
                  <p className="break-all text-sm text-[var(--muted)]">{session.user.email}</p>
                  <Link role="menuitem" onClick={() => setOpen(false)} href="/profile" className="mt-4 block rounded-lg px-2 py-2 hover:bg-slate-50">👤 আমার প্রোফাইল</Link>
                  <button role="menuitem" type="button" onClick={signOut} className="mt-1 w-full rounded-lg px-2 py-2 text-left text-red-500 hover:bg-red-50">↪ সাইন আউট</button>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/signin" className="font-medium">সাইন ইন</Link>
              <Link href="/signup" className="rounded-lg bg-[var(--green)] px-4 py-2 text-white shadow-sm hover:brightness-95">সাইন আপ</Link>
            </div>
          )}
        </div>
      </div>

      <nav aria-label="পণ্যের বিভাগ" className="border-t border-[var(--border)]">
        <div className="container-page overflow-x-auto">
          <div className="flex min-w-max items-center gap-1 py-2">
            {categories.map((category) => (
              <Link key={category.slug} href={`/category/${encodeURIComponent(category.slug)}`} className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium ${path === `/category/${category.slug}` ? "bg-[var(--green)] text-white" : "hover:bg-slate-50"}`}>
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
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then((products) => setItems(products.slice(0, 12))).catch(() => undefined);
  }, []);

  if (!items.length) return <div className="h-9 border-t border-[var(--border)] bg-white" aria-hidden="true" />;

  const renderItem = (product: Product, index: number, hidden = false) => {
    const change = product.change ?? 0;
    return (
      <div key={`${product.id}-${index}`} aria-hidden={hidden} className="flex items-center gap-2 border-r border-[var(--border)] px-5 py-1.5 text-xs whitespace-nowrap">
        <span aria-hidden="true">{product.emoji ?? "🛒"}</span>
        <span>{product.name}</span>
        <span>{formatBanglaNumber(product.price)} টাকা/{product.unit.replace(/^প্রতি\s*/, "")}</span>
        <span className={change > 0 ? "text-red-500" : change < 0 ? "text-emerald-600" : "text-slate-500"}>
          {change > 0 ? "▲" : change < 0 ? "▼" : "—"} {formatBanglaPercentage(change)}
        </span>
      </div>
    );
  };

  return (
    <div className="ticker-mask border-t border-[var(--border)] bg-white" aria-label="আজকের পণ্যের দাম">
      <div className="ticker-track" role="presentation">
        <div className="flex">{items.map((product, index) => renderItem(product, index))}</div>
        <div className="flex" aria-hidden="true">{items.map((product, index) => renderItem(product, index, true))}</div>
      </div>
    </div>
  );
}
