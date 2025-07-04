"use client";
import { useState } from 'react';

const CodeEditor = () => {
  const [fileContent, setFileContent] = useState('');
  const [selectedFile, setSelectedFile] = useState('');

  const files = ['file.txt', 'test.txt'];

  const handleFileClick = async (fileName: string) => {
    setSelectedFile(fileName);
    const res = await fetch(`/files/${fileName}`);
    const text = await res.text();
    setFileContent(text);
  };

  return (
    <div className="flex gap-0 p-0 bg-[#1e1e1e] text-gray-100 h-full overflow-hidden font-mono">
      <div className="w-48 bg-[#252526] border-r border-gray-700 p-3">
        <h3 className="text-sm font-bold text-gray-300 mb-3 pb-1.5 border-b border-slate-600">EXPLORER</h3>
        <ul className="space-y-1">
          {files.map((file) => (
            <li key={file}>
              <button
                onClick={() => handleFileClick(file)}
                className={`w-full text-left px-2 py-1 rounded text-sm ${
                  selectedFile === file
                    ? 'bg-[#094771] text-white'
                    : 'hover:bg-[#333] text-gray-300'
                }`}
              >
                {file}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="bg-[#1e1e1e] border-b border-gray-700 px-4 py-2 text-sm font-semibold text-white">
          {selectedFile || 'Select a file'}
        </div>
        <textarea
          value={fileContent}
          readOnly
          spellCheck={false}
          className="w-full h-[400px] p-4 bg-[#1e1e1e] text-sm text-gray-100 font-mono border-none outline-none resize-none focus:ring-0 focus:outline-none scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-[#1e1e1e]"
        />
      </div>
    </div>
  );
};

export default CodeEditor;
