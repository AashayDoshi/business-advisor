import { useState } from "react";

export default function Admin() {
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a sharp, practical business advisor for Indian founders. Be concise, structured, and actionable."
  );
  const [tone, setTone] = useState("Consultant-style");
  const [saved, setSaved] = useState(false);

  function saveSettings() {
    localStorage.setItem("systemPrompt", systemPrompt);
    localStorage.setItem("tone", tone);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{ maxWidth: "800px", margin: "60px auto", fontFamily: "Arial" }}>
      <h1>Admin – AI Control Panel</h1>
      <div>
        <label>
          <strong>System Prompt (AI Behavior)</strong>
        </label>
        <textarea
          rows="6"
          style={{ width: "100%", padding: "10px" }}
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
        />
      </div>
      <div style={{ marginTop: "20px" }}>
        <label>
          <strong>Tone</strong>
        </label>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          style={{ padding: "8px" }}
        >
          <option>Consultant-style</option>
          <option>Founder-friendly</option>
          <option>CFO-style</option>
          <option>Blunt & direct</option>
        </select>
      </div>
      <button
        onClick={saveSettings}
        style={{
          padding: "10px 20px",
          marginTop: "20px",
          cursor: "pointer",
        }}
      >
        Save Settings
      </button>
      {saved && <p style={{ color: "green" }}>Settings saved</p>}
    </div>
  );
}
