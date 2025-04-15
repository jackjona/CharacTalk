import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export default async function Home() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Query all characters
  const { data: characters, error } = await supabase
    .from("biographies")
    .select("character_id, character_name, description, img_url, public")
    .eq("public", true);

  if (error) {
    throw new Error(
      "Error fetching characters from database: " + error.message
    );
  }

  return (
    <div className="flex flex-col p-10 items-center justify-center">
      <main className="flex flex-wrap justify-center items-center gap-12 max-w-6xl mx-auto pb-6">
        {characters.map((character) => (
          <Link
            key={character.character_id}
            href={`/chat/${character.character_id}`}
            className="relative group block bg-slate-700 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 w-64 h-78"
          >
            <img
              className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:opacity-90"
              src={character.img_url}
              alt={character.character_name}
              width="256"
              height="312"
            />
            <div className="absolute bottom-0 w-full px-2 py-2 pt-8 text-center bg-gradient-to-t from-black to-transparent">
              <h2 className="text-lg font-semibold text-white">
                {character.character_name}
              </h2>
              <p className="text-sm text-gray-300">{character.description}</p>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}
