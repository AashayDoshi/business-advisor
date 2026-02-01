import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { question, systemPrompt, knowledgeBase, guardrails, temperature, tone } = await request.json();

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const fullPrompt = `${systemPrompt}

Knowledge Base: ${knowledgeBase}

Guardrails: ${guardrails}

Tone: ${tone}

User Question: ${question}

Provide a helpful business advisory response:`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const answer = response.text();

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
