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

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: question,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      return res.status(response.status).json({ error: "AI service error" });
    }

    const data = await response.json();
    
    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated";

    res.status(200).json({ answer });
  } catch (error) {
    console.error("Handler error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
}
