"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { SocialLogin } from "./SocialLogin";

export function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return void toast.error("নাম লিখুন।");
    if (!/^\S+@\S+\.\S+$/.test(email)) return void toast.error("সঠিক ইমেইল দিন।");
    if (password.length < 8) return void toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
    if (password !== confirm) return void toast.error("পাসওয়ার্ড মিলছে না।");

    setLoading(true);
    try {
      const result = await authClient.signUp.email({ name: name.trim(), email, password });
      if (result.error) {
        toast.error(result.error.message || "অ্যাকাউন্ট তৈরি করা যায়নি।");
        return;
      }
      const signOutResult = await authClient.signOut();
      if (signOutResult.error) {
        toast.error("অ্যাকাউন্ট তৈরি হয়েছে, তবে স্বয়ংক্রিয়ভাবে সাইন আউট করা যায়নি।");
        return;
      }
      toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।");
      router.push("/signin");
      router.refresh();
    } catch {
      toast.error("অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
      <label className="block text-sm font-medium" htmlFor="signup-name">নাম<input id="signup-name" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="যেমন: রহিম উদ্দিন" className="mt-2 w-full rounded-lg border border-[var(--border)] px-3 py-2.5" /></label>
      <label className="mt-4 block text-sm font-medium" htmlFor="signup-email">ইমেইল<input id="signup-email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" className="mt-2 w-full rounded-lg border border-[var(--border)] px-3 py-2.5" /></label>
      <label className="mt-4 block text-sm font-medium" htmlFor="signup-password">পাসওয়ার্ড<input id="signup-password" required minLength={8} type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" placeholder="কমপক্ষে ৮ অক্ষর" className="mt-2 w-full rounded-lg border border-[var(--border)] px-3 py-2.5" /></label>
      <label className="mt-4 block text-sm font-medium" htmlFor="signup-confirm">পাসওয়ার্ড নিশ্চিত করুন<input id="signup-confirm" required minLength={8} type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" placeholder="আবার লিখুন" className="mt-2 w-full rounded-lg border border-[var(--border)] px-3 py-2.5" /></label>
      <button type="submit" disabled={loading} className="mt-5 w-full rounded-lg bg-[var(--green)] py-3 font-semibold text-white disabled:opacity-60">{loading ? "অ্যাকাউন্ট তৈরি হচ্ছে…" : "অ্যাকাউন্ট তৈরি করুন"}</button>
      <div className="my-5 flex items-center gap-3 text-xs text-[var(--muted)]"><span className="h-px flex-1 bg-[var(--border)]" />অথবা<span className="h-px flex-1 bg-[var(--border)]" /></div>
      <SocialLogin />
      <p className="mt-5 text-center text-sm">অ্যাকাউন্ট আছে? <Link href="/signin" className="font-semibold text-[var(--green)]">সাইন ইন করুন</Link></p>
      <Link href="/" className="mt-5 block text-center text-sm text-[var(--muted)]">← হোম পেজে ফিরে যান</Link>
    </form>
  );
}
