import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const tryout = await prisma.tryout.findUnique({
      where: { slug: params.slug },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!tryout) {
      return NextResponse.json({ error: "Tryout tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ tryout });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
