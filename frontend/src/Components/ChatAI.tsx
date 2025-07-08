"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import { BACKEND_URL } from "../../config";
import { Step, FileItem } from "../types/index";
import { parseXml } from "@/steps";
import getLanguageFromExtension from "./Languatext";
import { Content } from "next/font/google";
import axios from "axios";

const ChatAI = () => {
  const [prompt, setPrompt] = useState("");
  const [chatMsgs, setchatMsgs] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const msgEnding = useRef<HTMLDivElement | null>(null);

  const [steps, setSteps] = useState<Step[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [fileContent, setFileContent] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [language, setLanguage] = useState("plaintext");

  const handleFileClick = async (fileName: string) => {
    setSelectedFile(fileName);
    const res = await fetch(`/files/${fileName}`);
    const text = await res.text();
    setFileContent(text);
    setLanguage(getLanguageFromExtension(fileName));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const sendMessage = async (inputPrompt: string) => {
  if (!inputPrompt.trim()) return;

  setLoading(true);
  setError("");

  const userMessage = { sender: "user", text: inputPrompt };
  setchatMsgs((prev) => [...prev, userMessage]);

  try {
    const res = await fetch(`${BACKEND_URL}/template`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: inputPrompt }),
    });

    if (!res.ok) {
      console.error("Error occurred while generating response");
      setError("Failed to fetch response from server.");
      return;
    }

    const data = await res.json();
    const { prompts, uiPrompts } = data;

    setSteps(parseXml(uiPrompts[0]).map((x: Step) => ({
      ...x,
      status: "pending"
    })));

    setLoading(true);

    const results = parseXml(prompts[1]);
    console.log(results);

    const generatedFiles: FileItem[] = results.map((item: any) => ({
      name: item.path,
      type: "file",
      path: item.path,
      content: item.content,
    }));

    setFiles(generatedFiles);

  } catch (err) {
    console.error("Error:", err);
    setError("Something went wrong while sending the message.");
  } finally {
    setLoading(false);
    setPrompt("");
  }
};
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(prompt);
  };

  useEffect(() => {
    msgEnding.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMsgs]);

  useEffect(()=>{
    msgEnding.current?.scrollIntoView({behavior:"smooth"})
  },[files])

  return (
    <div className="h-screen pt-20 px-6 pb-4 border-gray-700">
      <div className="flex h-full gap-4">
        <div className="w-2/5 rounded-lg shadow-md p-4 overflow-hidden">
          <div className="h-full flex flex-col px-4 py-2 w-full">
            <div className="flex-1 overflow-y-auto mb-4 space-y-2">
              {chatMsgs.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
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
        </div>
      {/* code editor*/}
        <div className="w-3/5 border border-gray-700 rounded-lg shadow-md p-4 overflow-hidden">
          <div className="flex h-screen font-mono bg-[#1e1e1e] text-gray-100">
            <div className="w-48 bg-[#252526] border-r border-gray-700 p-3 overflow-hidden-" >
              <h3 className="text-sm font-bold text-gray-300 pb-1.5 border-b border-slate-600">
                EXPLORER
              </h3>
              <ul className="space-y-1">
                {files.map((file) => (
                  <li key={file.name}>
                    <button
                      onClick={() => handleFileClick(file.path || file.name)}
                      className={`w-full text-left px-2 py-1 rounded text-sm ${
                        selectedFile === (file.path || file.name)
                          ? "bg-[#094771] text-white"
                          : "hover:bg-[#333] text-gray-300"
                      }`}
                    >
                      {file.path || file.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {/* file content */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="bg-[#1e1e1e] border-b border-gray-700 px-4 py-2 text-sm font-semibold text-white">
                {selectedFile || "Select a file"}
              </div>

              <div className="flex-1 min-h-0 overflow-auto p-4 bg-[#1e1e1e]">
                <pre className="whitespace-pre-wrap text-sm">{fileContent}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAI;