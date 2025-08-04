import { motion } from "framer-motion";
import { BookOpen, Lock, Globe, Save, Check, Calendar, Filter, Star, Search, Plus } from "lucide-react";
import { useState } from "react";

const THEME = {
  primary: "#FF7E6B",
  secondary: "#2F4858",
  dark: "#2A2D34",
  light: "#F7F4EA",
  accent: "#FF9E90"
};

export default function JournalPage() {
  const [entry, setEntry] = useState("");
  const [mood, setMood] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [view, setView] = useState("write"); // 'write' or 'browse'
  const [searchQuery, setSearchQuery] = useState("");

  const moods = [
    { emoji: "😊", label: "Happy", color: "#F9C74F" },
    { emoji: "😐", label: "Neutral", color: "#90BE6D" },
    { emoji: "😔", label: "Sad", color: "#43AA8B" },
    { emoji: "😢", label: "Depressed", color: "#577590" },
    { emoji: "😠", label: "Angry", color: "#F94144" },
    { emoji: "😴", label: "Tired", color: "#277DA1" }
  ];

  // Sample journal entries
  const entries = [
    {
      id: 1,
      date: "Today",
      mood: "😊",
      text: "Had a breakthrough in my project today! Finally solved that tricky problem that's been bothering me for weeks.",
      isPrivate: false,
      tags: ["work", "achievement"],
      favorite: true
    },
    {
      id: 2,
      date: "Yesterday",
      mood: "😴",
      text: "Exhausted from working late. Need to remember to take breaks and not burn myself out.",
      isPrivate: true,
      tags: ["health", "reminder"],
      favorite: false
    },
    {
      id: 3,
      date: "Jul 28",
      mood: "😔",
      text: "Feeling lonely today. Maybe I should reach out to some friends this weekend.",
      isPrivate: false,
      tags: ["social", "reflection"],
      favorite: true
    }
  ];

  const filteredEntries = entries.filter(entry => 
    entry.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!entry.trim()) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      // In a real app, this would call your API
      setIsSubmitting(false);
      setEntry("");
      setMood("");
      setView("browse"); // Switch to browse view after submission
    }, 1500);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: THEME.dark, color: THEME.light }}>
      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Header with View Toggle */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6" style={{ color: THEME.primary }} />
            <h1 className="text-xl sm:text-2xl font-light">Mindful Journal</h1>
          </div>
          
          <div className="flex bg-gray-800 rounded-full p-1">
            <button
              onClick={() => setView("write")}
              className={`px-4 py-2 rounded-full text-sm transition-all ${view === "write" ? "bg-primary text-white" : "text-gray-400"}`}
              style={{ backgroundColor: view === "write" ? THEME.primary : "transparent" }}
            >
              Write
            </button>
            <button
              onClick={() => setView("browse")}
              className={`px-4 py-2 rounded-full text-sm transition-all ${view === "browse" ? "bg-primary text-white" : "text-gray-400"}`}
              style={{ backgroundColor: view === "browse" ? THEME.primary : "transparent" }}
            >
              Browse
            </button>
          </div>
        </motion.header>

        {/* Conditional Rendering Based on View */}
        {view === "write" ? (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mb-12"
          >
            {/* Date Display */}
            <div className="flex items-center gap-2 mb-6 text-sm text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            </div>

            {/* Mood Selector */}
            <div className="mb-8">
              <h3 className="text-sm font-medium mb-4" style={{ color: THEME.primary }}>
                How are you feeling today?
              </h3>
              <div className="flex flex-wrap gap-3">
                {moods.map((m) => (
                  <motion.button
                    key={m.emoji}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMood(m.emoji)}
                    className={`flex flex-col items-center p-3 rounded-xl transition-all ${mood === m.emoji ? "scale-105" : ""}`}
                    style={{
                      backgroundColor: mood === m.emoji ? `${m.color}30` : `${THEME.secondary}80`,
                      border: mood === m.emoji ? `2px solid ${m.color}` : `1px solid ${THEME.primary}20`
                    }}
                  >
                    <span className="text-3xl mb-1">{m.emoji}</span>
                    <span className="text-xs">{m.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Journal Entry Form */}
            <form onSubmit={handleSubmit}>
              <motion.div
                whileFocus={{ borderColor: THEME.primary }}
                className="relative mb-6 rounded-xl overflow-hidden"
                style={{
                  backgroundColor: `${THEME.secondary}80`,
                  border: `1px solid ${THEME.primary}20`
                }}
              >
                <textarea
                  value={entry}
                  onChange={(e) => setEntry(e.target.value)}
                  placeholder="Start writing your thoughts here... Let your mind flow freely."
                  className="w-full p-5 bg-transparent focus:outline-none resize-none min-h-[250px] text-sm sm:text-base"
                  style={{ color: THEME.light }}
                />
                <div 
                  className="absolute bottom-3 right-3 text-xs flex items-center gap-1"
                  style={{ color: `${THEME.light}70` }}
                >
                  <span>{entry.length}</span>
                  <span>/</span>
                  <span>1000</span>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-between">
                <div className="flex gap-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
                    style={{
                      backgroundColor: `${THEME.primary}10`,
                      color: THEME.primary
                    }}
                  >
                    <Lock className="w-4 h-4" />
                    Private
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
                    style={{
                      backgroundColor: `${THEME.primary}10`,
                      color: THEME.primary
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Tags
                  </motion.button>
                </div>

                <motion.button
                  type="submit"
                  disabled={!entry.trim() || isSubmitting}
                  whileHover={!entry.trim() ? {} : { scale: 1.03 }}
                  whileTap={!entry.trim() ? {} : { scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    backgroundColor: !entry.trim() ? `${THEME.primary}30` : THEME.primary,
                    color: THEME.light
                  }}
                >
                  {isSubmitting ? (
                    'Saving...'
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Save Entry
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.section>
        ) : (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Search and Filter */}
            <div className="mb-8">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: THEME.primary }} />
                <input
                  type="text"
                  placeholder="Search entries or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 focus:outline-none text-sm"
                  style={{ color: THEME.light }}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1 text-xs rounded-full bg-gray-800">All</button>
                <button className="px-3 py-1 text-xs rounded-full bg-gray-800">Favorites</button>
                <button className="px-3 py-1 text-xs rounded-full bg-gray-800">This Month</button>
                {moods.map(m => (
                  <button 
                    key={m.emoji}
                    className="px-3 py-1 text-xs rounded-full flex items-center gap-1"
                    style={{ backgroundColor: `${m.color}20`, color: m.color }}
                  >
                    {m.emoji} {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Journal Entries List */}
            {filteredEntries.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📖</div>
                <h3 className="text-lg mb-2" style={{ color: THEME.primary }}>No entries found</h3>
                <p className="text-sm opacity-70">Try adjusting your search or write a new entry</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEntries.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -2 }}
                    className="p-5 rounded-xl relative"
                    style={{
                      backgroundColor: `${THEME.secondary}80`,
                      borderLeft: `4px solid ${moods.find(m => m.emoji === item.mood)?.color || THEME.primary}`
                    }}
                  >
                    {item.favorite && (
                      <Star 
                        className="absolute top-4 right-4 w-4 h-4" 
                        style={{ color: moods.find(m => m.emoji === item.mood)?.color || THEME.primary }} 
                        fill={moods.find(m => m.emoji === item.mood)?.color || THEME.primary}
                      />
                    )}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.mood}</span>
                        <div>
                          <h3 className="text-sm font-medium">{item.date}</h3>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.tags.map(tag => (
                              <span 
                                key={tag}
                                className="text-xs px-2 py-0.5 rounded-full"
                                style={{ 
                                  backgroundColor: `${THEME.primary}10`,
                                  color: THEME.primary
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      {item.isPrivate ? (
                        <Lock className="w-4 h-4 opacity-50" />
                      ) : (
                        <Globe className="w-4 h-4 opacity-50" />
                      )}
                    </div>
                    <p className="text-sm sm:text-base">{item.text}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        )}
      </div>
    </div>
  );
}