"use client";

import { useState } from "react";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const formatMessage = (text) => {
    // Preserve **text** formatting for italics
    return text.replace(/\*\*(.*?)\*\*/g, "<em>$1</em>");
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      setChatHistory(data.history); // Update chat history from API response
    } catch {
      setChatHistory((prev) => [
        ...prev,
        { sender: "ai", text: "Error occurred." },
      ]);
    } finally {
      setMessage(""); // Clear input after sending
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
    <div className="flex flex-col h-screen w-full bg-gray-100">
      {/* Header */}
      <header className="bg-blue-500 text-white py-4 px-6 text-center text-xl font-bold">
        AI Chat
      </header>

      {/* Chat Container */}
      <div className="flex flex-1 flex-col p-4 space-y-4 overflow-y-auto">
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`flex ${
              chat.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-md break-words shadow ${
                chat.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-green-500 text-white"
              }`}
              dangerouslySetInnerHTML={{
                __html: `<strong>${
                  chat.sender === "user" ? "You" : "AI"
                }:</strong> ${formatMessage(chat.text)}`,
              }}
            ></div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex items-center p-4 border-t border-gray-300">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows="2"
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
