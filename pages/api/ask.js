export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "No question provided" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "API key not configured" });
    }

    const systemPrompt = "You are a business advisor helping Indian entrepreneurs and business professionals. Provide practical, actionable advice. Be concise and direct.";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          system_instruction: {
            parts: {
              text: systemPrompt,
            },
          },
          contents: [
            {
              parts: [
                {
                  text: question,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Gemini API error:", error);
      return res.status(500).json({ error: "Failed to get response from AI" });
    }

    const data = await response.json();
    
    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Unable to generate a response. Please try again.";

    res.status(200).json({ answer });
  } catch (error) {
    console.error("API handler error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
