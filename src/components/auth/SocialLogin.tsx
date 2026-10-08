"use client";

import { authClient } from "@/lib/auth-client";
import { safeReturnPath } from "@/lib/utils";
import toast from "react-hot-toast";

export function SocialLogin({ callbackUrl = "/" }: { callbackUrl?: string }) {
  const callback = safeReturnPath(callbackUrl);
  const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";
  const githubEnabled = process.env.NEXT_PUBLIC_GITHUB_AUTH_ENABLED === "true";
  if (!googleEnabled && !githubEnabled) return null;

  async function social(provider: "google" | "github") {
    const result = await authClient.signIn.social({ provider, callbackURL: callback });
    if (result.error) toast.error("সামাজিক লগইন এই মুহূর্তে উপলভ্য নয়।");
  }

  return (
    <>
      <div className="my-5 flex items-center gap-3 text-xs text-[var(--muted)]"><span className="h-px flex-1 bg-[var(--border)]" />অথবা<span className="h-px flex-1 bg-[var(--border)]" /></div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {googleEnabled && (
        <button type="button" onClick={() => social("google")} className="rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 font-medium hover:bg-slate-50">
          🔵 Google দিয়ে চালিয়ে যান
        </button>
      )}
      {githubEnabled && (
        <button type="button" onClick={() => social("github")} className="rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 font-medium hover:bg-slate-50">
          ◉ GitHub দিয়ে চালিয়ে যান
        </button>
      )}
      </div>
    </>
  );
}
