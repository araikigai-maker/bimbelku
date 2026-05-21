import { prisma } from "@/lib/db";
import { compare } from "bcryptjs";
import { NextResponse } from "next/server";

// Generic error message - prevents user enumeration attacks
// (hacker cannot tell if email exists or password is wrong)
const AUTH_ERROR = "Email atau password salah";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format email tidak valid" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });

    // Use same error for both "not found" and "wrong password"
    // This prevents attackers from knowing which emails are registered
    if (!user) {
      return NextResponse.json({ error: AUTH_ERROR }, { status: 401 });
    }

    const isValid = await compare(password, user.password);

    if (!isValid) {
      return NextResponse.json({ error: AUTH_ERROR }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("[AUTH/LOGIN] Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
