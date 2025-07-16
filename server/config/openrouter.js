import axios from "axios";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Pick one of their free models (e.g., Mixtral)
const MODEL = "meta-llama/llama-3-8b-instruct";

export default async function generateOpenRouterContent(prompt) {
  try {
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: MODEL,
        messages: [
          {
            role: "user",
            content: `Generate a human-like blog post for this topic: "${prompt}" in plain text.`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000", // Replace with your domain if deployed
          "X-Title": "My Blog AI",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("OpenRouter error:", error.response?.data || error.message);
    throw new Error("Failed to generate content from OpenRouter");
  }
}
