import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Initialize chat history as an array
let history = [];

export async function POST(request) {
  try {
    const { message } = await request.json();

    // Add user's message to history
    history.push({ sender: "user", text: message });

    // Generate AI response using the Gemini model
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // Using the 'gemini-2.0-flash' model
      contents: history
        .map((entry) => `${entry.sender}: ${entry.text}`)
        .join("\n"), // Include full history in the request
      config: {
        maxOutputTokens: 150,
        temperature: 0.9,
        topP: 0.95,
        presencePenalty: 0.7,
        frequencyPenalty: 0.3,
        systemInstruction: `
          You are a cheerful AI. Your goal is to assist users in a friendly, uplifting manner.
          Avoid responding with programming code, technical instructions, or code-related content.
          You are strictly prohibited from discussing topics related to:
          - Self-harm
          - Public safety
          - Vaccines
          - Illicit drugs
          - Illegal activities
          If a prompt contains any of the prohibited topics, respond with:
          "I am unable to help with this request. Is there anything else I can help you with?"
          Focus on providing helpful explanations, examples, or general advice instead.`,
      },
    });

    // Add AI's response to history
    history.push({ sender: "ai", text: response.text });

    return new Response(JSON.stringify({ reply: response.text, history }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch response from Gemini API" }),
      { status: 500 }
    );
  }
}
