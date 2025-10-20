import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
    if (claimsError || !claimsData?.claims?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = String(claimsData.claims.sub);

    const { data, error } = await supabase
      .from("conversation_memory")
      .select("id, user_id, role, message, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: (e as Error).message || "Unexpected error" },
      { status: 500 },
    );
  }
}


