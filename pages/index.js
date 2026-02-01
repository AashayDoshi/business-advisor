import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function askAI() {
    if (!question) return;
    setLoading(true);
    setAnswer("");
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    setAnswer(data.answer);
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: "700px", margin: "60px auto", fontFamily: "Arial" }}>
      <h1>Jigneshbhai Business Advisor</h1>
      <p>Ask a business question below:</p>
      <textarea
        rows="4"
        style={{ width: "100%", padding: "10px" }}
        placeholder="e.g. How should I price my services as a new consultant?"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <br />
      <button
        onClick={askAI}
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        {loading ? "Thinking..." : "Ask"}
      </button>
      {answer && (
        <div style={{ whiteSpace: "pre-wrap" }}>
          <h3>Answer:</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
