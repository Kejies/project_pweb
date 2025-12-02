import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { title, content, thumbnail, user_id, author, id } = await req.json();
    console.log(title, content, thumbnail, user_id, author, id)

    if (!title || !content || !user_id || !author || !id) {
      return NextResponse.json({ error: "title, content, user_id, author, id required" }, { status: 400 });
    }

    const { data: updated, error } = await supabase
      .from("Posts")
      .update({title, content, thumbnail, user_id, author })
      .eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ dsuccess: true, user: updated ?? null }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
