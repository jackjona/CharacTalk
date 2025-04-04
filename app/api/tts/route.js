export async function POST(req) {
  try {
    const body = await req.json();
    const { text, voice, format } = body;
    const TTS_URL = process.env.TTS_URL;
    const TTS_API_KEY = process.env.TTS_API_KEY;

    // Fetch the audio from the TTS API
    const response = await fetch(TTS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": TTS_API_KEY,
      },
      body: JSON.stringify({ text, voice, format }),
    });

    if (!response.ok) {
      throw new Error(`TTS API error! Status: ${response.status}`);
    }

    const audioBlob = await response.blob();

    return new Response(audioBlob, {
      headers: {
        "Content-Type": "audio/mpeg",
        "X-Generation-Timestamp": new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error in TTS API:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch TTS audio" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
