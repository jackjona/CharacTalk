"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/character");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();

        const formattedReply = formatMessage(result.reply || "");
        setData({ reply: formattedReply });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to format message
  const formatMessage = (text) => {
    let formattedText = text.replace(/[{|"|'|\]|}|]|{{|}}|\[|\]/g, "");

    formattedText = formattedText.replace(/\*(.*?)\*/g, "<em>$1</em>");

    formattedText = formattedText
      .split(". ")
      .map((sentence) => `<p>${sentence.trim()}.</p>`)
      .join("");

    return formattedText;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 space-y-6">
        {loading ? (
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-blue-500 mt-4 text-lg font-semibold">
              Loading...
            </p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            <p className="text-lg font-semibold">Error: {error}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div
              className="text-gray-700 text-base leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: data.reply }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}
