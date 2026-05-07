import { NextResponse } from "next/server";
import { ensureDbInitialized } from "@/lib/init-db";

export async function GET() {
  // Auto-initialize database on first API call
  await ensureDbInitialized();

  return NextResponse.json({
    name: "نبغ - منصة التعلم الذكي",
    version: "1.0.0",
    status: "running"
  });
}
