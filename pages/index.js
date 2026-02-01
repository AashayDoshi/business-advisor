// v3 - Enhanced UI with Jigneshbhai styling
import { useState } from "react";

const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    color: #333;
  }
  
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 20px;
  }
  
  .header {
    text-align: center;
    margin-bottom: 40px;
  }
  
  .header h1 {
    font-size: 2.5em;
    margin-bottom: 10px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .header p {
    font-size: 1.1em;
    color: #666;
    font-weight: 300;
  }
  
  .input-section {
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 30px;
  }
  
  .input-label {
    display: block;
    margin-bottom: 12px;
    font-weight: 600;
    color: #333;
  }
  
  .input-section textarea {
    width: 100%;
    padding: 12px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1em;
    font-family: inherit;
    resize: vertical;
    min-height: 100px;
    transition: border-color 0.3s;
  }
  
  .input-section textarea:focus {
    outline: none;
    border-color: #667eea;
  }
  
  .button-group {
    display: flex;
    gap: 10px;
    margin-top: 15px;
  }
  
  .btn {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 1em;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
  
  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  .btn-secondary {
    background: #f0f0f0;
    color: #333;
  }
  
  .btn-secondary:hover {
    background: #e0e0e0;
  }
  
  .answer-section {
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .answer-section h3 {
    margin-bottom: 15px;
    color: #667eea;
  }
  
  .answer-text {
    line-height: 1.8;
    white-space: pre-wrap;
    word-wrap: break-word;
    color: #555;
  }
  
  .loading {
    display: inline-block;
    width: 8px;
    height: 8px;
    background: #667eea;
    border-radius: 50%;
    margin-right: 4px;
    animation: pulse 1.5s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }
  
  .admin-trigger {
    text-align: center;
    margin-top: 40px;
    font-size: 0.9em;
    color: #999;
    cursor: pointer;
  }
`;

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminClicks, setAdminClicks] = useState(0);

  async function askAI() {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) {
        setAnswer(`Error: API returned ${res.status}`);
        setLoading(false);
        return;
      }
      const data = await res.json();
      const responseText = data.answer || data.error || "No response";
      setAnswer(responseText);
    } catch (error) {
      setAnswer(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  function handleAdminTrigger() {
    setAdminClicks(adminClicks + 1);
    if (adminClicks + 1 === 5) {
      window.location.href = '/admin';
    }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="container">
        <div className="header">
          <h1>Jigneshbhai Business Advisor</h1>
          <p>Ask a business question below:</p>
        </div>

        <div className="input-section">
          <label className="input-label">Your Question</label>
          <textarea
            placeholder="e.g. How should I price my services as a new consultant?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) askAI();
            }}
          />
          <div className="button-group">
            <button
              className="btn btn-primary"
              onClick={askAI}
              disabled={loading || !question.trim()}
            >
              {loading ? (
                <>
                  <span className="loading"></span>
                  <span className="loading"></span>
                  <span className="loading"></span>
                  Thinking...
                </>
              ) : (
                "Ask"
              )}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setQuestion("");
                setAnswer("");
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {answer && (
          <div className="answer-section">
            <h3>Answer:</h3>
            <p className="answer-text">{answer}</p>
          </div>
        )}

        <div className="admin-trigger" onClick={handleAdminTrigger}>
          © 2024 Jigneshbhai Business Advisor. All rights reserved.
        </div>
      </div>
    </>
  );
}
