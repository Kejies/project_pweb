import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { title, content, thumbnail, user_id, author } = await req.json();
    console.log(title, content, thumbnail, user_id, author)
    if (!title || !content || !user_id || !author) {
      return NextResponse.json(
        { error: "title, content, user_id & author required" },
        { status: 400 }
      );
    }

    const { data: post, error } = await supabase
      .from("Posts")
      .insert({
        title,
        content,
        thumbnail,
        user_id,
        author,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, post }, { status: 201 });

  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
