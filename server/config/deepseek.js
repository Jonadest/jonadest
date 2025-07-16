import axios from "axios";

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"; // Adjust if needed

export default async function generateDeepSeekContent(prompt) {
  try {
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: "deepseek-chat", // or "deepseek-coder" if you're using code generation
        messages: [
          {
            role: "user",
            content: `Write a blog post about: "${prompt}". Make it human-like and engaging.`,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("DeepSeek error:", error.response?.data || error.message);
    throw new Error("DeepSeek generation failed");
  }
}
