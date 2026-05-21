import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tryouts = await prisma.tryout.findMany({
      where: {
        catAvailableFrom: { not: null },
        OR: [
          { catAvailableUntil: null },
          { catAvailableUntil: { gt: new Date() } },
        ],
      },
      include: { questions: { select: { id: true, subtest: true } } },
      orderBy: { catAvailableFrom: "asc" },
    });
    return NextResponse.json({ tryouts });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { tryoutId, userId, token } = await request.json();

    if (!tryoutId || !userId) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const tryout = await prisma.tryout.findUnique({ where: { id: tryoutId } });
    if (!tryout) {
      return NextResponse.json({ error: "Tryout tidak ditemukan" }, { status: 404 });
    }

    const existingActive = await prisma.catSession.findFirst({
      where: { userId, tryoutId, status: "active" },
    });
    if (existingActive) {
      return NextResponse.json({ session: existingActive, existing: true });
    }

    const sessionToken = token || Math.random().toString(36).substring(2, 10).toUpperCase();

    const session = await prisma.catSession.create({
      data: {
        userId,
        tryoutId,
        token: sessionToken,
        remainingSeconds: tryout.duration * 60,
        status: "active",
      },
    });

    return NextResponse.json({ session, token: sessionToken }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
