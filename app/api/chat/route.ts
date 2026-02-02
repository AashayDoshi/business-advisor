import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    // Get config from Supabase
    const { data: config } = await supabase
      .from('advisor_config')
      .select('*')
      .single();

    const systemPrompt = config?.system_instructions || 'You are Jigneshbhai, a friendly and knowledgeable business advisor.';
    const knowledgeBase = config?.knowledge_base || '';
    const guardrails = config?.guardrails || '';
    const temperature = config?.temperature || 0.7;

    const fullPrompt = `${systemPrompt}

${knowledgeBase ? `Knowledge: ${knowledgeBase}

` : ''}${guardrails ? `Guidelines: ${guardrails}

` : ''}User: ${message}

Provide helpful business advice:`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: fullPrompt }]
          }],
          generationConfig: {
            temperature: parseFloat(temperature.toString()),
            maxOutputTokens: 2048,
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';

    // Log interaction
    await supabase.from('interaction_logs').insert({
      question: message,
      answer,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({ response: answer });
  } catch (error: any) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}
