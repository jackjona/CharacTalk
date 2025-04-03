import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function GET(request) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      // Character generation prompt below
      contents: `
     Generate a character: DESCRIPTION, for LLM roleplay. Only give the characer response, no introduction, conclusion or reply needed. 
      `,
    });
    return new Response(JSON.stringify({ reply: response.text }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch response from Gemini API" }),
      { status: 500 }
    );
  }
}
