// Admin Panel with password protection and enhanced customization
import { useState, useEffect } from "react";

const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  }
  
  .admin-container {
    max-width: 900px;
    margin: 40px auto;
    padding: 20px;
  }
  
  .login-box, .admin-panel {
    background: white;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
  
  .login-box {
    max-width: 400px;
    margin: 100px auto;
    text-align: center;
  }
  
  .login-box h1 {
    margin-bottom: 20px;
    color: #333;
  }
  
  .login-box input {
    width: 100%;
    padding: 12px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1em;
    margin-bottom: 15px;
  }
  
  .login-box input:focus {
    outline: none;
    border-color: #667eea;
  }
  
  .admin-header {
    text-align: center;
    margin-bottom: 40px;
  }
  
  .admin-header h1 {
    color: #667eea;
    margin-bottom: 10px;
  }
  
  .admin-header p {
    color: #999;
  }
  
  .section {
    background: #f9f9f9;
    padding: 25px;
    border-radius: 8px;
    margin-bottom: 25px;
  }
  
  .section h2 {
    color: #333;
    margin-bottom: 15px;
    font-size: 1.3em;
  }
  
  .field {
    margin-bottom: 20px;
  }
  
  .field label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #555;
  }
  
  .field input, .field textarea, .field select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-family: inherit;
    font-size: 0.95em;
  }
  
  .field textarea {
    min-height: 100px;
    resize: vertical;
  }
  
  .btn {
    padding: 12px 30px;
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
  
  .btn-secondary {
    background: #f0f0f0;
    color: #333;
    margin-left: 10px;
  }
  
  .btn-secondary:hover {
    background: #e0e0e0;
  }
  
  .success-msg {
    color: #4caf50;
    margin-top: 10px;
    font-weight: 600;
  }
  
  .error-msg {
    color: #f44336;
    margin-top: 10px;
  }
  
  .actions {
    margin-top: 30px;
    text-align: center;
  }
  
  .range-display {
    display: inline-block;
    margin-left: 10px;
    color: #667eea;
    font-weight: 600;
  }
`;

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a sharp, practical business advisor for Indian founders. Be concise, structured, and actionable."
  );
  const [knowledgeBase, setKnowledgeBase] = useState(
    "Focus on: pricing strategies, cash flow management, business planning, working capital optimization"
  );
  const [guardrails, setGuardrails] = useState(
    "Never give direct stock tips. Always provide context and multiple perspectives."
  );
  const [temperature, setTemperature] = useState(0.7);
  const [tone, setTone] = useState("Consultant-style");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (authenticated) {
      const stored = localStorage.getItem("jigneshbhaiConfig");
      if (stored) {
        const config = JSON.parse(stored);
        setSystemPrompt(config.systemPrompt || systemPrompt);
        setKnowledgeBase(config.knowledgeBase || knowledgeBase);
        setGuardrails(config.guardrails || guardrails);
        setTemperature(config.temperature || 0.7);
        setTone(config.tone || "Consultant-style");
      }
    }
  }, [authenticated]);

  function handleLogin(e) {
    e.preventDefault();
    if (password === "bhai-admin") {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  }

  function saveSettings() {
    const config = {
      systemPrompt,
      knowledgeBase,
      guardrails,
      temperature,
      tone,
    };
    localStorage.setItem("jigneshbhaiConfig", JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!authenticated) {
    return (
      <>
        <style>{styles}</style>
        <div className="login-box">
          <h1>🔒 Admin Access</h1>
          <p>Enter password to continue</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <button className="btn btn-primary" type="submit">
              Login
            </button>
          </form>
          {error && <p className="error-msg">{error}</p>}
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="admin-container">
        <div className="admin-panel">
          <div className="admin-header">
            <h1>⚙️ Admin Control Panel</h1>
            <p>Configure Jigneshbhai's personality and behavior</p>
          </div>

          <div className="section">
            <h2>System Configuration</h2>
            <div className="field">
              <label>System Prompt (Core Personality)</label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="Define how the AI behaves and responds..."
              />
            </div>
            <div className="field">
              <label>Knowledge Base (Domain Focus)</label>
              <textarea
                value={knowledgeBase}
                onChange={(e) => setKnowledgeBase(e.target.value)}
                placeholder="Define specific areas of expertise..."
              />
            </div>
            <div className="field">
              <label>Guardrails (Safety Rules)</label>
              <textarea
                value={guardrails}
                onChange={(e) => setGuardrails(e.target.value)}
                placeholder="Define what the AI should never do..."
              />
            </div>
          </div>

          <div className="section">
            <h2>Personality Settings</h2>
            <div className="field">
              <label>
                Temperature (Creativity)
                <span className="range-display">{temperature}</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
              />
            </div>
            <div className="field">
              <label>Response Tone</label>
              <select value={tone} onChange={(e) => setTone(e.target.value)}>
                <option>Consultant-style</option>
                <option>Founder-friendly</option>
                <option>CFO-style</option>
                <option>Blunt & direct</option>
              </select>
            </div>
          </div>

          <div className="actions">
            <button className="btn btn-primary" onClick={saveSettings}>
              Save Configuration
            </button>
            <button className="btn btn-secondary" onClick={() => window.location.href = '/'}>
              Back to Home
            </button>
          </div>

          {saved && <p className="success-msg">Configuration saved successfully!</p>}
        </div>
      </div>
    </>
  );
}
