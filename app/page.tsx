'use client';
import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
    const [clickCount, setClickCount] = useState(0);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleAdminAccess = () => {
    setClickCount(prev => prev + 1);
    if (clickCount + 1 >= 5) {
      const password = prompt('Enter admin password:');
      if (password === 'bhai-admin') {
        window.location.href = '/admin';
      } else {
        alert('Incorrect password');
      }
      setClickCount(0);
    }
    setTimeout(() => setClickCount(0), 3000);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, history: messages })
      });

      const data = await res.json();
      
      if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.error}` }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Network error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-orange-600">Jigneshbhai Business Advisor</h1>
          <p className="text-sm text-gray-600">Your AI-powered business strategy partner</p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🤝</div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Welcome to Jigneshbhai</h2>
              <p className="text-gray-500">Ask me anything about business strategy, finance, or entrepreneurship</p>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white shadow-md border border-orange-100 text-gray-800'
              }`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white shadow-md border border-orange-100 rounded-2xl px-4 py-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-2xl shadow-lg border border-orange-200 p-4">
          <div className="flex space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Jigneshbhai anything..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-orange-100 py-4">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">
            © 2026 Jigneshbhai Business Advisor |
            <span 
              onClick={handleAdminAccess}
              className="cursor-pointer hover:text-orange-600 ml-1"
            >
              All rights reserved
            </span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            AI-powered insights for strategic business decisions
          </p>
        </div>
      </div>
    </div>
  );
}
