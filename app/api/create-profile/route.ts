import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, email } = body;

    const existing = await prisma.profile.findUnique({
      where: { email },
    });

    if (!existing) {
      await prisma.profile.create({
        data: {
          id,
          email,
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Profile creation error:", error);
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    );
  }
}
