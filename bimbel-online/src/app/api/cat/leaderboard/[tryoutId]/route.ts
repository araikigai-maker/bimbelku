import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { tryoutId: string } }
) {
  try {
    const { tryoutId } = params;

    // We fetch the tryout title to display on the leaderboard
    const tryout = await prisma.tryout.findUnique({
      where: { id: tryoutId },
      select: { title: true }
    });

    if (!tryout) {
      return NextResponse.json({ error: "Tryout tidak ditemukan" }, { status: 404 });
    }

    // Fetch the highest score per user for this tryout
    // Prisma doesn't support generic GROUP BY with includes easily for the highest row.
    // So we fetch all results ordered by points, then filter distinct users manually.
    const allResults = await prisma.tryoutResult.findMany({
      where: { 
        tryoutId,
        user: {
          role: {
            notIn: ["admin", "ADMIN", "Admin"] // Exclude admin accounts
          }
        }
      },
      include: {
        user: {
          select: { name: true }
        }
      },
      orderBy: [
        { earnedPoints: 'desc' },
        { score: 'desc' },
        { createdAt: 'asc' } // If points are same, whoever got it first
      ]
    });

    // Deduplicate so a user only appears once with their best score
    const uniqueUsers = new Set();
    const topResults = [];

    for (const result of allResults) {
      if (!uniqueUsers.has(result.userId)) {
        uniqueUsers.add(result.userId);
        topResults.push({
          id: result.id,
          userName: result.user.name || "Peserta Anonim",
          earnedPoints: result.earnedPoints,
          maxPoints: result.maxPoints,
          score: result.score,
          createdAt: result.createdAt,
        });

        if (topResults.length >= 100) break; // Limit to top 100
      }
    }

    return NextResponse.json({ 
      tryoutTitle: tryout.title,
      leaderboard: topResults 
    });
  } catch (error) {
    console.error("Leaderboard API Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
