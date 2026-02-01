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
    
    const prompt = `${systemPrompt}
KNOWLEDGE BASE: ${knowledgeBase}
GUARDRAILS: ${guardrails}
Tone: ${tone}
User question: ${question}`;
    
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
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: parseFloat(temperature) || 0.7,
            topP: 0.9,
            maxOutputTokens: 1024,
          },
        }),
      }
    );
    
    const data = await response.json();
    const answer =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI";
    
    return Response.json({ answer });
  } catch (error) {
    console.error("AI request failed:", error);
    return Response.json(
      { error: "AI request failed" },
      { status: 500 }
    );
  }
}
