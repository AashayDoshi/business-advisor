import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAsk = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    setError('');
    setAnswer('');

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          systemPrompt: 'You are Jigneshbhai, a business advisor.',
          knowledgeBase: 'Business advisory knowledge base',
          guardrails: 'Be professional and helpful',
          temperature: '0.7',
          tone: 'professional',
        }),
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setAnswer(data.answer);
      }
    } catch (err) {
      setError('Failed to fetch response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '20px', backgroundColor: '#f5f5f5' }}>
      <Head>
        <title>Jigneshbhai Business Advisor</title>
      </Head>
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: '#333', textAlign: 'center' }}>Jigneshbhai Business Advisor</h1>
        <p style={{ color: '#666', textAlign: 'center', marginBottom: '30px' }}>
          Ask your business questions and get expert advice
        </p>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask your business question here..."
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '14px',
              fontFamily: 'inherit',
            }}
          />
          
          <button
            onClick={handleAsk}
            disabled={loading}
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              backgroundColor: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            {loading ? 'Loading...' : 'Get Advice'}
          </button>

          {error && (
            <div style={{
              marginTop: '15px',
              padding: '10px',
              backgroundColor: '#ffebee',
              color: '#c62828',
              borderRadius: '4px',
            }}>
              {error}
            </div>
          )}

          {answer && (
            <div style={{
              marginTop: '15px',
              padding: '15px',
              backgroundColor: '#e8f5e9',
              color: '#2e7d32',
              borderRadius: '4px',
              lineHeight: '1.6',
            }}>
              <strong>Jigneshbhai's Advice:</strong>
              <p style={{ marginTop: '10px' }}>{answer}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
