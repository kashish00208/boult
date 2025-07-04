"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaArrowRight } from "react-icons/fa";

const ChatAI = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const msgEnding = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    msgEnding.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");

    const userMessage = { sender: "user", text: prompt };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch("", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: prompt }),
      });

      if (!res.ok) {
        throw new Error("Network Error. Try again later.");
      }

      const data = await res.json();

      const botMessage = { sender: "bot", text: data.output || "No response from AI." };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  return (
    <div className="h-full flex flex-col px-4 py-2 w-full">
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs ${
                msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={msgEnding} />
      </div>
      {error && <div className="text-red-600 mb-2 text-sm">{error}</div>}
      <form onSubmit={handleSubmitForm} className="w-full">
        <div className="relative">
          <textarea
            rows={2}
            placeholder="Describe your idea..."
            value={prompt}
            onChange={handleInputChange}
            className="w-full px-6 py-4 pr-14 rounded-xl border border-gray-700 shadow-sm focus:ring-2 resize-none"
            disabled={loading}
          />
          <button
            type="submit"
            className="absolute top-3 right-4 text-gray-700 hover:text-gray-900 transition-colors"
            disabled={loading}
          >
            <FaArrowRight size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatAI;