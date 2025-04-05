"use client";
import { useState, useEffect, use } from "react";
import ChatPage from "../../components/ChatPage";

export default function SupabaseMain({ params }) {
  const { slug } = use(params);
  const [character, setCharacter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        setIsLoading(true);

        const response = await fetch("/api/fetch-character", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ character_id: slug }), // Use slug as character_id
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setCharacter(data.character);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacter();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-10 border-r-24 border-b-10 border-l-24 border-blue-600"></div>
      </div>
    );
  }
  if (error) return <div>Error: {error}</div>;
  if (!character) return <div>Character not found.</div>;

  // Pass the fetched data and props to the reusable Home component
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 sm:p-8">
      <header className="bg-blue-600 text-white py-4 px-6 text-center text-xl font-bold shadow-md rounded-xl">
        Character Chat AI
      </header>
      <ChatPage character={character} character_id={slug} />
    </div>
  );
}
