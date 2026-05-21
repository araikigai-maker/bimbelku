import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Support both userId (preferred, secure) and email (legacy fallback)
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");

    if (!userId && !email) {
      return NextResponse.json({ error: "userId atau email diperlukan" }, { status: 400 });
    }

    let resolvedUserId = userId;

    // If only email is provided, resolve to userId first
    if (!resolvedUserId && email) {
      const user = await prisma.user.findUnique({ 
        where: { email: email.toLowerCase() },
        select: { id: true }
      });
      if (!user) {
        return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
      }
      resolvedUserId = user.id;
    }

    const sessions = await prisma.catSession.findMany({
      where: { 
        userId: resolvedUserId!,
        status: "submitted"
      },
      include: {
        tryout: {
          select: { title: true, slug: true, catPassingGradePoints: true, passingGrade: true },
        },
      },
      orderBy: { endedAt: "desc" },
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("[CAT/HISTORY] Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
