import { NextResponse } from "next/server";
import { optimizeBullet } from "@/lib/bullet-optimizer";

export async function POST(req: Request) {
  try {
    const { bullet } = await req.json();
    const suggestions = optimizeBullet(bullet);
    return NextResponse.json({ suggestions });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to optimize bullet" },
      { status: 500 }
    );
  }
}
