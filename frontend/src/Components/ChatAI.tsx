"use client";
import React, { useState, useRef } from "react";
import { FaArrowRight } from "react-icons/fa";
import { BACKEND_URL } from "../../config";
import { Step, FileItem } from "../types/index";
import axios from "axios";
import { parseXml } from "@/steps";
import { StepsList } from "./StepsList";


const ChatAI = () => {
  const [prompt, setPrompt] = useState("");
  const [llmMessages, setLlmMessages] = useState<{ sender: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const msgEnding = useRef<HTMLDivElement | null>(null);

  const [steps, setSteps] = useState<Step[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [hasSubmittedInitialPrompt, setHasSubmittedInitialPrompt] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const sendMessage = async (inputPrompt: string) => {
    if (!inputPrompt.trim()) return;

    setLoading(true);
    setError("");

    const userMessage = { sender: "user", text: inputPrompt };
    setLlmMessages((prev) => [...prev, userMessage]);

    try {
      // First call to /template
      const response = await axios.patch(`${BACKEND_URL}/template`, {
        response: inputPrompt.trim()
      });

      const { prompts, uiPrompts } = response.data;

      // Parse UI steps
      setSteps(parseXml(uiPrompts[0]));

      // Second call to /chat
      const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
        messages: [...prompts, inputPrompt].map((content) => ({
          role: "user",
          content
        }))
      });

      // Optional: Add assistant's response to chat
      if (stepsResponse.data?.reply) {
        setLlmMessages((prev) => [
          ...prev,
          { sender: "assistant", text: stepsResponse.data.reply }
        ]);
      }

    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(prompt);
  };

  return (
    <div className="h-full flex flex-col px-4 py-2 w-full">
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {llmMessages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
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
            className="w-full px-6 py-4 pr-14 rounded-xl border border-gray-700 shadow-sm focus:ring-2 text-white resize-none"
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
