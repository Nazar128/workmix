import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("announcements")
    .select("id, title, message, type")
    .eq("is_active", true)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

  return NextResponse.json(data ?? []);
}