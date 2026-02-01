'use client';

import { useEffect, useState } from 'react';

interface Log {
  id: string;
  question: string;
  answer: string;
  created_at: string;
}

export default function AdminLogs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/logs')
      .then((res) => res.json())
      .then((data) => {
        setLogs(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load logs');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p>Loading logs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '40px auto', fontFamily: 'Arial' }}>
      <h1>Interaction Logs</h1>
      {logs.length === 0 ? (
        <p>No logs yet.</p>
      ) : (
        logs.map((log) => (
          <div
            key={log.id}
            style={{
              marginBottom: 24,
              padding: 20,
              borderRadius: 8,
              background: '#f6f6f6',
              border: '1px solid #e0e0e0',
            }}
          >
            <div>
              <strong>Question:</strong>
              <p>{log.question}</p>
            </div>
            <div>
              <strong>Answer:</strong>
              <p>{log.answer}</p>
            </div>
            <div style={{ fontSize: 12, opacity: 0.6 }}>
              {new Date(log.created_at).toLocaleString()}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
