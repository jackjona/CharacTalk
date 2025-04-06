import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export default async function Home() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Query all characters
  const { data: characters, error } = await supabase
    .from("biographies")
    .select(
      "character_id, character_name, description, biography, voice, img_url, public"
    )
    .eq("public", true);

  if (error) {
    throw new Error(
      "Error fetching characters from database: " + error.message
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 items-center justify-center">
      <header className="justify-center items-center bg-slate-700 text-gray-200 py-4 px-6 text-xl w-2xl font-bold shadow-md rounded-xl mb-8 text-center">
        Homepage
      </header>

      <main className="flex flex-wrap justify-center items-center gap-12 max-w-6xl mx-auto">
        {characters.map((character) => (
          <Link
            key={character.character_id}
            href={`/chat/${character.character_id}`}
            className="relative group block bg-slate-700 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 w-64 h-64"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:opacity-70"
              style={{ backgroundImage: `url(${character.img_url})` }}
            ></div>
            <div className="relative px-4 pt-24 space-y-2 text-center">
              <h2 className="text-lg font-semibold">
                {character.character_name}
              </h2>
              <p className="text-sm text-gray-300">{character.description}</p>
            </div>
            <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>
          </Link>
        ))}
      </main>
    </div>
  );
}
