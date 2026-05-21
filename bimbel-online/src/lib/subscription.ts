import { prisma } from "@/lib/db";

// ============================================================
// PLAN FEATURE DEFINITIONS
// These define what each plan unlocks in the system.
// When Payment Gateway is active, these are checked automatically.
// ============================================================

export type PlanSlug = "FREE" | "PREMIUM" | "ENTERPRISE";

export type Feature =
  | "tryout_unlimited"        // akses semua tryout
  | "cat_unlimited"           // akses semua simulasi CAT
  | "cat_review"              // akses halaman pembahasan
  | "leaderboard"             // akses leaderboard nasional
  | "course_all"              // akses semua kursus & video
  | "mentor_consultation"     // konsultasi mentor
  | "analytics_advanced"      // dashboard analitik lanjutan
  | "certificate";            // sertifikat kelulusan

export const PLAN_FEATURES: Record<PlanSlug, Feature[]> = {
  FREE: [
    "leaderboard",            // leaderboard tetap publik
    "cat_review",             // review/pembahasan tetap bisa diakses
  ],
  PREMIUM: [
    "tryout_unlimited",
    "cat_unlimited",
    "cat_review",
    "leaderboard",
    "course_all",
    "mentor_consultation",
    "analytics_advanced",
    "certificate",
  ],
  ENTERPRISE: [
    "tryout_unlimited",
    "cat_unlimited",
    "cat_review",
    "leaderboard",
    "course_all",
    "mentor_consultation",
    "analytics_advanced",
    "certificate",
  ],
};

// ============================================================
// CORE FUNCTIONS
// ============================================================

/**
 * Get the active subscription plan slug for a user.
 * Returns "FREE" if no active subscription found.
 */
export async function getUserPlan(userId: string): Promise<PlanSlug> {
  try {
    const now = new Date();
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: "ACTIVE",
        OR: [
          { endDate: null },           // lifetime / no expiry
          { endDate: { gt: now } },    // still within subscription period
        ],
      },
      include: {
        plan: { select: { slug: true } },
      },
      orderBy: { startDate: "desc" },  // most recent first
    });

    if (!subscription) return "FREE";
    return (subscription.plan.slug as PlanSlug) || "FREE";
  } catch (error) {
    console.error("[subscription.getUserPlan] Error:", error);
    return "FREE"; // fail-safe: default to FREE
  }
}

/**
 * Check if a user has access to a specific feature.
 * Usage: const canAccess = await hasAccess(userId, "cat_unlimited");
 */
export async function hasAccess(userId: string, feature: Feature): Promise<boolean> {
  const plan = await getUserPlan(userId);
  return PLAN_FEATURES[plan]?.includes(feature) ?? false;
}

/**
 * Get full subscription info for a user (for dashboard display).
 */
export async function getUserSubscription(userId: string) {
  const now = new Date();
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      OR: [
        { endDate: null },
        { endDate: { gt: now } },
      ],
    },
    include: {
      plan: true,
    },
    orderBy: { startDate: "desc" },
  });

  if (!subscription) {
    return {
      planSlug: "FREE" as PlanSlug,
      planName: "Gratis",
      isActive: false,
      endDate: null,
      activatedBy: null,
    };
  }

  return {
    planSlug: subscription.plan.slug as PlanSlug,
    planName: subscription.plan.name,
    isActive: true,
    endDate: subscription.endDate,
    activatedBy: subscription.activatedBy,
    startDate: subscription.startDate,
  };
}

/**
 * Manually activate a subscription for a user.
 * Used by admin before Payment Gateway is live.
 */
export async function activateSubscription({
  userId,
  planSlug,
  durationDays,
  notes,
  activatedBy = "MANUAL",
}: {
  userId: string;
  planSlug: string;
  durationDays: number;
  notes?: string;
  activatedBy?: string;
}) {
  const plan = await prisma.plan.findUnique({ where: { slug: planSlug } });
  if (!plan) throw new Error(`Plan "${planSlug}" tidak ditemukan`);

  const startDate = new Date();
  const endDate = durationDays > 0
    ? new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000)
    : null; // null = lifetime

  // Deactivate any existing active subscriptions
  await prisma.subscription.updateMany({
    where: { userId, status: "ACTIVE" },
    data: { status: "CANCELLED" },
  });

  // Create new subscription
  const subscription = await prisma.subscription.create({
    data: {
      userId,
      planId: plan.id,
      status: "ACTIVE",
      startDate,
      endDate,
      activatedBy,
      notes,
    },
    include: { plan: true },
  });

  return subscription;
}
