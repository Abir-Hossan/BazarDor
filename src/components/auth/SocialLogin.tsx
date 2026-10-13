"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { safeReturnPath } from "@/lib/utils";
import toast from "react-hot-toast";

export function SocialLogin({ callbackUrl = "/" }: { callbackUrl?: string }) {
  const callback = safeReturnPath(callbackUrl);
  const [loadingProvider, setLoadingProvider] = useState<
    "google" | "github" | null
  >(null);

  async function social(provider: "google" | "github") {
    if (loadingProvider) return;

    setLoadingProvider(provider);

    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: callback,
      });

      if (result.error) {
        toast.error(
          result.error.message ||
            `${provider === "google" ? "Google" : "GitHub"} লগইন করা যায়নি।`,
        );
      }
    } catch {
      toast.error("সামাজিক লগইন করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setLoadingProvider(null);
    }
  }

  return (
    <>
      <div className="my-5 flex items-center gap-3 text-xs text-[var(--muted)]">
        <span className="h-px flex-1 bg-[var(--border)]" />
        অথবা
        <span className="h-px flex-1 bg-[var(--border)]" />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => social("google")}
          disabled={loadingProvider !== null}
          className="rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingProvider === "google"
            ? "Google খুলছে…"
            : "🔵 Google দিয়ে চালিয়ে যান"}
        </button>

        <button
          type="button"
          onClick={() => social("github")}
          disabled={loadingProvider !== null}
          className="rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingProvider === "github"
            ? "GitHub খুলছে…"
            : "◉ GitHub দিয়ে চালিয়ে যান"}
        </button>
      </div>
    </>
  );
}
