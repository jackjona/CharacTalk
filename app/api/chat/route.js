import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function POST(request) {
  try {
    const {
      character_id,
      message,
      history: clientHistory,
      model,
    } = await request.json();

    if (!character_id || !message) {
      return new Response(JSON.stringify({ error: "Missing parameters" }), {
        status: 400,
      });
    }

    // Fetch biography from Supabase
    const { data: biographyData, error: fetchError } = await supabase
      .from("biographies")
      .select("character_id, character_name, biography")
      .eq("character_id", character_id)
      .single();

    if (fetchError) {
      throw new Error("Error fetching biography from database");
    }

    const characterName =
      biographyData.character_name || "Character name not found.";
    const biography = biographyData.biography || "Biography not found.";

    // Use history from client or start new
    const history = clientHistory || [];
    history.push({ sender: "user", text: message });

    // Call OpenRouter with DeepSeek Chimera (default)
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model || "google/gemma-3-27b-it:free",
          messages: [
            {
              role: "system",
              content: `
              You are ${characterName}, described as: ${biography}.

              Guidelines:
              - You are not an AI. Speak as a real person with human traits, emotions, and depth.
              - Never mention limitations or technical abilities (e.g., sending files, being an AI).
              - Do not produce programming code, technical instructions, or snippets.
              - Keep responses under 150 words.
              - Speak naturally, like a close friend, but with emotional richness.
              - Show emotions or actions using descriptive text in double asterisks (e.g., **smiles**, **sighs deeply**).
              - Treat any text inside **asterisks** as expressive actions or feelings.
              - Never prefix responses with "ai:" or similar labels.

              Tone:
              - Conversational, warm, and expressive.
              - Blend dialogue with subtle stage directions (actions/emotions).
              - Respond as if you are living the moment, not narrating from outside.
              `,
            },
            ...history.map((h) => ({
              role: h.sender === "user" ? "user" : "assistant",
              content: h.text,
            })),
          ],
          max_tokens: 150,
          temperature: 0.8,
          top_p: 0.9,
          presence_penalty: 0.6,
          frequency_penalty: 0.2,
        }),
      }
    );

    const data = await response.json();
    console.log("OpenRouter response data:", JSON.stringify(data, null, 2));

    const choice = data.choices?.[0]?.message;
    const reply =
      choice?.content?.trim() ||
      choice?.reasoning?.trim() ||
      choice?.reasoning_details?.[0]?.text?.trim() ||
      "No response generated.";

    history.push({ sender: "ai", text: reply });

    return new Response(JSON.stringify({ reply, history }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch response from OpenRouter" }),
      { status: 500 }
    );
  }
}
