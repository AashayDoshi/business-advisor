import { createClient } from "@supabase/supabase-js";

const supabaseServer = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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

    // Log to Supabase
    const { error } = await supabaseServer.from("interaction_logs").insert([
      {
        question,
        answer,
        system_prompt: systemPrompt,
        knowledge_base: knowledgeBase,
        guardrails,
        temperature: parseFloat(temperature || 0.7),
        tone,
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
    }

    return Response.json({ answer });
  } catch (error) {
    console.error("AI request failed:", error);
    return Response.json(
      { error: "AI request failed" },
      { status: 500 }
    );
  }
}
