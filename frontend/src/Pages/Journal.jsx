import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Calendar,
  Trash2,
  Sparkles,
  PenLine,
  Loader2,
  Edit3,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Search,
  Bookmark,
  BookText,
  Notebook,
  Plus,
  Feather,
  Moon,
  Sunrise,
  Sunset,
  ArrowLeft
} from "lucide-react";
const API_URL = import.meta.env.API_URL;

const THEME = {
  primary: "#6D28D9",       // Vibrant purple
  secondary: "#1E1B4B",     // Dark indigo
  dark: "#0F172A",          // Very dark blue
  light: "#E2E8F0",         // Soft light text
  accentPrimary: "#8B5CF6",  // Soft purple
  accentSecondary: "#10B981", // Emerald
  textPrimary: "#F8FAFC",    // Pure white text
  textSecondary: "#94A3B8",  // Light gray-blue
  cardBg: "rgba(30, 27, 75, 0.6)", // Semi-transparent
  border: "rgba(124, 58, 237, 0.3)", // Purple border
  paper: "rgba(249, 250, 251, 0.9)", // For text content
  error: "#EF4444"          // Red for errors
};

const formatDate = (iso) => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return iso;
  }
};

const getTimeOfDayIcon = () => {
  const hour = new Date().getHours();
  if (hour < 12) return <Sunrise size={16} className="text-amber-300" />;
  if (hour < 18) return <Sunset size={16} className="text-orange-400" />;
  return <Moon size={16} className="text-indigo-300" />;
};

