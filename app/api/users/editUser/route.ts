import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: "name & email required" }, { status: 400 });
    }

    const { data: updated, error } = await supabase
      .from("Users")
      .update({name})
      .eq("email", email);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ dsuccess: true, user: updated ?? null }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
