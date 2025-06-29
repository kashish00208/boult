import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();
app.use(express.json());


import { getSystemPrompt } from "./prompts";
import { BASE_PROMPT } from "./prompts";
import { basePrompt as nodeBasePrompt } from "./defalut/node";
import { basePrompt as reactBasePrompt } from "./defalut/react";

import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/template", async (req, res) => {
  const prompt = req.body.prompt;
  const response = await groq.chat.completions.create({
  messages: [
    {
      role: "system",
      content:
        "You are a analysis bot , user will provide a description of of a project that they want to buildReturn either node or react based on what you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra .",
    },
    {
      role: "user",
      content: req.body.prompt, 
    },
  ],
  model: "llama-3.1-8b-instant",
});


  const answer = response.choices[0]?.message?.content || "";
  console.log(answer);
  if (answer == "react") {
    res.json({
      prompts: [BASE_PROMPT, `Here is an artifact that contains all the files of the project visible to you .\nconsider the contents of all files in project ${reactBasePrompt} \n\n 
        here is a list of files system but are not being shown to you : \n\n - .gitignore\n - package-lock.json\n - .bolt/prompt` ],
      uiPrompts : {reactBasePrompt}
    });
  }

  if (answer == "node") {
    res.json({
      prompts: [BASE_PROMPT, `Here is an artifact that contains all the files of the project visible to you .\nconsider the contents of all files in project ${nodeBasePrompt} \n\n 
        here is a list of files system but are not being shown to you : \n\n - .gitignore\n - package-lock.json\n - .bolt/prompt` ],
      uiPrompts : {nodeBasePrompt}
    });
  } else {
    res.status(403).json({ message: "You cant access this " });
    return;
  }
});


app.post("/chat", async (req, res) => {
  const msgs = req.body.msg;

  const response = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: getSystemPrompt()
      },
      ...msgs
    ],
    model: "llama-3.1-8b-instant"
  });

  res.json({ res: response });
});



app.listen(3000, () => {
  console.log("Server is running on 3000");
});


