export async function POST(request) {
  try {
    const {
      question,
      systemPrompt,
      knowledgeBase,
      guardrails,
      temperature,
      tone,
    } = await request.json();
    
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
      process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemPrompt}
KNOWLEDGE BASE: ${knowledgeBase}
GUARDRAILS: ${guardrails}
Tone: ${tone}
Temperature: ${temperature}
User question: ${question}
`,
                },
              ],
            },
          ],
        }),
      }
    );
    
    const data = await response.json();
    const answer =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI";
    
    // TODO: Log to Supabase later
    return Response.json({ answer });
  } catch (error) {
    console.error("AI request failed:", error);
    return Response.json(
      { error: "AI request failed" },
      { status: 500 }
    );
  }
}
