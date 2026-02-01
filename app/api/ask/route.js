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
    
    console.log('Sending to Gemini API...');
    
    const response = await fetch(
      "https://generativelanguage.googleapis.com/vv1betam/odels/gemini-1.5-flash-latest:generateContent?key=" +
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
    
    console.log('Gemini API response status:', response.status);
    const data = await response.json();
    console.log('Gemini API response:', JSON.stringify(data).substring(0, 500));
        console.log('Full response data:', JSON.stringify(data, null, 2));
    
const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(data) || "No response from AI";
    
    console.log('Final answer:', answer.substring(0, 100));
    return Response.json({ answer });
  } catch (error) {
    console.error("AI request failed:", error.message);
    return Response.json(
      { error: "AI request failed: " + error.message },
      { status: 500 }
    );
  }
}
