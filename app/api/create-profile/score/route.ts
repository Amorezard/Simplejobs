import { NextResponse } from "next/server";
import { compareKeywords } from "@/lib/keyword-extractor";

export async function POST(req: Request) {
  try {
    const { jobDescription, resumeText } = await req.json();
    const result = compareKeywords(jobDescription, resumeText);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to analyze keywords" },
      { status: 500 }
    );
  }
}
