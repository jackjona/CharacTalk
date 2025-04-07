"use client";
import { useState, useEffect, use } from "react";
import ChatPage from "../../components/ChatPage";
import Link from "next/link";
import Header from "@/app/components/Header";
import Loader from "@/app/components/Loader";

export default function ChatSlug({ params }) {
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

  /*   if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-800">
        <div className="animate-spin rounded-full h-16 w-16 border-t-10 border-r-24 border-b-10 border-l-24 border-blue-600"></div>
      </div>
    );
  } */

  if (isLoading) {
    return <Loader />;
  }
  if (error) return <div>Error: {error}</div>;
  if (!character) return <div>Character not found.</div>;

  // Pass the fetched data and props to the reusable Home component
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center p-4 sm:p-8">
      <Header />
      <ChatPage character={character} character_id={slug} />
    </div>
  );
}