export async function main() {
  const chat = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: getSystemPrompt(),
      },
      {
        role: "user",
        content:
          'Sproject_files>\nThe following is a list of all project files and their complete contents that are currently visible and accessible to you.\n\nIMPORTANT: Some of these files might have been modified. Always cross-reference with the <file_changes> section for the most up-to-date version of any file. If a file is not listed in <file_changes>, its content remains as shown here.\n\neslint.config.js:\n```\nimport js from \'@eslint/js\';\nimport globals from \'globals\';\nimport reactHooks from \'eslint-plugin-react-hooks\';\nimport reactRefresh from \'eslint-plugin-react-refresh\';\nimport tseslint from \'typescript-eslint\';\n\nexport default tseslint.config(\n  { ignores: [\'dist\'] },\n  {\n    extends: [js.configs.recommended, ...tseslint.configs.recommended],\n    files: [\'**/*.{ts,tsx}\'],\n    languageOptions: {\n      ecmaVersion: 2020,\n      globals: globals.browser,\n    },\n    plugins: {\n      \'react-hooks\': reactHooks,\n      \'react-refresh\': reactRefresh,\n    },\n    rules: {\n      ...reactHooks.configs.recommended.rules,\n      \'react-refresh/only-export-components\': [\n        \'warn\',\n        { allowConstantExport: true },\n      ],\n    },\n  }\n);\n\n```\n\nindex.html:\n```\n<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <link rel="icon" type="image/svg+xml" href="/vite.svg" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title data-default>Vite + React + TS</title>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.tsx"></script>\n  </body>\n</html>\n\n```\n\npackage.json:\n```\n{\n  "name": "vite-react-typescript-starter",\n  "private": true,\n  "version": "0.0.0",\n  "type": "module",\n  "scripts": {\n    "dev": "vite",\n    "build": "vite build",\n    "lint": "eslint .",\n    "preview": "vite preview"\n  },\n  "dependencies": {\n    "lucide-react": "^0.344.0",\n    "react": "^18.3.1",\n    "react-dom": "^18.3.1"\n  },\n  "devDependencies": {\n    "@eslint/js": "^9.9.1",\n    "@types/react": "^18.3.5",\n    "@types/react-dom": "^18.3.0",\n    "@vitejs/plugin-react": "^4.3.1",\n    "autoprefixer": "^10.4.18",\n    "eslint": "^9.9.1",\n    "eslint-plugin-react-hooks": "^5.1.0-rc.0",\n    "eslint-plugin-react-refresh": "^0.4.11",\n    "globals": "^15.9.0",\n    "postcss": "^8.4.35",\n    "tailwindcss": "^3.4.1",\n    "typescript": "^5.5.3",\n    "typescript-eslint": "^8.3.0",\n    "vite": "^5.4.2"\n  }\n}\n\n```\n\npostcss.config.js:\n```\nexport default {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n};\n\n```\n\nsrc/App.tsx:\n```\nimport React from \'react\';\n\nfunction App() {\n  return (\n    <div className="min-h-screen bg-gray-100 flex items-center justify-center">\n      <p>Start prompting (or editing) to see magic happen :)</p>\n    </div>\n  );\n}\n\nexport default App;\n\n```\n\nsrc/index.css:\n```\n@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n```\n\nsrc/main.tsx:\n```\nimport { StrictMode } from \'react\';\nimport { createRoot } from \'react-dom/client\';\nimport App from \'./App.tsx\';\nimport \'./index.css\';\n\ncreateRoot(document.getElementById(\'root\')!).render(\n  <StrictMode>\n    <App />\n  </StrictMode>\n);\n\n```\n\nsrc/vite-env.d.ts:\n```\n/// <reference types="vite/client" />\n\n```\n\ntailwind.config.js:\n```\n/** @type {import(\'tailwindcss\').Config} */\nexport default {\n  content: [\'./index.html\', \'./src/**/*.{js,ts,jsx,tsx}\'],\n  theme: {\n    extend: {},\n  },\n  plugins: [],\n};\n\n```\n\ntsconfig.app.json:\n```\n{\n  "compilerOptions": {\n    "target": "ES2020",\n    "useDefineForClassFields": true,\n    "lib": ["ES2020", "DOM", "DOM.Iterable"],\n    "module": "ESNext",\n    "skipLibCheck": true,\n\n    /* Bundler mode */\n    "moduleResolution": "bundler",\n    "allowImportingTsExtensions": true,\n    "isolatedModules": true,\n    "moduleDetection": "force",\n    "noEmit": true,\n    "jsx": "react-jsx",\n\n    /* Linting */\n    "strict": true,\n    "noUnusedLocals": true,\n    "noUnusedParameters": true,\n    "noFallthroughCasesInSwitch": true\n  },\n  "include": ["src"]\n}\n\n```\n\ntsconfig.json:\n```\n{\n  "files": [],\n  "references": [\n    { "path": "./tsconfig.app.json" },\n    { "path": "./tsconfig.node.json" }\n  ]\n}\n\n```\n\ntsconfig.node.json:\n```\n{\n  "compilerOptions": {\n    "target": "ES2022",\n    "lib": ["ES2023"],\n    "module": "ESNext",\n    "skipLibCheck": true,\n\n    /* Bundler mode */\n    "moduleResolution": "bundler",\n    "allowImportingTsExtensions": true,\n    "isolatedModules": true,\n    "moduleDetection": "force",\n    "noEmit": true,\n\n    /* Linting */\n    "strict": true,\n    "noUnusedLocals": true,\n    "noUnusedParameters": true,\n    "noFallthroughCasesInSwitch": true\n  },\n  "include": ["vite.config.ts"]\n}\n\n```\n\nvite.config.ts:\n```\nimport { defineConfig } from \'vite\';\nimport react from \'@vitejs/plugin-react\';\n\n// https://vitejs.dev/config/\nexport default defineConfig({\n  plugins: [react()],\n  optimizeDeps: {\n    exclude: [\'lucide-react\'],\n  },\n});\n\n```\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n- .gitignore\n- package-lock.json\n- .bolt/prompt\n</project_files>',
      },
      {
        role: "user",
        content:""
      },
      {
        role: "user",
        content: " create a todo app",
      },

    ],
    model: "llama-3.1-8b-instant",
  });
  console.log(chat.choices[0]?.message?.content || "")
}
