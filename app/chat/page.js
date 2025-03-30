"use client";

import { useState } from "react";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

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
    // Cmd (⌘) + Enter or Ctrl + Enter to send message
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault(); // Prevent default behavior (like adding a new line)
      sendMessage();
    }
    // Enter (alone) sends the message
    else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent adding a newline
      sendMessage();
    }
    // Escape (Esc) clears the message
    else if (e.key === "Escape") {
      e.preventDefault(); // Prevent default browser actions
      setMessage(""); // Clear the input field
    }
    // Shift + Enter for new line
    // No special handling needed as Shift + Enter is the default behavior for textareas
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ textAlign: "center" }}>AI Chat</h1>
      <div
        style={{
          border: "1px solid #ddd",
          padding: "10px",
          borderRadius: "8px",
          marginBottom: "10px",
        }}
      >
        {chatHistory.map((chat, index) => (
          <p
            key={index}
            style={{ textAlign: chat.sender === "user" ? "right" : "left" }}
          >
            <strong>{chat.sender === "user" ? "You" : "AI"}: </strong>
            {chat.text}
          </p>
        ))}
      </div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown} // Listen for keypress events
        placeholder="Type your message..."
        rows="4"
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "4px",
          marginBottom: "10px",
        }}
      />
      <button
        onClick={sendMessage}
        style={{
          width: "100%",
          padding: "10px",
          background: "#4a90e2",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
        }}
      >
        Send
      </button>
    </div>
  );
}
