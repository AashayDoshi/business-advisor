import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { question, systemPrompt, knowledgeBase, guardrails, temperature, tone } = await request.json();

    const prompt = `${systemPrompt}\n\nKnowledge Base: ${knowledgeBase}\n\nGuardrails: ${guardrails}\n\nTone: ${tone}\n\nUser Question: ${question}\n\nProvide a helpful business advisory response:`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: parseFloat(temperature) || 0.7,
            maxOutputTokens: 2048,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response format from Gemini API');
    }

    const answer = data.candidates[0].content.parts[0].text;

    // Log to Supabase
    await supabase.from('interaction_logs').insert([
      {
        question,
        answer,
        timestamp: new Date().toISOString()
      }
    ]);

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'AI request failed: ' + error.message },
      { status: 500 }
    );
  }
}
