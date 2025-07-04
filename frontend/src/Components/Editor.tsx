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
    <div className="flex gap-5 p-5 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 h-full overflow-hidden">
      <div className="w-48">
        <h3 className="text-lg font-semibold mb-2">Files</h3>
        <ul className="space-y-2">
          {files.map((file) => (
            <li key={file}>
              <button
                onClick={() => handleFileClick(file)}
                className="w-full text-left px-3 py-2 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
              >
                {file}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-2">
          Viewing: {selectedFile || 'None'}
        </h3>
        <textarea
          value={fileContent}
          readOnly
          className="w-full h-[400px] p-4 bg-white dark:bg-gray-800 text-sm font-mono border border-gray-300 dark:border-gray-700 rounded resize-none"
        />
      </div>
    </div>
  );
};

export default CodeEditor;
