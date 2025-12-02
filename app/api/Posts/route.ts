import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data: posts, error } = await supabase
    .from("Posts")
    .select("*");

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(posts, { status: 200 });
}
