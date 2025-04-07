"use client";
import { useState } from "react";

const ChatPage = ({ character, character_id }) => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  const formatMessage = (text) => text.replace(/\*\*(.*?)\*\*/g, "<em>$1</em>");

  const sendMessage = async () => {
    if (!message.trim() || isSending) return;
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ character_id, message, history: chatHistory }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setChatHistory(data.history);
    } catch (error) {
      console.error(error);
      setChatHistory((prev) => [
        ...prev,
        { sender: "ai", text: "Error occurred while processing your request." },
      ]);
    } finally {
      setMessage("");
      setIsSending(false);
    }
  };

  const generateAudio = async (text) => {
    if (isLoadingAudio) return;
    setIsLoadingAudio(true);

    // The code for https://tts.cyyz.workers.dev can be found at: app/api/tts/route.js.
    try {
      const response = await fetch("https://tts.cyyz.workers.dev", {
        method: "POST",
        body: JSON.stringify({ text, voice: character.voice, format: "mp3" }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);

      const audio = new Audio(audioUrl);
      audio.play();
      audio.onended = () => setIsLoadingAudio(false);
    } catch (error) {
      console.error("Error streaming audio:", error);
      setIsLoadingAudio(false);
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
    <main className="flex flex-col flex-1 w-full max-w-3xl bg-slate-800 rounded-lg shadow-lg p-4 mt-8 space-y-4 overflow-hidden">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-white">
          You are chatting with {character.character_name}
        </h1>
      </div>

      <section className="flex-1 overflow-y-auto space-y-3">
        {chatHistory.map((chat, index) => {
          const messagePadding = chat.sender === "user" ? "py-2" : "py-2 pb-10"; // Prevent play button overlap in AI messages
          return (
            <div
              key={index}
              className={`flex ${
                chat.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`relative px-4 ${messagePadding} m-2 rounded-2xl max-w-md break-words shadow-md ${
                  chat.sender === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-700 text-white"
                }`}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: `<strong>${
                      chat.sender === "user" ? "You" : "AI"
                    }:</strong> ${formatMessage(chat.text)}`,
                  }}
                />
                {chat.sender !== "user" && (
                  <button
                    className={`absolute bottom-1 right-1 px-2 py-1 rounded-full ${
                      isLoadingAudio
                        ? "animate-pulse bg-fuchsia-500 cursor-not-allowed"
                        : "bg-fuchsia-500 hover:bg-fuchsia-600"
                    }`}
                    onClick={() => generateAudio(chat.text)}
                    disabled={isLoadingAudio}
                    aria-label="Play Message"
                  >
                    &#9658;
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </section>

      <footer className="border-t border-gray-700 pt-4 pb-0">
        <p className="text-center mb-2 text-gray-300 text-sm">
          Use double asterisks (ex. **smiles**) to express emotions or actions.
        </p>
        <div className="flex">
          <textarea
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows="2"
            placeholder="Type your message..."
            className="flex-1 resize-none p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={sendMessage}
            disabled={isSending}
            className={`ml-3 px-4 py-2 bg-indigo-600 text-white rounded-lg transition-colors duration-200 ${
              isSending
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-indigo-700"
            }`}
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>

        <p className="text-center mt-2 text-gray-500 text-sm">
          Content is AI-generated.
        </p>
      </footer>
    </main>
  );
};

export default ChatPage;
