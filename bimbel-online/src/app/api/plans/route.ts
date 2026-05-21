import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// GET /api/plans — public endpoint to get all active plans
export async function GET() {
  try {
    const plans = await prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    // Parse features JSON for each plan
    const parsedPlans = plans.map((plan) => ({
      ...plan,
      features: (() => {
        try { return JSON.parse(plan.features); } catch { return []; }
      })(),
    }));

    return NextResponse.json({ plans: parsedPlans });
  } catch (error) {
    console.error("[API/PLANS] GET Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
