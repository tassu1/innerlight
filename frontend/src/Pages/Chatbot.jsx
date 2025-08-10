

import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { Send, Bot, User,  Trash2, Plus, ChevronRight, Wifi, AlertCircle, Waves } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [isUserScrollingUp, setIsUserScrollingUp] = useState(false);
  const chatContainerRef = useRef(null);
  const prevScrollHeight = useRef(0);
  const inputRef = useRef(null);

  // Your theme colors with contrast adjustments
  const THEME = {
    primary: "#E76F51",       // Coral
    secondary: "#5C4033",     // Cocoa (adjusted for better contrast)
    dark: "#2B2B2B",          // Charcoal
    light: "#F6F1E9",         // Cream
    accentPrimary: "#F4A261", // Sunset
    accentSecondary: "#E9C46A", // Gold
    error: "#DC2626"         // Red-600 for errors
  };

  // API configuration
  const API_URL =  'http://localhost:5000';

  // Configure axios instance
  const api = axios.create({
    baseURL: `${API_URL}/api/chatbot`,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Add auth token interceptor
  api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, error => {
    return Promise.reject(error);
  });

  // Handle token expiration
  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        setError('Session expired. Please log in again.');
        setShowErrorModal(true);
        // Here you would typically redirect to login
      }
      return Promise.reject(error);
    }
  );

  // Initialize chat
  useEffect(() => {
    fetchChatHistory();
    fetchInitialMessages();
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = 0;
    }
  }, []);

  // Handle scroll behavior
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 50;
      setIsUserScrollingUp(!isNearBottom && scrollTop < prevScrollHeight.current);
      prevScrollHeight.current = scrollTop;
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll to bottom when new messages arrive (unless user is scrolling up)
  useEffect(() => {
    if (chatContainerRef.current && !isUserScrollingUp) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isUserScrollingUp]);

  // Character count for input
  useEffect(() => {
    setCharCount(input.length);
  }, [input]);

  // Fetch initial messages with debouncing
  const fetchInitialMessages = useCallback(
    debounce(async () => {
      try {
        const res = await api.get('/history');
        if (res.data.length > 0) {
          const formatted = res.data.map(msg => ({
            id: msg._id,
            text: msg.content,
            sender: msg.role === 'user' ? 'user' : 'bot',
            timestamp: msg.createdAt,
            emoji: msg.emoji || null
          }));
          setMessages(formatted.reverse());
        } else {
          setMessages([{
            id: Date.now(),
            text: "Hello! I'm InnerLight. How can I support your mental wellness today?",
            sender: 'bot',
            timestamp: new Date(),
            emoji: '🌼'
          }]);
        }
      } catch (err) {
        handleError("Failed to load chat history", err);
      }
    }, 300),
    []
  );

  // Fetch chat history with pagination
  const fetchChatHistory = async () => {
    try {
      const res = await api.get('/history');
      setChatHistory(res.data.map(msg => ({
        id: msg._id,
        preview: msg.content,
        date: new Date(msg.createdAt).toLocaleDateString(),
        time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        role: msg.role
      })));
    } catch (err) {
      handleError("Failed to fetch history", err);
    }
  };

  const startNewChat = () => {
    setMessages([{
      id: Date.now(),
      text: "I'm here to listen. What would you like to talk about today?",
      sender: 'bot',
      timestamp: new Date(),
      emoji: '🌞'
    }]);
    setShowHistory(false);
  };

  const clearAllChats = async () => {
    try {
      await api.delete('/clear');
      startNewChat();
      setChatHistory([]);
    } catch (err) {
      handleError("Failed to clear chat history", err);
    }
  };

  const deleteSingleChat = async (chatId) => {
    try {
      await api.delete(`/history/${chatId}`);
      fetchChatHistory();
      if (messages.some(msg => msg.id === chatId)) {
        setMessages(messages.filter(msg => msg.id !== chatId));
      }
    } catch (err) {
      handleError("Failed to delete chat", err);
    }
  };

  // Enhanced error handling
  const handleError = (message, err) => {
    console.error(message, err);
    setError(message);
    setShowErrorModal(true);
  };

  // Debounced message sending
  const handleSend = useCallback(
    debounce(async () => {
      if (!input.trim()) return;
      
      const userMessage = {
        id: Date.now(),
        text: input,
        sender: 'user',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setLoading(true);
      
      try {
        const res = await api.post('/ask', { message: input });
        const botMessage = {
          id: Date.now() + 1,
          text: res.data.botReply,
          sender: 'bot',
          timestamp: new Date(),
          emoji: res.data.emoji || null
        };
        setMessages(prev => [...prev, botMessage]);
        fetchChatHistory();
      } catch (err) {
        handleError("Failed to get response", err);
      } finally {
        setLoading(false);
      }
    }, 500),
    [input]
  );

  // Handle multiline input (Shift + Enter)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div 
      className="chatbot-container"
      style={{
        display: 'flex',
        height: '100vh',
        backgroundColor: THEME.light,
        flexDirection: 'column'
      }}
      role="main"
      aria-label="Chatbot interface"
    >
      {/* Header - Fixed at top */}
      <header
        style={{
          padding: '1rem',
          backgroundColor: THEME.light,
          color: THEME.light,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <button 
          onClick={() => setShowHistory(!showHistory)}
          aria-label={showHistory ? "Hide chat history" : "Show chat history"}
          style={{
            background: 'transparent',
            border: 'none',
            color: THEME.secondary,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer'
          }}
        >
          <Waves size={20} aria-hidden="true" />
          
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="online-indicator" style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#4ADE80',
            marginRight: '0.5rem'
          }} aria-label="Online status" />
          
          <h1 style={{ margin: 0, fontWeight: 600, color:THEME.secondary }}>InnerLight</h1>
        </div>
        
        <button 
          onClick={startNewChat}
          aria-label="Start new chat"
          style={{
            background: THEME.accentSecondary,
            color: THEME.secondary,
            border: 'none',
            borderRadius: '6px',
            padding: '0.5rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          <Plus size={16} aria-hidden="true" /> New
        </button>
      </header>

      {/* Main Content Area */}
      <div style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* History Panel */}
        <motion.aside
          initial={{ x: '-100%' }}
          animate={{ x: showHistory ? 0 : '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{
            width: '280px',
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 5,
            backgroundColor: THEME.secondary,
            color: THEME.light,
            overflowY: 'auto',
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
          }}
          aria-label="Chat history panel"
        >
          <div style={{ padding: '1rem' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h2 style={{ margin: 0 }}>Past Conversations</h2>
              <button 
                onClick={() => setShowHistory(false)}
                aria-label="Close history panel"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: THEME.light,
                  cursor: 'pointer'
                }}
              >
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </div>
            
            {chatHistory.map(chat => (
              <div 
                key={chat.id}
                onClick={() => {
                  setMessages([{
                    id: chat.id,
                    text: chat.preview,
                    sender: chat.role,
                    timestamp: new Date(chat.date)
                  }]);
                  setShowHistory(false);
                }}
                className="history-item"
                style={{
                  padding: '0.75rem',
                  marginBottom: '0.5rem',
                  borderRadius: '6px',
                  backgroundColor: `${THEME.accentSecondary}30`,
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                aria-label={`Conversation from ${chat.date}`}
              >
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.25rem'
                }}>
                  <span style={{ fontWeight: 500 }}>{chat.date}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem' }}>{chat.time}</span>
                    <Wifi size={14} color="#4ADE80" aria-hidden="true" />
                  </div>
                </div>
                <p style={{ 
                  margin: 0,
                  fontSize: '0.9rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {chat.preview}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSingleChat(chat.id);
                  }}
                  aria-label={`Delete conversation from ${chat.date}`}
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    top: '0.5rem',
                    background: 'transparent',
                    border: 'none',
                    color: THEME.light,
                    cursor: 'pointer',
                    opacity: 0.7,
                    ':hover': {
                      opacity: 1
                    }
                  }}
                >
                  <Trash2 size={14} aria-hidden="true" />
                </button>
              </div>
            ))}
            
            <button 
              onClick={clearAllChats}
              aria-label="Clear all chat history"
              style={{
                width: '100%',
                background: 'transparent',
                color: THEME.light,
                border: `1px solid ${THEME.primary}`,
                borderRadius: '6px',
                padding: '0.5rem',
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer'
              }}
            >
              <Trash2 size={16} aria-hidden="true" /> Clear All
            </button>
          </div>
        </motion.aside>

        {/* Chat Area */}
        <section
          ref={chatContainerRef}
          style={{
            flex: 1,
            padding: '1rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            background: `repeating-linear-gradient(
              ${THEME.light},
              ${THEME.light} 20px,
              ${THEME.accentSecondary}15 21px,
              ${THEME.accentSecondary}15 22px
            )`
          }}
          aria-label="Chat messages"
        >
          {/* Messages */}
          <AnimatePresence>
            {messages.map((message) => (
              <motion.article
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  marginBottom: '1rem'
                }}
                aria-labelledby={`message-${message.id}-text`}
              >
                <div 
                  id={`message-${message.id}-text`}
                  style={{
                    padding: '1rem',
                    borderRadius: message.sender === 'user' 
                      ? '12px 12px 0 12px' 
                      : '12px 12px 12px 0',
                    backgroundColor: message.sender === 'user' 
                      ? THEME.primary 
                      : THEME.accentSecondary,
                    color: message.sender === 'user' ? THEME.light : THEME.secondary,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    lineHeight: 1.5
                  }}
                >
                 
                  {message.text}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: THEME.secondary,
                  marginTop: '0.25rem',
                  textAlign: message.sender === 'user' ? 'right' : 'left',
                  opacity: 0.7,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  {message.sender === 'bot' && (
                    <>
                      <Wifi size={12} color="#4ADE80" aria-hidden="true" />
                      <span aria-hidden="true">·</span>
                    </>
                  )}
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </motion.article>
            ))}
            
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  alignSelf: 'flex-start',
                  padding: '1rem',
                  borderRadius: '12px 12px 12px 0',
                  backgroundColor: THEME.accentSecondary,
                  display: 'flex',
                  gap: '0.5rem',
                  marginBottom: '1rem'
                }}
                aria-label="Bot is typing"
              >
                <div className="typing-dot" style={{ backgroundColor: THEME.secondary }} />
                <div className="typing-dot" style={{ backgroundColor: THEME.secondary }} />
                <div className="typing-dot" style={{ backgroundColor: THEME.secondary}} />
                <span className="sr-only">Bot is typing</span>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      {/* Input Area - Fixed at bottom */}
      <footer
        style={{
          padding: '1rem',
          backgroundColor: THEME.light,
          borderTop: `1px solid ${THEME.accentSecondary}30`,
          position: 'sticky',
          bottom: 0
        }}
        aria-label="Message input"
      >
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem',
          maxWidth: '800px',
          margin: '0 auto',
          width: '100%',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                aria-label="Type your message"
                rows={1}
                style={{
                  width: '100%',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '24px',
                  border: `1px solid ${THEME.accentSecondary}50`,
                  backgroundColor: THEME.light,
                  color: THEME.dark,
                  outline: 'none',
                  fontSize: '0.95rem',
                  resize: 'none',
                  minHeight: '48px',
                  maxHeight: '120px',
                  overflowY: 'auto'
                }}
              />
              {charCount > 0 && (
                <span 
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    bottom: '0.75rem',
                    fontSize: '0.75rem',
                    color: charCount > 500 ? THEME.error : THEME.secondary,
                    opacity: 0.7
                  }}
                  aria-live="polite"
                >
                  {charCount}/1000
                </span>
              )}
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || charCount > 1000}
              aria-label="Send message"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: THEME.primary,
                color: THEME.light,
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                opacity: input.trim() && charCount <= 1000 ? 1 : 0.6,
                transition: 'opacity 0.2s'
              }}
            >
              <Send size={20} aria-hidden="true" />
            </button>
          </div>
          {charCount > 1000 && (
            <div style={{ 
              color: THEME.error,
              fontSize: '0.8rem',
              textAlign: 'center',
              marginTop: '0.25rem'
            }}>
              Message too long (max 1000 characters)
            </div>
          )}
        </div>
      </footer>

      {/* Error Modal */}
      <AnimatePresence>
        {showErrorModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100
            }}
            aria-modal="true"
            role="dialog"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                maxWidth: '400px',
                width: '90%',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
              }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                marginBottom: '1rem'
              }}>
                <AlertCircle size={24} color={THEME.error} aria-hidden="true" />
                <h3 style={{ margin: 0, color: THEME.error }}>Error</h3>
              </div>
              <p style={{ marginBottom: '1.5rem' }}>{error}</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowErrorModal(false)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: THEME.primary,
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                  aria-label="Close error message"
                >
                  OK
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS for hover effects and animations */}
      <style jsx>{`
        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
        .typing-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          opacity: 0.7;
          animation: typing 1.4s infinite ease-in-out;
        }
        .history-item:hover {
          background-color: ${THEME.accentSecondary}50 !important;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
      `}</style>
    </div>
  );
};

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

export default Chatbot;