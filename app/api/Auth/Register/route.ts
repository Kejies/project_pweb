import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, Email & Password required" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("Users")
      .insert({ name, email, password: hashedPassword })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message || error }, { status: 500 });
    }

    return NextResponse.json({ message: "Register success", data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}