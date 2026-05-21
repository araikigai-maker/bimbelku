import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error || !code) {
      return NextResponse.redirect(
        new URL("/login?error=google_auth_failed", req.url)
      );
    }

    const clientId = process.env.GOOGLE_CLIENT_ID!;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
    const redirectUri = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/google/callback`;

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenRes.json();
    if (!tokens.access_token) {
      return NextResponse.redirect(
        new URL("/login?error=token_exchange_failed", req.url)
      );
    }

    const userInfoRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${tokens.access_token}` } }
    );
    const googleUser = await userInfoRes.json();

    if (!googleUser.email) {
      return NextResponse.redirect(
        new URL("/login?error=email_required", req.url)
      );
    }

    let user = await prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      const hashedPassword = await bcrypt.hash(
        `google_${googleUser.id}_${Date.now()}`,
        12
      );
      user = await prisma.user.create({
        data: {
          name: googleUser.name || googleUser.email.split("@")[0],
          email: googleUser.email,
          password: hashedPassword,
          role: "STUDENT",
        },
      });
    }

    const buf = Buffer.from(
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      })
    ).toString("base64");

    return NextResponse.redirect(
      new URL(`/auth/callback?data=${encodeURIComponent(buf)}`, req.url)
    );
  } catch (err) {
    console.error("Google callback error:", err);
    return NextResponse.redirect(
      new URL("/login?error=server_error", req.url)
    );
  }
}
