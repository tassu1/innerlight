import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Send, Trash2, Plus, ChevronRight, Wifi, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const THEME = {
  primary: "#7C3AED",       // Vibrant purple
  secondary: "#1E1B4B",     // Dark indigo
  dark: "#0F172A",          // Very dark blue (almost black)
  light: "#E2E8F0",         // Soft light text
  accentPrimary: "#FFFFFF",  // White for buttons
  accentSecondary: "#10B981", // Emerald
  textPrimary: "#F8FAFC",    // Pure white text
  textSecondary: "#94A3B8",  // Light gray-blue text
  cardBg: "rgba(30, 27, 75, 0.5)", // Semi-transparent dark indigo
  border: "rgba(124, 58, 237, 0.2)", // Purple border with transparency
  glass: "rgba(255, 255, 255, 0.05)" // Glass effect
};

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  const API_URL = 'http://localhost:5000';
  const api = axios.create({
    baseURL: `${API_URL}/api/chatbot`,
    headers: { 'Content-Type': 'application/json' }
  });

  api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        setShowErrorModal(true);
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    fetchChatHistory();
    fetchInitialMessages();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    setCharCount(input.length);
  }, [input]);

  const fetchInitialMessages = async () => {
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
        setWelcomeMessage();
      }
    } catch (err) {
      setWelcomeMessage();
    }
  };

  const setWelcomeMessage = () => {
    setMessages([{
      id: Date.now(),
      text: "Hello! I'm InnerLight. How can I support your mental wellness today?",
      sender: 'bot',
      timestamp: new Date(),
      emoji: '🌼'
    }]);
  };

  const fetchChatHistory = async () => {
    try {
      const res = await api.get('/history');
      setChatHistory(res.data.map(msg => ({
        id: msg._id,
        preview: msg.content.length > 50 
          ? msg.content.substring(0, 50) + '...' 
          : msg.content,
        date: new Date(msg.createdAt).toLocaleDateString(),
        time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        role: msg.role
      })));
    } catch (err) {
      console.error("Failed to fetch history", err);
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
      console.error("Failed to clear chat history", err);
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
      console.error("Failed to delete chat", err);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || charCount > 1000) return;
    
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
      setError("Failed to get response");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: THEME.dark }}>
      {/* Header */}
      <header className="sticky top-0 z-30 p-3 flex items-center justify-between backdrop-blur-md border-b"
        style={{ 
          backgroundColor: THEME.cardBg,
          borderColor: THEME.border 
        }}
      >
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 transition-colors"
          style={{ color: THEME.textPrimary }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="hidden sm:inline">History</span>
        </button>
        
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <h1 className="text-lg font-semibold" style={{ color: THEME.textPrimary }}>InnerLight AI</h1>
        </div>
        
        <button 
          onClick={startNewChat}
          className="flex items-center gap-2 px-3 py-1 rounded-lg transition-colors"
          style={{ 
            backgroundColor: `${THEME.primary}20`,
            color: THEME.textPrimary
          }}
        >
          <Plus size={16} />
          <span className="hidden sm:inline">New Chat</span>
        </button>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-60px)]">
        {/* History Panel */}
        <AnimatePresence>
          {showHistory && (
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute z-20 w-64 h-full shadow-lg md:relative"
              style={{ 
                backgroundColor: THEME.secondary,
                borderRight: `1px solid ${THEME.border}`
              }}
            >
              <div className="p-4 h-full flex flex-col">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-md font-semibold" style={{ color: THEME.textPrimary }}>Conversations</h2>
                  <button 
                    onClick={() => setShowHistory(false)}
                    className="hover:opacity-70 transition-opacity"
                    style={{ color: THEME.textPrimary }}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  {chatHistory.length > 0 ? (
                    chatHistory.map(chat => (
                      <motion.div 
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
                        className="relative p-2 mb-1 rounded-lg cursor-pointer transition-colors"
                        style={{ 
                          backgroundColor: `${THEME.primary}10`,
                          color: THEME.textPrimary
                        }}
                        whileHover={{ backgroundColor: `${THEME.primary}20` }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">{chat.date}</span>
                          <div className="flex items-center gap-1 text-xs">
                            <span>{chat.time}</span>
                            <Wifi size={12} className="text-green-400" />
                          </div>
                        </div>
                        <p className="text-xs opacity-80 truncate">
                          {chat.preview}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSingleChat(chat.id);
                          }}
                          className="absolute top-1 right-1 opacity-70 hover:opacity-100 transition-opacity"
                          style={{ color: THEME.textPrimary }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-center py-3 opacity-70 text-sm" style={{ color: THEME.textPrimary }}>
                      No past conversations
                    </p>
                  )}
                </div>

                <motion.button 
                  onClick={clearAllChats}
                  className="w-full mt-3 py-1.5 flex items-center justify-center gap-2 rounded-lg transition-colors text-sm"
                  style={{ 
                    backgroundColor: `${THEME.primary}30`,
                    color: THEME.textPrimary
                  }}
                  whileHover={{ backgroundColor: `${THEME.primary}40` }}
                >
                  <Trash2 size={14} />
                  Clear All
                </motion.button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col relative h-full">
          {/* Messages container with proper padding */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto px-4 pt-4 pb-24"
            style={{
              scrollBehavior: 'smooth',
              paddingBottom: '6rem'
            }}
          >
            <div className="max-w-4xl mx-auto space-y-2">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <motion.div 
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        message.sender === 'user' 
                          ? 'rounded-br-none' 
                          : 'rounded-bl-none'
                      }`}
                      style={{ 
                        backgroundColor: message.sender === 'user' 
                          ? '#FFFFFF'
                          : THEME.cardBg,
                        border: `1px solid ${THEME.border}`,
                        color: message.sender === 'user' 
                          ? '#1E293B'
                          : THEME.textPrimary
                      }}
                      whileHover={{ scale: 1.01 }}
                    >
                      {message.emoji && <span className="mr-1">{message.emoji}</span>}
                      <p className="whitespace-pre-wrap text-sm">{message.text}</p>
                      <div className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-gray-500 text-right' : 'text-indigo-300 text-left'
                      }`}>
                        {formatTime(message.timestamp)}
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
                
                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-indigo-900/20 text-gray-200 rounded-lg rounded-bl-none px-3 py-2 flex items-center gap-2"
                      style={{ border: `1px solid ${THEME.border}` }}
                    >
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Fixed Input Box */}
          <div className="sticky bottom-0 left-0 right-0 p-4 z-20 backdrop-blur-md"
            style={{ 
              backgroundColor: THEME.cardBg,
              borderTop: `1px solid ${THEME.border}`,
              paddingBottom: '1.5rem'
            }}
          >
            <div className="max-w-4xl mx-auto w-full px-4">
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    rows={1}
                    className="w-full p-3 pr-10 rounded-xl focus:outline-none resize-none text-sm transition-all"
                    style={{ 
                      minHeight: '48px',
                      maxHeight: '120px',
                      backgroundColor: `${THEME.secondary}80`,
                      color: THEME.textPrimary,
                      border: `1px solid ${THEME.border}`,
                      boxShadow: `0 2px 10px ${THEME.primary}10`
                    }}
                  />
                  {charCount > 0 && (
                    <span className={`absolute right-3 bottom-3 text-xs ${
                      charCount > 1000 ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {charCount}/1000
                    </span>
                  )}
                </div>
                <motion.button
                  onClick={handleSend}
                  disabled={!input.trim() || charCount > 1000 || loading}
                  className={`p-3 rounded-xl flex items-center justify-center ${
                    !input.trim() || charCount > 1000 || loading
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-white hover:bg-gray-100 text-black'
                  }`}
                  style={{
                    height: '48px',
                    width: '48px',
                    flexShrink: 0,
                    marginBottom: '6px'
                  }}
                  whileHover={{ scale: !input.trim() || charCount > 1000 || loading ? 1 : 1.05 }}
                  whileTap={{ scale: !input.trim() || charCount > 1000 || loading ? 1 : 0.95 }}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Send size={18} />
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      <AnimatePresence>
        {showErrorModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30"
          >
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              className="rounded-xl p-5 max-w-xs w-full mx-4"
              style={{ 
                backgroundColor: THEME.cardBg,
                border: `1px solid ${THEME.border}`
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle size={22} className="text-red-400" />
                <h3 className="text-md font-semibold" style={{ color: THEME.textPrimary }}>Error</h3>
              </div>
              <p className="text-sm mb-5" style={{ color: THEME.textPrimary }}>{error}</p>
              <div className="flex justify-end">
                <motion.button
                  onClick={() => setShowErrorModal(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium"
                  style={{ 
                    backgroundColor: THEME.primary,
                    color: THEME.textPrimary
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  OK
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;