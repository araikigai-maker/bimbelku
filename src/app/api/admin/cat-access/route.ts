import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const accessList = await prisma.catAccess.findMany({
      orderBy: { grantedAt: "desc" },
    });
    return NextResponse.json({ accessList });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
