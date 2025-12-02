import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request, { params }: { params?: { id?: string } }) {
  try {
    console.log("[/api/postById] raw params:", params);
    let id = params?.id;
    if (!id) {
      try {
        const url = new URL(req.url);
        const parts = url.pathname.split("/").filter(Boolean);
        id = parts[parts.length - 1];
        console.log("[/api/postById] fallback id from url:", id);
      } catch (e) {
        console.error("[/api/postById] failed to parse url for fallback id:", e);
      }
    }

    if (!id) {
      console.warn("[/api/postById] missing id after fallback");
      return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
    }

    const numericId = Number(id);
    console.log("[/api/postById] final id (numeric):", numericId);

    const { data, error } = await supabase
      .from("Posts")
      .select("*")
      .eq("id", numericId)
      .single();

    if (error) {
      console.error("[/api/postById] supabase error:", error);
      return NextResponse.json({ error: error.message || error }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("[/api/postById] unexpected:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
