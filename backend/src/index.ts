import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import { Request ,Response } from "express";

import express from "express";
const app = express();

app.use(express.json());
import { getSystemPrompt } from "./prompts";
import { BASE_PROMPT } from "./prompts";
import { basePrompt as nodeBasePrompt } from "./defalut/node";
import { basePrompt as reactBasePrompt } from "./defalut/react";

app.use(cors({ origin: "http://localhost:3000" }));

import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


//template route to check which kind of website a user want it can be either react based website or nodejs

app.post("/appType", async (req:Request, res:Response) => {
  const response = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a analysis bot , user will provide a description of of a project that they want to build and Return either node or react based on what you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra .",
      },
      {
        role: "user",
        content: req.body.prompt,
      },
    ],
    model: "llama-3.1-8b-instant",
  });

  const answer = response.choices[0]?.message?.content || "";
  return {answer}
});


app.post("/template", async (req:Request, res:Response) => {
  const response = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a analysis bot , user will provide a description of of a project that they want to build and Return either node or react based on what you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra .",
      },
      {
        role: "user",
        content: req.body.prompt,
      },
    ],
    model: "llama-3.1-8b-instant",
  });

  const answer = response.choices[0]?.message?.content || "";
  if (answer == "react") {
    res.json({
      prompts: [
        BASE_PROMPT,
        `Here is an artifact that contains all the files of the project visible to you .\nconsider the contents of all files in project ${reactBasePrompt} \n\n 
        here is a list of files system but are not being shown to you : \n\n - .gitignore\n - package-lock.json\n - .bolt/prompt`,
      ],
      uiPrompts: { reactBasePrompt },
    });
  }

  if (answer == "node") {
    res.json({
      prompts: [
        BASE_PROMPT,
        `Here is an artifact that contains all the files of the project visible to you .\nconsider the contents of all files in project ${nodeBasePrompt} \n\n 
        here is a list of files system but are not being shown to you : \n\n - .gitignore\n - package-lock.json\n - .bolt/prompt`,
      ],
      uiPrompts: { nodeBasePrompt },
    });
  } else {
    res.status(403).json({ message: "You cant access this " });
    return;
  }
});

app.post("/chat", async (req:Request,res:Response) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages)) {
      return;
    }

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: getSystemPrompt(),
        },
        ...messages,
      ],
      model: "llama-3.1-8b-instant",
    });

    const reply = response.choices?.[0]?.message?.content || "";

    res.json({ reply });
    
  } catch (err) {
    console.error("Error in /chat route:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


//PORT == 8080
app.listen(8080, () => {
  console.log("Server is running on 8080");
});