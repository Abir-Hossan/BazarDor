import { NextResponse } from "next/server";
import { getCategories } from "@/lib/api";

export const revalidate = 300;

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ categories });
  } catch {
    return NextResponse.json(
      { error: "ক্যাটাগরির তথ্য লোড করা যায়নি।" },
      { status: 502 },
    );
  }
}
