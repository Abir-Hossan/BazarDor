import Link from "next/link";
export default function NotFound() {
  return (
    <div
      role="status"
      className="container-page flex min-h-[620px] flex-col items-center justify-center text-center"
    >
      <div className="text-6xl">🛒</div>
      <h1 className="mt-5 text-3xl font-bold">পৃষ্ঠা পাওয়া যায়নি</h1>
      <p className="mt-2 max-w-md text-[var(--muted)]">
        আপনি যে পেজটি খুঁজছেন সেটি নেই অথবা তথ্যটি বর্তমানে পাওয়া যাচ্ছে না।
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-[var(--green)] px-5 py-3 font-semibold text-white"
      >
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}
