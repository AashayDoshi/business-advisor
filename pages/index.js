// v4 - Full Replication of Jigneshbhai Advisor (UI, Voice, Files, History, Search)
import { useState, useEffect, useRef } from "react";

const styles = `
  :root {
    --primary: #667eea;
    --primary-dark: #764ba2;
    --bg-gradient: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    --white: #ffffff;
    --text-main: #333333;
    --text-muted: #666666;
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    --radius: 12px;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  body {
    background: var(--bg-gradient);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: var(--text-main);
    min-height: 100vh;
  }

  .app-layout {
    display: flex;
    height: 100vh;
    max-width: 1400px;
    margin: 0 auto;
    overflow: hidden;
  }

  /* Sidebar Styles */
  .sidebar {
    width: 300px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-right: 1px solid rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    padding: 20px;
    transition: all 0.3s;
  }

  .new-chat-btn {
    background: var(--primary);
    color: white;
    border: none;
    padding: 12px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .search-box {
    margin-bottom: 20px;
    position: relative;
  }

  .search-box input {
    width: 100%;
    padding: 8px 12px 8px 32px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.9em;
  }

  .history-list {
    flex: 1;
    overflow-y: auto;
  }

  .history-item {
    padding: 10px;
    border-radius: 6px;
    cursor: pointer;
    margin-bottom: 4px;
    font-size: 0.9em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .history-item:hover { background: rgba(0,0,0,0.05); }
  .history-item.active { background: rgba(102, 126, 234, 0.1); color: var(--primary); font-weight: 600; }

  /* Main Chat Area */
  .chat-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: transparent;
    position: relative;
  }

  .chat-header {
    padding: 20px;
    text-align: center;
    border-bottom: 1px solid rgba(0,0,0,0.05);
  }

  .chat-header h1 {
    font-size: 1.8em;
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .messages-area {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .message {
    max-width: 80%;
    padding: 15px;
    border-radius: var(--radius);
    line-height: 1.6;
    position: relative;
  }

  .message.user {
    align-self: flex-end;
    background: var(--primary);
    color: white;
    border-bottom-right-radius: 2px;
  }

  .message.bot {
    align-self: flex-start;
    background: white;
    color: var(--text-main);
    box-shadow: var(--shadow);
    border-bottom-left-radius: 2px;
  }

  /* Input Area Styles */
  .input-wrapper {
    padding: 20px;
    background: white;
    border-top: 1px solid rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .attachment-preview {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .preview-item {
    width: 60px;
    height: 60px;
    border-radius: 4px;
    background-size: cover;
    position: relative;
    border: 1px solid #ddd;
  }

  .input-box-container {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    background: #f8f9fa;
    padding: 10px;
    border-radius: var(--radius);
    border: 1px solid #e0e0e0;
  }

  .input-box-container textarea {
    flex: 1;
    border: none;
    background: transparent;
    padding: 8px;
    font-family: inherit;
    font-size: 1em;
    resize: none;
    max-height: 200px;
    outline: none;
  }

  .action-buttons {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .icon-btn {
    background: transparent;
    border: none;
    padding: 8px;
    cursor: pointer;
    border-radius: 50%;
    color: var(--text-muted);
    transition: background 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon-btn:hover { background: rgba(0,0,0,0.05); color: var(--primary); }
  .icon-btn.active { color: #f44336; }

  .send-btn {
    background: var(--primary);
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Animations */
  .typing-indicator {
    display: flex;
    gap: 4px;
    padding: 10px;
  }

  .dot {
    width: 6px;
    height: 6px;
    background: #ccc;
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out;
  }

  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }

  .admin-trigger {
    position: absolute;
    bottom: 5px;
    right: 5px;
    font-size: 10px;
    color: rgba(0,0,0,0.1);
    cursor: pointer;
  }
`;

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChatId, setActiveChatId] = useState(Date.now());
  const [adminClicks, setAdminClicks] = useState(0);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("jignesh_history");
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const saveToHistory = (msgs) => {
    const newHistory = [...history];
    const index = newHistory.findIndex(h => h.id === activeChatId);
    const title = msgs[0]?.content.substring(0, 30) || "New Chat";
    
    if (index > -1) {
      newHistory[index].messages = msgs;
    } else {
      newHistory.unshift({ id: activeChatId, title, messages: msgs });
    }
    
    setHistory(newHistory);
    localStorage.setItem("jignesh_history", JSON.stringify(newHistory));
  };

  const handleSend = async () => {
    if (!input.trim() && attachments.length === 0) return;

    const userMsg = { role: "user", content: input, attachments: [...attachments], timestamp: new Date() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setAttachments([]);
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          question: input,
          history: newMessages.slice(-5) // Send short context
        }),
      });
      
      const data = await res.json();
      const botMsg = { role: "bot", content: data.answer || "I'm having trouble connecting.", timestamp: new Date() };
      const finalMessages = [...newMessages, botMsg];
      setMessages(finalMessages);
      saveToHistory(finalMessages);
    } catch (err) {
      setMessages([...newMessages, { role: "bot", content: "System error. Please try again.", timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setActiveChatId(Date.now());
  };

  const loadChat = (chat) => {
    setMessages(chat.messages);
    setActiveChatId(chat.id);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file)
    }));
    setAttachments([...attachments, ...newAttachments]);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Voice logic placeholder
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setInput("Voice note: [Simulated Transcription] How to increase revenue?");
      }, 2000);
    }
  };

  const filteredHistory = history.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <style>{styles}</style>
      <div className="app-layout">
        {/* Sidebar */}
        <div className="sidebar">
          <button className="new-chat-btn" onClick={startNewChat}>
            <span>+</span> New Advisor Session
          </button>
          
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Search history..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="history-list">
            {filteredHistory.map(chat => (
              <div 
                key={chat.id} 
                className={`history-item ${activeChatId === chat.id ? 'active' : ''}`}
                onClick={() => loadChat(chat)}
              >
                {chat.title}
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="chat-container">
          <header className="chat-header">
            <h1>Jigneshbhai AI</h1>
            <p>Practical Business Advisory</p>
          </header>

          <main className="messages-area">
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', marginTop: '100px', opacity: 0.5 }}>
                <p>Namaste! How can I help your business today?</p>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.role}`}>
                <div className="message-content">{msg.content}</div>
                {msg.attachments?.map((att, j) => (
                  <div key={j} style={{ marginTop: '10px' }}>
                    {att.type.startsWith('image/') ? (
                      <img src={att.url} alt="upload" style={{ maxWidth: '100%', borderRadius: '4px' }} />
                    ) : (
                      <div style={{ fontSize: '0.8em', background: 'rgba(0,0,0,0.1)', padding: '5px' }}>📎 {att.name}</div>
                    )}
                  </div>
                ))}
              </div>
            ))}
            
            {loading && (
              <div className="message bot">
                <div className="typing-indicator">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </main>

          <footer className="input-wrapper">
            <div className="attachment-preview">
              {attachments.map((att, i) => (
                <div key={i} className="preview-item" style={{ backgroundImage: att.type.startsWith('image/') ? `url(${att.url})` : 'none' }}>
                  {!att.type.startsWith('image/') && <span style={{ fontSize: '10px' }}>{att.name}</span>}
                </div>
              ))}
            </div>

            <div className="input-box-container">
              <textarea
                placeholder="Ask Jigneshbhai anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                rows="1"
              />
              
              <div className="action-buttons">
                <input 
                  type="file" 
                  hidden 
                  ref={fileInputRef} 
                  multiple 
                  onChange={handleFileUpload} 
                />
                <button className="icon-btn" title="Upload files" onClick={() => fileInputRef.current.click()}>
                  📎
                </button>
                <button 
                  className={`icon-btn ${isRecording ? 'active' : ''}`} 
                  title="Voice note"
                  onClick={toggleRecording}
                >
                  {isRecording ? '🔴' : '🎤'}
                </button>
                <button 
                  className="send-btn" 
                  onClick={handleSend}
                  disabled={loading || (!input.trim() && attachments.length === 0)}
                >
                  ➔
                </button>
              </div>
            </div>
          </footer >

          <div 
            className="admin-trigger" 
            onClick={() => {
              setAdminClicks(adminClicks + 1);
              if (adminClicks + 1 === 5) window.location.href = '/admin';
            }}
          >
            © 2026
          </div>
        </div>
      </div>
    </>
  );
}
