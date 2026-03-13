import { NextResponse } from "next/server";
import { optimizeBullet } from "@/lib/bullet-optimizer";

export async function POST(req: Request) {
  const { bullet } = await req.json();
  return NextResponse.json({ suggestions: optimizeBullet(bullet) });
}