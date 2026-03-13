import { NextResponse } from "next/server";
import { generateInterviewPrep } from "@/app/tools/interview-prep/lib/interview-generator";

export async function POST(req: Request) {
  const { role, jobDescription } = await req.json();
  const result = generateInterviewPrep(role, jobDescription);
  return NextResponse.json(result);
}