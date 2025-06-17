import dotenv from "dotenv";
dotenv.config();
console.log("Started working with grok actually");

import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function main() {
  const chatCompletion = await getGroqChatCompletion();
  console.log(chatCompletion.choices[0]?.message?.content || "");
}

export async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: "Write code for TODO application",
      },
    ],
    model : "llama-3.1-8b-instant"
  });
}
main()