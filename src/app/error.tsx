"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container-page flex min-h-[620px] flex-col items-center justify-center text-center">
      <div className="text-5xl">⚠️</div>
      <h1 className="mt-5 text-3xl font-bold">তথ্য লোড করা যায়নি</h1>
      <p className="mt-2 max-w-md text-[var(--muted)]">সাময়িক সমস্যার কারণে বাজারের তথ্য পাওয়া যাচ্ছে না। আবার চেষ্টা করুন।</p>
      <button type="button" onClick={() => reset()} className="mt-6 rounded-lg bg-[var(--green)] px-5 py-3 font-semibold text-white">আবার চেষ্টা করুন</button>
    </div>
  );
}
