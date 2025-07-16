"use client";
import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FaArrowRight } from "react-icons/fa";
import { BACKEND_URL } from "../../config";
import { Step, FileItem, FileItems } from "../types/index";
import { WebContainer } from "@webcontainer/api";
import { getWebContainerInstance } from "@/utils/webcontainer";
import { parseXml } from "@/steps";
import toWebContainerMount from "@/utils/fileStructure";
import getLanguageFromExtension from "./Languatext";
import TreeView from "./TreeVeiew";
import buildFileTree from "./BuildTreee";
import { WriteStream } from "fs";
import { waitForDebugger } from "inspector";

const ChatAI = () => {
  const [inputPrompt, setinputPrompt] = useState("");
  const [chatMsgs, setchatMsgs] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const msgEnding = useRef<HTMLDivElement | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const [steps, setSteps] = useState<Step[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [fileContent, setFileContent] = useState("");
  const [hasSentInitialprompts, setHasInitialPrompt] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [webcontainer, setWebcontainer] = useState<WebContainer | null>(null);

  const [language, setLanguage] = useState("plaintext");

  const [filechanges, setFilechanges] = useState("");
  const searchParams = useSearchParams();
  const fileTree = buildFileTree(files);

  const hasSentInitialPromptRef = useRef(false);

  const handleFileClick = (filePath: string) => {
    const file = files.find((f) => f.path === filePath);
    if (file) {
      setSelectedFile(file.path);
      setFileContent(file.content || "// No content");
      setLanguage(getLanguageFromExtension(file.name));
    } else {
      setFileContent("// File not found");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setinputPrompt(e.target.value);
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

      setSteps(
        parseXml(prompts[1]).map((x: Step) => ({
          ...x,
          status: "pending",
        }))
      );

      setLoading(true);

      const results = parseXml(prompts[1]);

      const generatedFiles: FileItem[] = results.map((item: any) => ({
        name: item.path,
        type: "file",
        path: item.path,
        content: item.content,
      }));

      setFiles(generatedFiles);
      console.log(generatedFiles);
      const filesRespose = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: [...prompts, prompt].map((content) => ({
            role: "user",
            content,
          })),
        }),
      });

      const dataofallfiles = await filesRespose.json();
      const finalPrompt = dataofallfiles.reply;

      if (finalPrompt) {
        const fileRegex =
          /<boltAction[^>]+filePath="([^"]+)"[^>]*>([\s\S]*?)<\/boltAction>/g;
        const matchedFiles: FileItem[] = [];

        let match;
        while ((match = fileRegex.exec(finalPrompt)) !== null) {
          const [, path, rawContent] = match;

          const content = rawContent
            .replace(/<br\s*\/?>/g, "\n")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&amp;/g, "&");

          matchedFiles.push({
            name: path.split("/").pop() || path,
            path,
            type: "file",
            content: content.trim(),
          });
        }
        setFiles(matchedFiles);
      }
      if (finalPrompt) {
        const fileRegex =
          /<boltAction[^>]+filePath="([^"]+)"[^>]*>([\s\S]*?)<\/boltAction>/g;
        const matchedFiles: FileItem[] = [];

        let match;
        while ((match = fileRegex.exec(finalPrompt)) !== null) {
          const [, path, rawContent] = match;

          const folders = path.split("/");
          if (
            folders.some(
              (part) =>
                part.startsWith(".") && part !== folders[folders.length - 1]
            )
          ) {
            continue;
          }
          const content = rawContent
            .replace(/<br\s*\/?>/g, "\n")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&amp;/g, "&");

          matchedFiles.push({
            name: path.split("/").pop() || path,
            path,
            type: "file",
            content: content.trim(),
          });
        }

        setFiles(matchedFiles);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong while sending the message.");
    } finally {
      setLoading(false);
      setinputPrompt("");
    }
  };
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputPrompt.trim();
    if (!trimmed) {
      return;
    }
    await sendMessage(trimmed);
    setinputPrompt("");
  };

  useEffect(() => {
    msgEnding.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMsgs]);

  useEffect(() => {
    const initialPrompt = searchParams.get("prompt");
    if (initialPrompt && !hasSentInitialPromptRef.current) {
      hasSentInitialPromptRef.current = true;
      sendMessage(initialPrompt);
      setinputPrompt("");
    }
  }, [searchParams]);

  const handlePreviewClick = async () => {
    setIsPreviewing(true);
    setError("");

    try {
      let wc = webcontainer;
      if (!wc) {
        wc = await getWebContainerInstance();
        setWebcontainer(wc);
      }
      //mapping files to webContainer instance for live preview
      const fileMap = toWebContainerMount(files);
      await wc.mount(fileMap);
      //installation of dependencies in project
      const installProcess = await wc.spawn("npm", ["install"]);
      installProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            console.log("[install]", data);
          },
        })
      );

      await installProcess.exit;
      const devProcess = await wc.spawn("npm", ["run", "dev"]);
      devProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            console.log("[dev]", data);
            const match = data.match(/(http:\/\/localhost:\d+)/);
            if (match && !previewUrl) {
              setPreviewUrl(match[1]);
            }
          },
        })
      );
    } catch (error) {
      console.error(error);
      setError("Failed to launch preview.");
    } finally {
      setIsPreviewing(false);
    }
  };

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
                  value={inputPrompt}
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
            <div className="w-48 bg-[#252526] border-r border-gray-700 p-4 overflow-hidden-">
              <h3 className="text-sm font-bold text-gray-300 p-2 border-b border-slate-600">
                EXPLORER
              </h3>
              <TreeView
                nodes={fileTree}
                onFileClick={(file) => handleFileClick(file.path)}
                selectedFile={selectedFile}
              />
            </div>
            {/* file content */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex justify-between bg-[#1e1e1e] border-b border-gray-700 p-2">
                <div className=" px-4 py-2 text-sm font-semibold text-white">
                  <div>{selectedFile || "Select a file"}</div>
                </div>
                <div className="">
                  <button
                    onClick={handlePreviewClick}
                    disabled={isPreviewing || files.length === 0}
                    className={`px-4 py-2 rounded bg-blue-600 text-white text-sm font-medium ${
                      isPreviewing
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-blue-700"
                    }`}
                  >
                    {isPreviewing ? "Launching Preview..." : "Preview Project"}
                  </button>
                  {previewUrl && (
                    <div>
                      <h3 className="text-white font-semibold mb-2">
                        Live Preview
                      </h3>
                      <iframe
                        src={previewUrl}
                        sandbox="allow-scripts allow-same-origin"
                        className="w-full h-[400px] border border-gray-600 rounded"
                        title="Live Preview"
                      />
                    </div>
                  )}
                </div>
              </div>
              <pre className="whitespace-pre-wrap text-sm overflow-x-hidden">
                {fileContent}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAI;
