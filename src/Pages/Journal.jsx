// Journal.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  Plus
} from "lucide-react";

/**
 * Theme (as you asked)
 */
const THEME = {
  primary: "#E76F51",       // Deeper coral — buttons / CTAs
  secondary: "#5C4033",     // Cocoa brown — headings / subtle UI
  dark: "#2B2B2B",          // Charcoal — text
  light: "#F6F1E9",         // Soft cream — page background
  accentPrimary: "#F4A261", // Sunset orange — CTA gradient end
  accentSecondary: "#E9C46A",
  cardbg : "#F8FAF6"
};

/**
 * Helper - nicely format createdAt date
 */
const formatDate = (iso) => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  } catch {
    return iso;
  }
};

const Journal = () => {
  const navigate = useNavigate();

  // form + UI state
  const [prompt, setPrompt] = useState("");
  const [entryText, setEntryText] = useState("");
  const [editingId, setEditingId] = useState(null);

  // data + filters
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedEntry, setExpandedEntry] = useState(null);
  const [viewMode, setViewMode] = useState("write"); // "write" or "browse"

  const textareaRef = useRef(null);

  /**
   * Axios instance (memoized so interceptor isn't added repeatedly)
   * Set REACT_APP_API_URL in your env if you want.
   */
  const api = useMemo(() => {
    const inst = axios.create({
      baseURL: "http://localhost:5000",
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
  }, []);

  /**
   * Fetch entries from backend
   */
  const fetchEntries = async () => {
    setIsLoading(true);
    setError("");
    try {
      const resp = await api.get("/api/journals");
      // ensure newest first
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Centralized API error handling
   */
  const handleApiError = (err) => {
    console.error(err);
    if (err?.response) {
      const s = err.response.status;
      if (s === 401) {
        setError("Session expired — redirecting to login...");
        setTimeout(() => navigate("/login"), 1400);
        return;
      }
      setError(err.response.data?.message || "Server error. Try again later.");
    } else if (err?.request) {
      setError("Network error. Check your connection.");
    } else {
      setError("An unexpected error occurred.");
    }
  };

  /**
   * Submit (create or update)
   */
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
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
      // refresh and reset
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

  /**
   * Delete
   */
  const handleDelete = async (id) => {
    const c = window.confirm("Delete this entry? This cannot be undone.");
    if (!c) return;
    setIsDeleting(id);
    setError("");
    try {
      await api.delete(`/api/journals/${id}`);
      // optimistic: remove locally first for snappy UI
      setEntries(prev => prev.filter(e => e._id !== id));
      if (expandedEntry === id) setExpandedEntry(null);
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsDeleting(null);
    }
  };

  /**
   * Start editing an entry
   */
  const handleEdit = (entry) => {
    setPrompt(entry.prompt || "");
    setEntryText(entry.entryText || "");
    setEditingId(entry._id);
    setViewMode("write");
    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(textareaRef.current.value.length, textareaRef.current.value.length);
    }, 120);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setPrompt("");
    setEntryText("");
  };

  /**
   * Expand / collapse full text
   */
  const toggleExpandEntry = (id) => {
    setExpandedEntry(prev => (prev === id ? null : id));
  };

  /**
   * Filtered entries computed from searchQuery + entries
   */
  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(en =>
      (en.entryText || "").toLowerCase().includes(q) ||
      (en.prompt || "").toLowerCase().includes(q)
    );
  }, [entries, searchQuery]);

  /**
   * Auto-resize textarea for nicer UX
   */
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  }, [entryText]);

  /**
   * Quick prompts sample for users — click to set.
   */
  const SUGGESTED_PROMPTS = [
    "What am I grateful for today?",
    "One small win from today...",
    "A feeling I want to acknowledge..."
  ];

  /**
   * Styles used inline for consistent theme usage
   */
  const styles = {
    page: { backgroundColor: THEME.light, minHeight: "100vh", padding: "2rem 1rem" },
    container: { maxWidth: "1100px", margin: "0 auto" },
    headerTitle: { color: THEME.secondary, fontWeight: 700 },
    smallMuted: { color: THEME.secondary, opacity: 0.85 },
    card: {
      background: "#fffdf9",
      border: `1px solid ${THEME.accentSecondary}33`,
      borderRadius: 14,
      boxShadow: "0 6px 22px rgba(43,43,43,0.06)"
    },
    saveButton: {
      background: `linear-gradient(90deg, ${THEME.primary}, ${THEME.accentPrimary})`,
      color: THEME.light,
      boxShadow: "0 8px 24px rgba(231,111,81,0.14)"
    },
    secondaryBtn: {
      background: THEME.accentSecondary,
      color: THEME.secondary
    },
    journalCard: {
      background: "#FAFAFA",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 4px 12px rgba(43, 22, 22, 0.05)",
      border: `1px solid ${THEME.accentSecondary}20`,
      transition: "all 0.2s ease",
      cursor: "pointer",
      flex: "1 1 300px",
      maxWidth: "100%",
      minHeight: "200px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div style={{ width: 48, height: 48, borderRadius: 12, background: THEME.primary, display: "grid", placeItems: "center" }}>
              <BookText color="#fff" />
            </div>
            <div>
              <div style={styles.headerTitle} className="text-xl">InnerLight — Journal</div>
              <div style={styles.smallMuted} className="text-sm">A calm place to offload thoughts, daily notes & reflections.</div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-2 rounded-full" style={{ background: `${THEME.accentSecondary}20`, color: THEME.secondary }}>
              <Bookmark size={14} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>{filteredEntries.length}</span>
            </div>

            <div className="relative flex-1 min-w-[200px]">
              <Search size={18} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: THEME.secondary }} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search entries..."
                style={{
                  padding: "10px 12px 10px 40px",
                  borderRadius: 12,
                  border: `1px solid ${THEME.accentSecondary}30`,
                  background: THEME.light,
                  color: THEME.dark,
                  width: "100%"
                }}
              />
            </div>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex mb-6">
          <button
            onClick={() => setViewMode("write")}
            className={`flex items-center gap-2 px-4 py-2 rounded-l-lg font-medium ${viewMode === "write" ? 'opacity-100' : 'opacity-70'}`}
            style={{
              background: viewMode === "write" ? THEME.primary : `${THEME.primary}30`,
              color: viewMode === "write" ? THEME.light : THEME.secondary
            }}
          >
            <PenLine size={16} />
            New Entry
          </button>
          <button
            onClick={() => setViewMode("browse")}
            className={`flex items-center gap-2 px-4 py-2 rounded-r-lg font-medium ${viewMode === "browse" ? 'opacity-100' : 'opacity-70'}`}
            style={{
              background: viewMode === "browse" ? THEME.primary : `${THEME.primary}30`,
              color: viewMode === "browse" ? THEME.light : THEME.secondary
            }}
          >
            <Notebook size={16} />
            Past Journals
          </button>
        </div>

        {/* Main content area */}
        {viewMode === "write" ? (
          <div style={{ ...styles.card, padding: 18 }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: THEME.secondary }}>Write & reflect</div>
                <div style={{ color: THEME.secondary, opacity: 0.85, fontSize: 13 }}>Emptying your mind helps clarity — no pressure, no judgments.</div>
              </div>

              {editingId ? (
                <div style={{ fontSize: 13, color: THEME.primary, fontWeight: 700 }} className="px-3 py-1 rounded-full">
                  Editing
                </div>
              ) : null}
            </div>

            {/* Prompt input & suggested chips */}
            <div className="mb-3">
              <label className="flex items-center gap-2 text-sm mb-2" style={{ color: THEME.secondary }}>
                <Sparkles size={16} /> Guided prompt (optional)
              </label>
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., What am I grateful for today?"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: `1px solid ${THEME.accentSecondary}33`,
                  background: THEME.light,
                  color: THEME.dark
                }}
              />
              <div className="mt-2 flex gap-2 flex-wrap">
                {SUGGESTED_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPrompt(p)}
                    className="px-3 py-1 rounded-full text-sm"
                    style={{
                      background: "transparent",
                      border: `1px dashed ${THEME.accentSecondary}33`,
                      color: THEME.secondary
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Large lined textarea */}
            <form onSubmit={handleSubmit}>
              <label className="flex items-center gap-2 text-sm mb-2" style={{ color: THEME.secondary }}>
                <BookOpen size={16} /> Your Thoughts
              </label>
              <textarea
                ref={textareaRef}
                value={entryText}
                onChange={(e) => setEntryText(e.target.value)}
                placeholder="Write freely — this is your private space."
                style={{
                  width: "100%",
                  padding: 16,
                  borderRadius: 12,
                  border: `1px solid ${THEME.accentSecondary}22`,
                  background: `repeating-linear-gradient(
                    to bottom,
                    ${THEME.light},
                    ${THEME.light} 28px,
                    rgba(0,0,0,0.02) 29px,
                    rgba(0,0,0,0.02) 30px
                  )`,
                  color: THEME.dark,
                  minHeight: 200,
                  resize: "none",
                  lineHeight: 1.8,
                  fontFamily: "serif",
                  fontSize: 15
                }}
              />

              {/* error */}
              {error && (
                <div className="mt-3 flex items-center gap-2 p-3 rounded" style={{ background: "#fff0ef", color: THEME.primary }}>
                  <X size={16} /> <div style={{ fontSize: 13 }}>{error}</div>
                </div>
              )}

              {/* actions */}
              <div className="mt-4 flex items-center gap-3 justify-end">
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-4 py-2 rounded-lg font-medium"
                    style={{ ...styles.secondaryBtn }}
                  >
                    Cancel
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !entryText.trim()}
                  className="flex items-center gap-2 px-5 py-2 rounded-full font-semibold"
                  style={{
                    ...styles.saveButton,
                    opacity: !entryText.trim() ? 0.6 : 1,
                    cursor: !entryText.trim() ? "not-allowed" : "pointer"
                  }}
                >
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  {editingId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <div style={{ ...styles.card, padding: 14, marginBottom: 16 }}>
              <div className="flex items-center justify-between mb-3">
                <div style={{ fontWeight: 700, color: THEME.secondary, fontSize: 18 }}>Your Journal Entries</div>
                <div style={{ fontSize: 14, color: THEME.secondary, opacity: 0.9 }}>{entries.length} saved</div>
              </div>
            </div>

            {/* Loading / empty / list */}
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="animate-spin" />
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center py-8" style={{ ...styles.card, padding: 24 }}>
                <div style={{ width: 54, height: 54, margin: "0 auto", borderRadius: 12, background: THEME.primary, display: "grid", placeItems: "center" }}>
                  <Bookmark color="#fff" />
                </div>
                <div style={{ marginTop: 12, fontWeight: 700, color: THEME.primary }}>No entries yet</div>
                <div style={{ marginTop: 6, color: THEME.secondary }}>Start by writing what's on your mind.</div>
                <button
                  onClick={() => setViewMode("write")}
                  className="mt-4 px-3 py-2 rounded-md flex items-center gap-2 mx-auto"
                  style={{ ...styles.saveButton }}
                >
                  <Plus size={16} />
                  New Entry
                </button>
              </div>
            ) : (
              <div style={{ 
                display: "flex", 
                flexWrap: "wrap", 
                gap: "16px",
                justifyContent: "flex-start"
              }}>
                {filteredEntries.map((entry) => {
                  const isExpanded = expandedEntry === entry._id;
                  const preview = (entry.entryText || "").length > 180 ? (entry.entryText || "").slice(0, 180) + "…" : (entry.entryText || "");
                  
                  return (
                    <div 
                      key={entry._id} 
                      style={{ 
                        ...styles.journalCard,
                        border: expandedEntry === entry._id ? `2px solid ${THEME.primary}` : styles.journalCard.border
                      }}
                      onClick={() => toggleExpandEntry(entry._id)}
                    >
                      <div>
                        {entry.prompt && (
                          <div style={{ 
                            fontSize: 15, 
                            color: THEME.primary, 
                            fontWeight: 600,
                            marginBottom: 8
                          }}>
                            {entry.prompt}
                          </div>
                        )}
                        <div style={{ 
                          fontSize: 16, 
                          color: THEME.dark, 
                          lineHeight: 1.6,
                          whiteSpace: "pre-line",
                          marginBottom: 12
                        }}>
                          {isExpanded ? entry.entryText : preview}
                        </div>
                      </div>
                      
                      <div style={{ 
                        display: "flex", 
                        justifyContent: "space-between",
                        alignItems: "flex-end"
                      }}>
                        <div style={{ 
                          fontSize: 13, 
                          color: THEME.secondary,
                          opacity: 0.8
                        }}>
                          {formatDate(entry.createdAt)}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(entry);
                            }} 
                            title="Edit" 
                            style={{ 
                              color: THEME.primary,
                              background: `${THEME.primary}15`,
                              borderRadius: 8,
                              padding: "6px",
                              display: "grid",
                              placeItems: "center"
                            }}
                          >
                            <Edit3 size={16} />
                          </button>

                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(entry._id);
                            }} 
                            title="Delete" 
                            style={{ 
                              color: THEME.primary,
                              background: `${THEME.primary}15`,
                              borderRadius: 8,
                              padding: "6px",
                              display: "grid",
                              placeItems: "center"
                            }}
                          >
                            {isDeleting === entry._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;