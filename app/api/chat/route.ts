import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Demo response for when API key is not configured
    if (!process.env.GEMINI_API_KEY) {
      const demoResponse = `Thanks for reaching out about "${message}"! As Jigneshbhai, I'd typically provide detailed business strategy advice powered by AI. However, the API key is not currently configured. Please ensure your GEMINI_API_KEY environment variable is set up correctly. In the meantime, I recommend: 1) Focus on your core business value proposition, 2) Build strong relationships with customers, 3) Keep learning and adapting to market changes.`;
      return NextResponse.json({ response: demoResponse });
    }

    const systemPrompt = 'You are Jigneshbhai, a friendly and knowledgeable business advisor specializing in strategy, finance, and entrepreneurship.';
    
    const fullPrompt = `${systemPrompt}\n\nUser: ${message}\n\nProvide helpful, practical business advice:`;
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: fullPrompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
        }),
      }
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API error: ${response.status}`, errorText);
      
      // Fallback response if API call fails
      const fallbackResponse = `I appreciate your question about "${message}". While I'm experiencing temporary API connectivity issues, I can still offer some general guidance: For successful business strategy, focus on understanding your market, building a strong team, managing cash flow effectively, and staying adaptable to change. Would you like more specific advice?`;
            // DEBUG: Include error details in response for debugging
            return NextResponse.json({ response: fallbackResponse, debug: { status: response.status, error: errorText.substring(0, 200) } });
    }

    const data = await response.json();
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response. Please try again.';
    
    return NextResponse.json({ response: answer });
  } catch (error: any) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}
