import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await prisma.catSession.findUnique({
      where: { id: params.id },
      include: {
        tryout: true,
        answers: true,
        user: { select: { name: true, email: true } },
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Session tidak ditemukan" }, { status: 404 });
    }

    const elapsed = Math.floor(
      (Date.now() - new Date(session.startedAt).getTime()) / 1000
    );
    const remaining = Math.max(0, session.remainingSeconds - elapsed);

    if (remaining <= 0 && session.status === "active") {
      await prisma.catSession.update({
        where: { id: params.id },
        data: { status: "timeout", endedAt: new Date() },
      });
      return NextResponse.json({ session: { ...session, status: "timeout" }, remaining: 0 });
    }

    return NextResponse.json({ session, remaining });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
