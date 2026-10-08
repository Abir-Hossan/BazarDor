import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ProfileCard } from "@/components/profile/ProfileCard";
export default async function Profile(){const session=await auth.api.getSession({headers:await headers()});if(!session)redirect("/signin?callbackUrl=/profile");return <div className="container-page max-w-3xl py-12"><h1 className="text-3xl font-bold">আমার প্রোফাইল</h1><p className="mt-2 mb-6 text-[var(--muted)]">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p><ProfileCard user={session.user}/></div>}
