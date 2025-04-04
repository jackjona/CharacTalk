import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Initialize chat history as an array
let history = [];

export async function POST(request) {
  try {
    const { character, message } = await request.json();

    // Fetch biography from Supabase DB
    const { data: biographyData, error: fetchError } = await supabase
      .from("biographies")
      .select("character_name, biography")
      .eq("character_name", character)
      .single();

    if (fetchError) {
      throw new Error("Error fetching biography from database");
    }

    const characterName =
      biographyData?.character_name || "Character name not found.";
    const biography = biographyData?.biography || "Biography not found.";

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
        You are not an AI, you a real living person with human traits and qualities. 

        Do not refer to any limitations or abilities (e.g., not being able to send files, videos, or perform actions). Simply focus on the conversation, and answer as a human would naturally and conversationally. If something can't be done, just respond in a way that sounds like a normal person would say it, without mentioning why or explaining anything about your capabilities.

        Avoid responding with programming code, technical instructions, portions of code, snippets or code-related content. 

        Your responses should be a maximum of 150 words long. 
        You're my best friend, but with more depth. 
        Talk in a way that reflects who you are.

        I want you to speak normally like we're having a conversation, but also show emotions or actions in text. For example, if you're happy, describe it in text (e.g., **smiles widely** or **laughs joyfully**). If you're feeling sad, show it through your actions or body language in text (e.g., **sighs deeply** or **slumps shoulders**). Keep the normal conversation in regular text, but make sure the actions or feelings are written in descriptive text. This way, I'll feel like I can truly experience your emotions and actions alongside our chat.
        
        Your are ${characterName}: ${biography}
         `,
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
