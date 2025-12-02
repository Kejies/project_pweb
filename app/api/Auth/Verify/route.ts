// /app/api/verify/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ logged: false, error: "no token" }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return NextResponse.json({ logged: false, error: "missing secret" }, { status: 500 });
    }

    try {
      const payload = jwt.verify(token, secret) as { id?: string; email?: string; [k: string]: any };
      return NextResponse.json({ logged: true, user: { id: payload.id, email: payload.email } }, { status: 200 });
    } catch (verifyErr) {
      console.error("jwt verify failed:", verifyErr);
      return NextResponse.json({ logged: false, error: "invalid token" }, { status: 401 });
    }
  } catch (err) {
    console.error("unexpected error:", err);
    return NextResponse.json({ logged: false, error: "internal" }, { status: 500 });
  }
}
