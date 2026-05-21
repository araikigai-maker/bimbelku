import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getUserSubscription, activateSubscription } from "@/lib/subscription";

// GET /api/subscriptions?userId=xxx
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId diperlukan" }, { status: 400 });
    }

    const subscription = await getUserSubscription(userId);
    return NextResponse.json({ subscription });
  } catch (error) {
    console.error("[API/SUBSCRIPTIONS] GET Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

// POST /api/subscriptions — akan dipanggil oleh Payment Gateway Webhook nanti
// Untuk sekarang, bisa dipakai admin untuk aktivasi manual via API
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, planSlug, durationDays, notes, activatedBy } = body;

    if (!userId || !planSlug) {
      return NextResponse.json({ error: "userId dan planSlug wajib diisi" }, { status: 400 });
    }

    const subscription = await activateSubscription({
      userId,
      planSlug,
      durationDays: durationDays ?? 30,
      notes,
      activatedBy: activatedBy ?? "MANUAL",
    });

    return NextResponse.json({ subscription }, { status: 201 });
  } catch (error: any) {
    console.error("[API/SUBSCRIPTIONS] POST Error:", error);
    return NextResponse.json({ error: error.message || "Terjadi kesalahan" }, { status: 500 });
  }
}
