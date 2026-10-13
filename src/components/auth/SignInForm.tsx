"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { safeReturnPath } from "@/lib/utils";
import { SocialLogin } from "./SocialLogin";

export function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callback = safeReturnPath(params.get("callbackUrl"));
  const authRequired = params.get("authRequired") === "1";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authRequired) toast.error("বিস্তারিত দেখতে প্রথমে সাইন ইন করুন।");
  }, [authRequired]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("সঠিক ইমেইল দিন।");
      return;
    }
    if (password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }

    setLoading(true);
    try {
      const result = await authClient.signIn.email({ email, password });
      if (result.error) {
        toast.error("ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।");
        return;
      }
      toast.success("সফলভাবে সাইন ইন হয়েছে।");
      router.push(callback);
      router.refresh();
    } catch {
      toast.error("সাইন ইন করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      noValidate
      onSubmit={submit}
      className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm"
    >
      <label className="block text-sm font-medium" htmlFor="signin-email">
        ইমেইল
        <input
          id="signin-email"
          required
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-2 w-full rounded-lg border border-[var(--border)] px-3 py-2.5"
        />
      </label>
      <label
        className="mt-4 block text-sm font-medium"
        htmlFor="signin-password"
      >
        পাসওয়ার্ড
        <input
          id="signin-password"
          required
          minLength={8}
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="কমপক্ষে ৮ অক্ষর"
          className="mt-2 w-full rounded-lg border border-[var(--border)] px-3 py-2.5"
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="mt-5 w-full rounded-lg bg-[var(--green)] py-3 font-semibold text-white disabled:opacity-60"
      >
        {loading ? "সাইন ইন হচ্ছে…" : "সাইন ইন"}
      </button>
      <SocialLogin callbackUrl={callback} />
      <p className="mt-5 text-center text-sm">
        অ্যাকাউন্ট নেই?{" "}
        <Link href="/signup" className="font-semibold text-[var(--green)]">
          সাইন আপ করুন
        </Link>
      </p>
      <Link
        href="/"
        className="mt-5 block text-center text-sm text-[var(--muted)]"
      >
        ← হোম পেজে ফিরে যান
      </Link>
    </form>
  );
}
