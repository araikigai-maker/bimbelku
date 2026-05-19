import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const results = await prisma.tryoutResult.findMany({
      include: {
        user: { select: { name: true, email: true } },
        tryout: { select: { title: true, category: true, passingGrade: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
