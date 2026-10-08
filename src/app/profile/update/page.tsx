import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { UpdateProfileForm } from "@/components/profile/UpdateProfileForm";
export default async function UpdateProfile(){const session=await auth.api.getSession({headers:await headers()});if(!session)redirect("/signin?callbackUrl=/profile/update");return <div className="container-page max-w-3xl py-12"><h1 className="text-3xl font-bold">প্রোফাইল আপডেট</h1><p className="mt-2 mb-6 text-[var(--muted)]">আপনার নাম পরিবর্তন করুন।</p><UpdateProfileForm initialName={session.user.name}/></div>}
