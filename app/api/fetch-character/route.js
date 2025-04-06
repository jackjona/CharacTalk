import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Supabase URL or Key is missing from environment variables.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function POST(request) {
  const body = await request.json();
  const { character_id } = body;

  if (!character_id) {
    return NextResponse.json(
      { error: "Character ID is required" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("biographies")
      .select("character_id, character_name, description, biography, voice")
      .eq("character_id", character_id)
      .single();

    if (error) {
      throw new Error("Failed to fetch character data.");
    }

    return NextResponse.json({ character: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
