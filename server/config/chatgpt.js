import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function generateBlogContent(prompt) {
  const chatPrompt = `Write a blog post on the topic: "${prompt}". The content should be simple, conversational, and human-like.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo", // or "gpt-4" if you have access
    messages: [{ role: "user", content: chatPrompt }],
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
}
