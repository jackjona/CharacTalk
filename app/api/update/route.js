import { createClient } from "@supabase/supabase-js";

export async function GET(request) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const currentTime = new Date().toISOString();

  const { data, error } = await supabase
    .from("notes")
    .upsert([
      {
        id: 1,
        notes: `Last updated at ${currentTime}`,
        created_at: currentTime,
      },
    ])
    .select();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ message: "Note updated", data }), {
    status: 200,
  });
}
