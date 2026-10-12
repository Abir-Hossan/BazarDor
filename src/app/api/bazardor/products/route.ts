import { NextResponse } from "next/server";
import { getProducts } from "@/lib/api";

export const revalidate = 300;

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json(
      { error: "পণ্যের তথ্য লোড করা যায়নি।" },
      { status: 502 },
    );
  }
}
