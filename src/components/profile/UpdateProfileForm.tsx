"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export function UpdateProfileForm({ initialName }: { initialName: string }) {
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(event: FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      toast.error("নাম কমপক্ষে ২ অক্ষরের হতে হবে।");
      return;
    }

    setLoading(true);
    try {
      const result = await authClient.updateUser({ name: trimmed });
      if (result.error) {
        toast.error("প্রোফাইল আপডেট করা যায়নি।");
        return;
      }
      toast.success("প্রোফাইল সফলভাবে আপডেট হয়েছে।");
      await authClient.getSession();
      router.push("/profile");
      router.refresh();
    } catch {
      toast.error("প্রোফাইল আপডেট করা যায়নি।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-[var(--border)] bg-white p-6"
    >
      <label className="block font-medium" htmlFor="profile-name">
        নাম
        <input
          id="profile-name"
          required
          minLength={2}
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-2 w-full rounded-lg border border-[var(--border)] px-3 py-2.5"
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="mt-5 w-full rounded-lg bg-[var(--green)] py-3 font-semibold text-white disabled:opacity-60"
      >
        {loading ? "আপডেট হচ্ছে…" : "আপডেট করুন"}
      </button>
    </form>
  );
}
