import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { activateSubscription } from "@/lib/subscription";

// GET /api/admin/subscriptions — list all subscribers for admin dashboard
export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get("status") || undefined;
    const now = new Date();

    const subscriptions = await prisma.subscription.findMany({
      where: status ? { status } : undefined,
      include: {
        user: { select: { id: true, name: true, email: true } },
        plan: { select: { name: true, slug: true, price: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Enrich with computed isExpired flag
    const enriched = subscriptions.map((sub) => ({
      ...sub,
      isExpired: sub.endDate ? sub.endDate < now : false,
    }));

    return NextResponse.json({ subscriptions: enriched });
  } catch (error) {
    console.error("[API/ADMIN/SUBSCRIPTIONS] GET Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

// PATCH /api/admin/subscriptions — admin activate or cancel a subscription
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { subscriptionId, action } = body; // action: "cancel"

    if (!subscriptionId || !action) {
      return NextResponse.json({ error: "subscriptionId dan action wajib diisi" }, { status: 400 });
    }

    if (action === "cancel") {
      const sub = await prisma.subscription.update({
        where: { id: subscriptionId },
        data: { status: "CANCELLED" },
      });
      return NextResponse.json({ subscription: sub });
    }

    return NextResponse.json({ error: "Action tidak dikenali" }, { status: 400 });
  } catch (error) {
    console.error("[API/ADMIN/SUBSCRIPTIONS] PATCH Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

// POST /api/admin/subscriptions — admin manually activate subscription
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, planSlug, durationDays, notes } = body;

    if (!userId || !planSlug) {
      return NextResponse.json({ error: "userId dan planSlug wajib diisi" }, { status: 400 });
    }

    const subscription = await activateSubscription({
      userId,
      planSlug,
      durationDays: durationDays ?? 30,
      notes: notes ?? "Diaktifkan oleh Admin",
      activatedBy: "MANUAL",
    });

    return NextResponse.json({ subscription }, { status: 201 });
  } catch (error: any) {
    console.error("[API/ADMIN/SUBSCRIPTIONS] POST Error:", error);
    return NextResponse.json({ error: error.message || "Terjadi kesalahan" }, { status: 500 });
  }
}
