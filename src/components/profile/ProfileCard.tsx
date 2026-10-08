"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export function ProfileCard({ user }: { user: { name: string; email: string; image?: string | null } }) {
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    try {
      const result = await authClient.signOut();
      if (result.error) {
        toast.error("সাইন আউট করা যায়নি।");
        return;
      }
      toast.success("সফলভাবে সাইন আউট হয়েছে।");
      window.location.assign("/");
    } catch {
      toast.error("সাইন আউট করা যায়নি।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-2xl bg-slate-100 text-3xl">
            {user.image ? <img src={user.image} alt="" className="h-full w-full object-cover" /> : "👤"}
          </div>
          <div><h2 className="text-2xl font-bold">{user.name}</h2><p className="break-all text-[var(--muted)]">{user.email}</p></div>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <Link href="/profile/update" className="rounded-lg border border-[var(--green)] px-4 py-2 text-center text-[var(--green)] hover:bg-emerald-50">প্রোফাইল আপডেট</Link>
          <button type="button" disabled={loading} onClick={signOut} className="rounded-lg border border-red-400 px-4 py-2 text-red-500 hover:bg-red-50 disabled:opacity-60">{loading ? "সাইন আউট হচ্ছে…" : "সাইন আউট"}</button>
        </div>
      </div>
    </div>
  );
}
