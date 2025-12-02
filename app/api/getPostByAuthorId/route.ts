import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    const { data: post, error } = await supabase
      .from("Posts")
      .select("*")
      .eq("user_id", id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    return NextResponse.json({ post }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
