"use client";

import { useState } from "react";
// import Image from "next/image";

export default function Home() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(null);

  const formatMessage = (text) => {
    return text.replace(/\*\*(.*?)\*\*/g, "<em>$1</em>");
  };

  const sendMessage = async () => {
    if (!message.trim() || isSending) return; // Prevent double messages

    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      setChatHistory(data.history);
    } catch {
      setChatHistory((prev) => [
        ...prev,
        { sender: "ai", text: "Error occurred." },
      ]);
    } finally {
      setMessage("");
      setIsSending(false);
    }
  };

  const generateAudio = async (text) => {
    setIsLoadingAudio(true);
    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        body: JSON.stringify({
          text: text,
          voice: "en-US-AndrewMultilingualNeural",
          format: "mp3",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);

      const audio = new Audio(audioUrl);
      audio.play();
      setIsLoadingAudio(false);

      console.log("Audio is playing");
    } catch (error) {
      console.error("Error streaming audio:", error);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 sm:p-8">
      {/*  <header className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </header> */}
      <header className="bg-blue-600 text-white py-4 px-6 text-center text-xl font-bold shadow-md rounded-xl">
        Character Chat AI
      </header>

      <main className="flex flex-col flex-1 w-full max-w-3xl bg-white rounded-lg shadow-lg p-4 mt-8 space-y-4 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              className={`flex ${
                chat.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`relative px-4 py-2 m-2 rounded-lg max-w-md break-words shadow ${
                  chat.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-green-500 text-white pb-8"
                }`}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: `<strong>${
                      chat.sender === "user" ? "You" : "AI"
                    }:</strong> ${formatMessage(chat.text)}`,
                  }}
                ></div>

                {chat.sender !== "user" && (
                  <button
                    className={`absolute bottom-1 right-1 px-2 py-1 rounded-full ${
                      isLoadingAudio
                        ? "animate-pulse bg-fuchsia-500 cursor-not-allowed"
                        : "bg-fuchsia-500 hover:bg-fuchsia-600"
                    }`}
                    onClick={() => generateAudio(chat.text)}
                    aria-label="Play Message"
                  >
                    &#9658;
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center p-4 pb-0 border-t border-gray-300">
          <textarea
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows="2"
            className="flex-1 p-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            onClick={sendMessage}
            className={`ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition ${
              isSending ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
        <p className="text-center m-0 p-0 text-gray-500 text-sm">
          Content is AI-generated.
        </p>
      </main>
    </div>
  );
}
