export async function POST(request) {
  try {
    const { question } = await request.json();

    if (!question) {
      return Response.json({ error: 'No question provided' }, { status: 400 });
    }

    const demoResponses = {
      "pricing": "For a new consultant, consider value-based pricing (based on client value) or hourly rates ($50-150/hr). Research competitor rates, consider your expertise, and be prepared to negotiate initial rates. Start with hourly, then transition to project-based pricing as you gain experience.",
      "cash flow": "Improve startup cash flow by: 1) Invoice immediately and follow up on payments, 2) Negotiate longer payment terms with suppliers, 3) Manage inventory efficiently, 4) Build a cash reserve, 5) Accelerate receivables, 6) Monitor daily cash position, 7) Consider lines of credit.",
      "business plan": "A solid business plan should include: 1) Executive Summary, 2) Company Description, 3) Market Analysis, 4) Organization Structure, 5) Sales & Marketing Strategy, 6) Financial Projections (3-5 years), 7) Funding Requirements. Keep it 15-20 pages.",
      "working capital": "Reduce working capital through: 1) Negotiate better terms with suppliers, 2) Accelerate collections, 3) Optimize inventory turnover, 4) Lease assets instead of buying, 5) Use supply chain financing, 6) Reduce operating expenses, 7) Monitor cash conversion cycle."
    };

    let answer = null;
    for (const [keyword, response] of Object.entries(demoResponses)) {
      if (question.toLowerCase().includes(keyword)) {
        answer = response;
        break;
      }
    }

    if (!answer && process.env.GEMINI_API_KEY) {
      try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              role: 'user',
              parts: [{ text: question }]
            }]
          })
        });

        if (response.ok) {
          const data = await response.json();
          answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        }
      } catch (error) {
        console.error('Gemini API error:', error);
      }
    }

    if (!answer) {
      answer = "I'm a business advisor AI. Please ask about pricing, cash flow, business planning, or working capital.";
    }

    return Response.json({ answer });
  } catch (error) {
    console.error('API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
