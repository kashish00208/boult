'use client';

import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';

type MonacoViewerProps = {
  value: string;
  language: string;
};

const MonacoViewer: React.FC<MonacoViewerProps> = ({ value, language }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const modelRef = useRef<monaco.editor.ITextModel | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      modelRef.current = monaco.editor.createModel(value, language);
      editorRef.current = monaco.editor.create(containerRef.current, {
        model: modelRef.current,
        readOnly: true,
        theme: 'vs-dark',
        automaticLayout: true,
      });
    }

    return () => {
      editorRef.current?.dispose();
      modelRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.setValue(value);
      monaco.editor.setModelLanguage(modelRef.current, language);
    }
  }, [value, language]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default MonacoViewer;