const Journal = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [entryText, setEntryText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("write");
  const [selectedEntry, setSelectedEntry] = useState(null);
  const textareaRef = useRef(null);
  const modalRef = useRef(null);





  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setSelectedEntry(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const api = useMemo(() => {
    const inst = axios.create({
      baseURL: API_URL,
      headers: { "Content-Type": "application/json" }
    });

    inst.interceptors.request.use(
      (cfg) => {
        const token = localStorage.getItem("token");
        if (token) cfg.headers.Authorization = `Bearer ${token}`;
        return cfg;
      },
      (err) => Promise.reject(err)
    );

    return inst;
  }, [API_URL]);

  const fetchEntries = async () => {
    setIsLoading(true);
    setError("");
    try {
      const resp = await api.get("/api/journals");
      const data = Array.isArray(resp.data) ? [...resp.data].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
      setEntries(data);
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleApiError = (err) => {
    console.error(err);
    if (err?.response?.status === 401) {
      setError("Session expired — redirecting to login...");
      setTimeout(() => navigate("/login"), 1400);
      return;
    }
    setError(err.response?.data?.message || "An error occurred. Please try again.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!entryText.trim()) {
      setError("Please write something before saving.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { prompt: prompt?.trim() || "", entryText: entryText.trim() };
      if (editingId) {
        await api.put(`/api/journals/${editingId}`, payload);
      } else {
        await api.post("/api/journals/add", payload);
      }
      await fetchEntries();
      setPrompt("");
      setEntryText("");
      setEditingId(null);
      setViewMode("browse");
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry? This cannot be undone.")) return;
    setIsDeleting(id);
    try {
      await api.delete(`/api/journals/${id}`);
      setEntries(prev => prev.filter(e => e._id !== id));
      if (selectedEntry === id) setSelectedEntry(null);
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = (entry) => {
    setPrompt(entry.prompt || "");
    setEntryText(entry.entryText || "");
    setEditingId(entry._id);
    setViewMode("write");
    setSelectedEntry(null);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 120);
  };

  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(en =>
      (en.entryText || "").toLowerCase().includes(q) ||
      (en.prompt || "").toLowerCase().includes(q)
    );
  }, [entries, searchQuery]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  }, [entryText]);

  const SUGGESTED_PROMPTS = [
    "What brought me joy today?",
    "What am I grateful for?",
    "What challenged me today?",
    "What did I learn about myself?",
    "How am I feeling right now?",
    "What would make today great?"
  ];

  return (
    <div className="min-h-screen" style={{ 
      backgroundColor: THEME.dark,
      backgroundImage: `linear-gradient(135deg, ${THEME.secondary} 0%, ${THEME.dark} 100%)`
    }}>
      {/* Subtle background pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${THEME.primary} 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}
      />
      
      <div className="max-w-5xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6"
        >
          <div className="flex items-center gap-4">
            <motion.div 
              className="p-3 rounded-xl"
              style={{ 
                backgroundColor: `${THEME.primary}20`,
                boxShadow: `0 0 0 4px ${THEME.primary}10`
              }}
              whileHover={{ rotate: 5 }}
            >
              <BookText size={28} style={{ color: THEME.accentPrimary }} />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: THEME.textPrimary }}>Mindful Journal</h1>
              <p className="text-sm" style={{ color: THEME.textSecondary }}>
                A peaceful space for your thoughts and reflections
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 min-w-[200px]">
              
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search entries..."
                className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${THEME.border}`,
                  color: THEME.textPrimary
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* View mode toggle */}
        <motion.div 
          className="flex mb-8 rounded-xl overflow-hidden w-fit"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${THEME.border}`
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <button
            onClick={() => setViewMode("write")}
            className={`flex items-center gap-2 px-5 py-2 font-medium transition-all ${viewMode === "write" ? 'opacity-100' : 'opacity-70 hover:opacity-90'}`}
            style={{
              backgroundColor: viewMode === "write" ? THEME.primary : 'transparent',
              color: viewMode === "write" ? THEME.textPrimary : THEME.textSecondary
            }}
          >
            <PenLine size={16} />
            New Entry
          </button>
          <button
            onClick={() => setViewMode("browse")}
            className={`flex items-center gap-2 px-5 py-2 font-medium transition-all ${viewMode === "browse" ? 'opacity-100' : 'opacity-70 hover:opacity-90'}`}
            style={{
              backgroundColor: viewMode === "browse" ? THEME.primary : 'transparent',
              color: viewMode === "browse" ? THEME.textPrimary : THEME.textSecondary
            }}
          >
            <Notebook size={16} />
            Past Entries
          </button>
        </motion.div>

        {/* Main content */}
        {viewMode === "write" ? (
          <motion.div 
            className="rounded-2xl p-6 mb-8 backdrop-blur-sm"
            style={{ 
              backgroundColor: THEME.cardBg,
              border: `1px solid ${THEME.border}`,
              boxShadow: `0 10px 30px rgba(0, 0, 0, 0.2)`
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold mb-1" style={{ color: THEME.textPrimary }}>
                  {editingId ? "Edit Your Entry" : "New Journal Entry"}
                </h2>
                <p className="text-sm" style={{ color: THEME.textSecondary }}>
                  {editingId ? "Revise your thoughts" : "Express yourself freely in this safe space"}
                </p>
              </div>

              {editingId && (
                <motion.button
                  onClick={() => {
                    setEditingId(null);
                    setPrompt("");
                    setEntryText("");
                  }}
                  className="px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                  style={{
                    backgroundColor: `${THEME.primary}20`,
                    color: THEME.primary
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <X size={14} /> Cancel
                </motion.button>
              )}
            </div>

            {/* Prompt input */}
            <div className="mb-6">
              <label className="flex items-center gap-2 mb-2 text-sm font-medium" style={{ color: THEME.textSecondary }}>
                <Sparkles size={16} /> Guided prompt (optional)
              </label>
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., What's on my mind today?"
                className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${THEME.border}`,
                  color: THEME.textPrimary
                }}
              />
              
              <div className="mt-3 flex flex-wrap gap-2">
                {SUGGESTED_PROMPTS.map((p) => (
                  <motion.button
                    key={p}
                    onClick={() => setPrompt(p)}
                    className="px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    style={{
                      backgroundColor: `${THEME.primary}15`,
                      color: THEME.textPrimary,
                      border: `1px dashed ${THEME.border}`
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Feather size={12} /> {p}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Journal textarea */}
            <form onSubmit={handleSubmit}>
              <label className="flex items-center gap-2 mb-2 text-sm font-medium" style={{ color: THEME.textSecondary }}>
                <BookOpen size={16} /> Your Thoughts
              </label>
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={entryText}
                  onChange={(e) => setEntryText(e.target.value)}
                  placeholder="Write freely here... no judgments, no rules"
                  className="w-full p-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  style={{
                    minHeight: '250px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${THEME.border}`,
                    color: THEME.textPrimary,
                    lineHeight: '1.8',
                    fontFamily: 'Georgia, serif',
                    fontSize: '16px',
                    backgroundImage: `linear-gradient(to bottom, transparent, transparent 29px, ${THEME.border} 1px)`,
                    backgroundSize: '100% 30px',
                    backgroundPosition: '0 1px'
                  }}
                />
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  style={{
                    backgroundImage: `linear-gradient(to bottom, transparent, transparent 29px, ${THEME.border} 1px)`,
                    backgroundSize: '100% 30px',
                    backgroundPosition: '0 1px'
                  }}
                />
              </div>

              {error && (
                <motion.div 
                  className="mt-4 p-3 rounded-lg flex items-center gap-2"
                  style={{ 
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    color: THEME.error
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <X size={16} /> {error}
                </motion.div>
              )}

              <div className="mt-6 flex justify-end">
                <motion.button
                  type="submit"
                  disabled={isSubmitting || !entryText.trim()}
                  className="px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.accentPrimary} 100%)`,
                    color: THEME.textPrimary,
                    opacity: !entryText.trim() ? 0.6 : 1
                  }}
                  whileHover={{ scale: !entryText.trim() ? 1 : 1.05 }}
                >
                  {isSubmitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Check size={16} />
                  )}
                  {editingId ? "Update Entry" : "Save Entry"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        ) : (
          <div>
            {/* Entries header */}
            <motion.div 
              className="flex items-center justify-between mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-xl font-bold" style={{ color: THEME.textPrimary }}>
                Your Journal Entries
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm" style={{ color: THEME.textSecondary }}>
                  {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
                </span>
                <motion.button
                  onClick={() => setViewMode("write")}
                  className="px-3 py-1 rounded-lg flex items-center gap-1 text-sm transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.accentPrimary} 100%)`,
                    color: THEME.textPrimary
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Plus size={14} /> New
                </motion.button>
              </div>
            </motion.div>

            {/* Entries list */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin" size={24} style={{ color: THEME.accentPrimary }} />
              </div>
            ) : filteredEntries.length === 0 ? (
              <motion.div 
                className="text-center py-12 rounded-2xl"
                style={{ 
                  backgroundColor: THEME.cardBg,
                  border: `1px dashed ${THEME.border}`
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" 
                  style={{ backgroundColor: `${THEME.primary}20` }}>
                  <Bookmark size={28} style={{ color: THEME.accentPrimary }} />
                </div>
                <h3 className="text-lg font-medium mb-1" style={{ color: THEME.textPrimary }}>
                  {searchQuery ? "No matching entries" : "Your journal is empty"}
                </h3>
                <p className="mb-4 text-sm" style={{ color: THEME.textSecondary }}>
                  {searchQuery ? "Try a different search" : "Write your first entry to begin your journey"}
                </p>
                <motion.button
                  onClick={() => setViewMode("write")}
                  className="px-4 py-2 rounded-lg font-medium flex items-center gap-2 mx-auto transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.accentPrimary} 100%)`,
                    color: THEME.textPrimary
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <PenLine size={16} /> Start Writing
                </motion.button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredEntries.map((entry) => (
                  <motion.div
                    key={entry._id}
                    className="rounded-xl p-5 cursor-pointer backdrop-blur-sm"
                    style={{
                      backgroundColor: THEME.cardBg,
                      border: `1px solid ${THEME.border}`,
                    }}
                    onClick={() => setSelectedEntry(entry)}
                    whileHover={{ y: -3 }}
                    layout
                  >
                    {entry.prompt && (
                      <div className="mb-3 flex items-center gap-2">
                        <Sparkles size={14} style={{ color: THEME.accentPrimary }} />
                        <p className="text-sm font-medium" style={{ color: THEME.accentPrimary }}>
                          {entry.prompt}
                        </p>
                      </div>
                    )}
                    
                    <div className="mb-4" style={{ color: THEME.textPrimary }}>
                      <div className="whitespace-pre-line font-serif leading-relaxed line-clamp-3">
                        {entry.entryText}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs" style={{ color: THEME.textSecondary }}>
                        {getTimeOfDayIcon()}
                        <span>{formatDate(entry.createdAt)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Entry Modal */}
      <AnimatePresence>
        {selectedEntry && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={modalRef}
              className="w-full max-w-2xl max-h-[90vh] rounded-2xl flex flex-col"
              style={{
                backgroundColor: THEME.cardBg,
                border: `1px solid ${THEME.border}`,
              }}
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
            >
              {/* Modal header */}
              <div className="p-4 border-b" style={{ borderColor: THEME.border }}>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setSelectedEntry(null)}
                    className="p-2 rounded-full"
                    style={{ backgroundColor: `${THEME.primary}20` }}
                  >
                    <ArrowLeft size={20} style={{ color: THEME.textPrimary }} />
                  </button>
                  <div className="flex gap-2">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(selectedEntry);
                      }}
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${THEME.primary}20` }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Edit3 size={16} style={{ color: THEME.accentPrimary }} />
                    </motion.button>
                    
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(selectedEntry._id);
                      }}
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${THEME.primary}20` }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isDeleting === selectedEntry._id ? (
                        <Loader2 size={16} className="animate-spin" style={{ color: THEME.accentPrimary }} />
                      ) : (
                        <Trash2 size={16} style={{ color: THEME.accentPrimary }} />
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Modal content */}
              <div className="p-6 overflow-y-auto flex-1">
                {selectedEntry.prompt && (
                  <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: `${THEME.primary}15` }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={16} style={{ color: THEME.accentPrimary }} />
                      <p className="text-sm font-medium" style={{ color: THEME.accentPrimary }}>
                        Prompt
                      </p>
                    </div>
                    <p style={{ color: THEME.textPrimary }}>{selectedEntry.prompt}</p>
                  </div>
                )}

                <div className="p-4 rounded-lg" style={{ 
                  backgroundColor: THEME.paper,
                  color: THEME.dark,
                  fontFamily: 'Georgia, serif',
                  lineHeight: '1.8'
                }}>
                  <div className="whitespace-pre-line">
                    {selectedEntry.entryText}
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-sm" style={{ color: THEME.textSecondary }}>
                  <Calendar size={14} />
                  <span>{formatDate(selectedEntry.createdAt)}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Journal;