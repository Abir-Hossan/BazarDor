import { Suspense } from "react";
import { SignInForm } from "@/components/auth/SignInForm";
export default function SignIn() {
  return (
    <div className="container-page flex min-h-[680px] items-center justify-center py-10">
      <div className="w-full max-w-[520px]">
        <h1 className="text-center text-3xl font-bold">সাইন ইন</h1>
        <p className="mb-6 mt-2 text-center text-[var(--muted)]">
          বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
        </p>
        <Suspense>
          <SignInForm />
        </Suspense>
      </div>
    </div>
  );
}
