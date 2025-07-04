import axios from "axios";

export const getGeminiResponse = async (userInput) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: userInput }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return (
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "🤖 Sorry, I couldn't generate a response."
    );
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    return "⚠️ I’m having trouble understanding. Please try again later.";
  }
};
