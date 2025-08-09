import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Clock, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef(null);

  const THEME = {
    primary: "#E76F51",
    secondary: "#5C4033",
    dark: "#2B2B2B",
    light: "#F6F1E9",
    accentPrimary: "#F4A261",
    accentSecondary: "#E9C46A"
  };

  // Fetch chat history
  const fetchChatHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/chatbot/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChatHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch chat history:", err);
    }
  };

  // Load a specific chat
  const loadChat = async (chatId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/chatbot/history/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to load chat:", err);
    }
  };

  // Clear chat history
  const clearChat = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:5000/api/chatbot/clear", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages([]);
      setChatHistory([]);
    } catch (err) {
      console.error("Failed to clear chat:", err);
    }
  };

  useEffect(() => {
    fetchChatHistory();
    // Load initial welcome message if no history
    if (messages.length === 0) {
      setMessages([{
        text: "Hello! I'm Lumi, your mental wellness companion. How can I support you today?",
        from: "bot",
        emoji: "🌼",
        timestamp: new Date().toISOString()
      }]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      from: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/chatbot/ask",
        { message: input },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const botMessage = {
        text: res.data.botReply,
        from: "bot",
        emoji: res.data.emoji || null,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);
      fetchChatHistory(); // Refresh history after new message
    } catch (err) {
      console.error("Send Error:", err);
      setError("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      background: `linear-gradient(135deg, ${THEME.light} 0%, ${THEME.accentSecondary}20 100%)`
    }}>
      {/* Sidebar */}
      <motion.div
        initial={{ width: showSidebar ? "300px" : "0px" }}
        animate={{ width: showSidebar ? "300px" : "0px" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          background: THEME.secondary,
          color: THEME.light,
          overflow: "hidden",
          height: "100%",
          position: "relative"
        }}
      >
        <div style={{ padding: "1rem", height: "100%", overflowY: "auto" }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: "1rem"
          }}>
            <h3 style={{ margin: 0 }}>Chat History</h3>
            <button 
              onClick={clearChat}
              style={{
                background: "transparent",
                border: "none",
                color: THEME.light,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <Trash2 size={16} />
              <span>Clear All</span>
            </button>
          </div>

          {chatHistory.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {chatHistory.map((chat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => loadChat(chat._id)}
                  style={{
                    background: "#5C403350",
                    borderRadius: "8px",
                    padding: "12px",
                    cursor: "pointer",
                    borderLeft: `3px solid ${THEME.accentSecondary}`
                  }}
                >
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "8px",
                    marginBottom: "4px"
                  }}>
                    <Clock size={14} />
                    <span style={{ fontSize: "0.8rem" }}>
                      {new Date(chat.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ 
                    margin: 0, 
                    fontSize: "0.9rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}>
                    {chat.content}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center",
              justifyContent: "center",
              height: "50%",
              textAlign: "center",
              opacity: 0.7
            }}>
              <Clock size={24} style={{ marginBottom: "8px" }} />
              <p>No chat history yet</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden"
      }}>
        {/* Chat header */}
        <div style={{
          padding: "1rem",
          background: THEME.secondary,
          color: THEME.light,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <button 
            onClick={() => setShowSidebar(!showSidebar)}
            style={{
              background: "transparent",
              border: "none",
              color: THEME.light,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            {showSidebar ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            <span>{showSidebar ? "Hide" : "Show"} History</span>
          </button>
          
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: THEME.accentSecondary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Bot size={20} color={THEME.secondary} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontWeight: 600 }}>Lumi Companion</h2>
              <p style={{ 
                margin: 0, 
                fontSize: "0.8rem",
                opacity: 0.8,
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}>
                <span style={{ 
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#4ade80",
                  display: "inline-block"
                }}></span>
                Online now
              </p>
            </div>
          </div>
        </div>

        {/* Messages container */}
        <div style={{
          flex: 1,
          padding: "1.5rem",
          overflowY: "auto",
          background: `repeating-linear-gradient(
            to bottom,
            ${THEME.light},
            ${THEME.light} 20px,
            ${THEME.accentSecondary}10 21px,
            ${THEME.accentSecondary}10 22px
          )`
        }}>
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  marginBottom: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: msg.from === "user" ? "flex-end" : "flex-start"
                }}
              >
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "4px",
                  flexDirection: msg.from === "user" ? "row-reverse" : "row"
                }}>
                  <div style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: msg.from === "user" ? THEME.primary : THEME.accentSecondary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    {msg.from === "user" ? 
                      <User size={14} color={THEME.light} /> : 
                      <Bot size={14} color={THEME.secondary} />
                    }
                  </div>
                  <span style={{
                    fontSize: "0.7rem",
                    color: THEME.secondary,
                    opacity: 0.7
                  }}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div style={{
                  maxWidth: "80%",
                  padding: "12px 16px",
                  borderRadius: msg.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  background: msg.from === "user" ? THEME.primary : THEME.accentSecondary,
                  color: msg.from === "user" ? THEME.light : THEME.secondary,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  lineHeight: 1.5
                }}>
                  {msg.emoji && <span style={{ marginRight: "6px" }}>{msg.emoji}</span>}
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "1rem"
                }}
              >
                <div style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: THEME.accentSecondary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  <Bot size={14} color={THEME.secondary} />
                </div>
                <div style={{
                  padding: "12px 16px",
                  borderRadius: "18px 18px 18px 4px",
                  background: THEME.accentSecondary,
                  color: THEME.secondary,
                  display: "flex",
                  gap: "4px"
                }}>
                  <div className="typing-dot" style={{ animationDelay: '0s' }} />
                  <div className="typing-dot" style={{ animationDelay: '0.2s' }} />
                  <div className="typing-dot" style={{ animationDelay: '0.4s' }} />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </AnimatePresence>
        </div>

        {/* Input area */}
        <div style={{
          padding: "1rem",
          borderTop: `1px solid ${THEME.accentSecondary}30`,
          background: THEME.light,
          display: "flex",
          gap: "8px"
        }}>
          <input
            type="text"
            placeholder="Share your thoughts..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: "24px",
              border: `1px solid ${THEME.accentSecondary}50`,
              background: THEME.light,
              color: THEME.dark,
              fontSize: "0.9rem",
              outline: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
            }}
          />
          <motion.button
            onClick={sendMessage}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!input.trim()}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: THEME.primary,
              color: THEME.light,
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              opacity: input.trim() ? 1 : 0.6
            }}
          >
            <Send size={18} />
          </motion.button>
        </div>

        {error && (
          <div style={{
            padding: "0.5rem 1rem",
            background: "#fee2e2",
            color: "#b91c1c",
            fontSize: "0.8rem",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
        .typing-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%";
          background: ${THEME.secondary};
          opacity: 0.7;
          animation: typing 1.4s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;