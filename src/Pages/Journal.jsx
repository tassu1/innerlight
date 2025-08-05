import { useEffect, useState, useRef } from "react";
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
  Lock,
  Share2,
  ChevronDown,
  ChevronUp,
  Filter,
  Search
} from "lucide-react";

const THEME = {
  primary: "#FF7E6B",
  secondary: "#2F4858",
  dark: "#1E2127",
  light: "#F8F9FA",
  accent: "#FF9E90",
  muted: "#94a3b8"
};

const Journal = () => {
  const [prompt, setPrompt] = useState("");
  const [entryText, setEntryText] = useState("");
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedEntry, setExpandedEntry] = useState(null);
  const [privacyFilter, setPrivacyFilter] = useState("all");
  const navigate = useNavigate();
  const textareaRef = useRef(null);

  // Axios instance with auth header
  const api = axios.create({
    baseURL: "http://localhost:5000",
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Add request interceptor for auth token
  api.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, error => {
    return Promise.reject(error);
  });

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/api/journals");
      setEntries(response.data);
      setFilteredEntries(response.data);
      setError("");
    } catch (err) {
      console.error("Failed to fetch journal entries", err);
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiError = (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          setError("Session expired. Please login again.");
          setTimeout(() => navigate("/login"), 1500);
          break;
        case 404:
          setError("Resource not found");
          break;
        case 500:
          setError("Server error. Please try again later.");
          break;
        default:
          setError(error.response.data?.message || "An error occurred");
      }
    } else if (error.request) {
      setError("Network error. Please check your connection.");
    } else {
      setError("An unexpected error occurred");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!entryText.trim()) {
      setError("Journal entry cannot be empty");
      setIsSubmitting(false);
      return;
    }

    try {
      if (editingId) {
        await api.put(`/api/journals/${editingId}`, { prompt, entryText });
        setEditingId(null);
      } else {
        await api.post("/api/journals/add", { prompt, entryText });
      }
      
      setEntryText("");
      setPrompt("");
      await fetchEntries();
    } catch (err) {
      console.error("Failed to submit entry", err);
      handleApiError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      setIsDeleting(id);
      try {
        await api.delete(`/api/journals/${id}`);
        await fetchEntries();
      } catch (err) {
        console.error("Failed to delete entry", err);
        handleApiError(err);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleEdit = (entry) => {
    setPrompt(entry.prompt || "");
    setEntryText(entry.entryText);
    setEditingId(entry._id);
    setTimeout(() => {
      textareaRef.current?.focus();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setPrompt("");
    setEntryText("");
  };

  const toggleExpandEntry = (id) => {
    setExpandedEntry(expandedEntry === id ? null : id);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query === "") {
      setFilteredEntries(entries);
      return;
    }

    const results = entries.filter(entry => 
      entry.entryText.toLowerCase().includes(query) || 
      (entry.prompt && entry.prompt.toLowerCase().includes(query))
    );
    setFilteredEntries(results);
  };

  const applyPrivacyFilter = (filter) => {
    setPrivacyFilter(filter);
    if (filter === "all") {
      setFilteredEntries(entries);
    } else {
      // In a real app, you would filter based on actual privacy status
      // This is just a placeholder for the functionality
      setFilteredEntries(entries.slice(0, 3)); // Demo only
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: THEME.dark }}>
      <div className="max-w-4xl mx-auto">
        {/* Journal Card */}
        <div 
          className="rounded-xl p-6 mb-8 border" 
          style={{ 
            backgroundColor: THEME.secondary,
            borderColor: `${THEME.primary}20`
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg" style={{ backgroundColor: THEME.primary }}>
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-semibold" style={{ color: THEME.light }}>
              {editingId ? "Edit Entry" : "New Journal Entry"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Prompt Input */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-sm font-medium" style={{ color: THEME.primary }}>
                <Sparkles className="w-4 h-4" />
                Guided Prompt (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. What made me smile today? What am I grateful for?"
                className="w-full px-4 py-3 rounded-lg focus:outline-none"
                style={{
                  backgroundColor: `${THEME.dark}80`,
                  border: `1px solid ${THEME.primary}30`,
                  color: THEME.light
                }}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            {/* Journal Text Area */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-sm font-medium" style={{ color: THEME.primary }}>
                <PenLine className="w-4 h-4" />
                Your Thoughts
              </label>
              <textarea
                ref={textareaRef}
                className="w-full px-4 py-3 rounded-lg focus:outline-none"
                style={{
                  backgroundColor: `${THEME.dark}80`,
                  border: `1px solid ${THEME.primary}30`,
                  color: THEME.light,
                  minHeight: '200px'
                }}
                placeholder="Write freely here... this is your safe space"
                value={entryText}
                onChange={(e) => setEntryText(e.target.value)}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "rgba(255, 107, 107, 0.1)" }}>
                <div className="p-1 rounded-full" style={{ backgroundColor: "rgba(255, 107, 107, 0.2)" }}>
                  <X className="w-4 h-4" style={{ color: "#FF6B6B" }} />
                </div>
                <p className="text-sm" style={{ color: "#FF6B6B" }}>{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
                  style={{
                    backgroundColor: `${THEME.primary}10`,
                    color: THEME.primary
                  }}
                >
                  <Lock className="w-4 h-4" />
                  Private
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
                  style={{
                    backgroundColor: `${THEME.primary}10`,
                    color: THEME.primary
                  }}
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
              
              <div className="flex gap-3 flex-1">
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex-1 px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: `${THEME.dark}80`,
                      border: `1px solid ${THEME.primary}30`,
                      color: THEME.light
                    }}
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting || !entryText.trim()}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
                    !entryText.trim() ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
                  }`}
                  style={{
                    backgroundColor: THEME.primary,
                    color: THEME.light
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {editingId ? "Updating..." : "Saving..."}
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      {editingId ? "Update" : "Save"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Past Entries */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: THEME.primary }}>
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-xl font-semibold" style={{ color: THEME.light }}>
                Your Entries
              </h4>
              <span 
                className="text-sm px-2 py-1 rounded-full" 
                style={{ 
                  backgroundColor: `${THEME.primary}20`, 
                  color: THEME.primary 
                }}
              >
                {filteredEntries.length} {filteredEntries.length === 1 ? "entry" : "entries"}
              </span>
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-48">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: THEME.muted }} />
                <input
                  type="text"
                  placeholder="Search entries..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg text-sm"
                  style={{
                    backgroundColor: `${THEME.dark}80`,
                    border: `1px solid ${THEME.primary}30`,
                    color: THEME.light
                  }}
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              
              <div className="relative">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer"
                  style={{
                    backgroundColor: `${THEME.dark}80`,
                    border: `1px solid ${THEME.primary}30`,
                    color: THEME.light
                  }}
                >
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </div>
                <div className="absolute right-0 mt-1 w-48 rounded-lg shadow-lg z-10 hidden"
                  style={{ 
                    backgroundColor: THEME.secondary,
                    border: `1px solid ${THEME.primary}30`
                  }}
                >
                  <div className="py-1">
                    <div 
                      className={`px-4 py-2 text-sm cursor-pointer ${privacyFilter === 'all' ? 'font-medium' : ''}`}
                      style={{ color: privacyFilter === 'all' ? THEME.primary : THEME.light }}
                      onClick={() => applyPrivacyFilter('all')}
                    >
                      All Entries
                    </div>
                    <div 
                      className={`px-4 py-2 text-sm cursor-pointer ${privacyFilter === 'private' ? 'font-medium' : ''}`}
                      style={{ color: privacyFilter === 'private' ? THEME.primary : THEME.light }}
                      onClick={() => applyPrivacyFilter('private')}
                    >
                      Private Only
                    </div>
                    <div 
                      className={`px-4 py-2 text-sm cursor-pointer ${privacyFilter === 'shared' ? 'font-medium' : ''}`}
                      style={{ color: privacyFilter === 'shared' ? THEME.primary : THEME.light }}
                      onClick={() => applyPrivacyFilter('shared')}
                    >
                      Shared Only
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center gap-3 py-12 rounded-xl"
              style={{ backgroundColor: `${THEME.secondary}80` }}
            >
              <Loader2 className="w-5 h-5 animate-spin" style={{ color: THEME.primary }} />
              <span style={{ color: THEME.light }}>Loading your entries...</span>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-12 rounded-xl"
              style={{ 
                backgroundColor: `${THEME.secondary}80`,
                border: `1.5px dashed ${THEME.primary}30`
              }}
            >
              <div className="mx-auto w-14 h-14 mb-4 flex items-center justify-center rounded-full" 
                style={{ backgroundColor: THEME.primary }}>
                <PenLine className="w-5 h-5 text-white" />
              </div>
              <p className="text-lg mb-1 font-medium" style={{ color: THEME.primary }}>
                {searchQuery ? "No matching entries" : "No entries yet"}
              </p>
              <p className="text-sm" style={{ color: THEME.light }}>
                {searchQuery ? "Try a different search term" : "Start writing your first entry"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEntries.map((entry) => (
                <div 
                  key={entry._id}
                  className="rounded-xl p-5"
                  style={{
                    backgroundColor: THEME.secondary,
                    borderLeft: `3px solid ${THEME.primary}`,
                    color: THEME.light
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 opacity-70" />
                      <span className="text-xs opacity-80">
                        {new Date(entry.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(entry)}
                        className="p-1.5 rounded-lg hover:bg-opacity-10 hover:bg-white transition-colors"
                        style={{ color: THEME.primary }}
                        title="Edit entry"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(entry._id)}
                        className="p-1.5 rounded-lg hover:bg-opacity-10 hover:bg-white transition-colors"
                        style={{ color: isDeleting === entry._id ? "#FF6B6B" : THEME.primary }}
                        title="Delete entry"
                        disabled={isDeleting === entry._id}
                      >
                        {isDeleting === entry._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => toggleExpandEntry(entry._id)}
                        className="p-1.5 rounded-lg hover:bg-opacity-10 hover:bg-white transition-colors"
                        style={{ color: THEME.primary }}
                        title={expandedEntry === entry._id ? "Collapse" : "Expand"}
                      >
                        {expandedEntry === entry._id ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {entry.prompt && (
                    <p className="text-sm mb-3 px-3 py-2 rounded-lg"
                      style={{ 
                        color: THEME.primary,
                        backgroundColor: `${THEME.primary}10`
                      }}
                    >
                      <span className="font-medium">Prompt:</span> {entry.prompt}
                    </p>
                  )}

                  <p className={`whitespace-pre-line ${expandedEntry === entry._id ? '' : 'line-clamp-3'}`}>
                    {entry.entryText}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Journal;