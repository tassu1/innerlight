import React, { useState, useEffect } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { 
  Search, BookOpen, Heart, ChevronRight,
  RefreshCw, ChevronDown, ChevronUp, Zap
} from "lucide-react";
import { motion } from "framer-motion";

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

const topics = [
  { name: "self help", icon: "🧠" },
  { name: "motivation", icon: "💪" },
  { name: "mindfulness", icon: "🌿" },
  { name: "psychology", icon: "🔬" },
  { name: "success", icon: "🏆" },
  { name: "personal growth", icon: "🌱" },
  { name: "happiness", icon: "😊" }
];

export default function SelfHelp() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState("");
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    fetchBooks();
    // Load favorites from localStorage
    const savedFavorites = JSON.parse(localStorage.getItem('bookFavorites') || '[]');
    setFavorites(new Set(savedFavorites));
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      // Fetch all topics in parallel
      const results = await Promise.all(
        topics.map(t => axios.get(`https://gutendex.com/books/?search=${t.name}&page=1`))
      );

      const allResults = results.flatMap(res => res.data.results);
      const unique = Array.from(new Map(allResults.map(b => [b.id, b])).values());
      setBooks(unique);
    } catch (error) {
      console.error("Error fetching books", error);
    }
    setLoading(false);
  };

  const toggleFavorite = (bookId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(bookId)) {
      newFavorites.delete(bookId);
    } else {
      newFavorites.add(bookId);
    }
    setFavorites(newFavorites);
    localStorage.setItem('bookFavorites', JSON.stringify(Array.from(newFavorites)));
  };

  const filteredBooks = books.filter(b => {
    const matchesSearch =
      b.title.toLowerCase().includes(query.toLowerCase()) ||
      b.authors.some(a => a.name.toLowerCase().includes(query.toLowerCase()));

    const matchesTopic = activeTopic
      ? b.subjects.some(s => s.toLowerCase().includes(activeTopic.toLowerCase())) ||
        b.title.toLowerCase().includes(activeTopic.toLowerCase())
      : true;

    return matchesSearch && matchesTopic;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: THEME.dark }}>
      {/* Updated Header with darker gradient */}
      <motion.div 
        className="py-8 shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${THEME.secondary} 0%, ${THEME.dark} 100%)`,
          borderBottom: `1px solid ${THEME.border}`
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-center" style={{ color: THEME.textPrimary }}>
            Self-Help & Personal Growth
          </h1>
          <p className="text-center mt-2 max-w-2xl mx-auto" style={{ color: THEME.textSecondary }}>
            Discover books to inspire, motivate, and help you grow
          </p>

          {/* Search bar */}
          <div className="flex justify-center mt-6">
            <motion.div 
              className="flex items-center rounded-lg px-4 py-3 shadow-md w-full max-w-lg"
              style={{ 
                backgroundColor: THEME.glass,
                border: `1px solid ${THEME.border}`,
                backdropFilter: 'blur(10px)'
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Search className="mr-2 w-5 h-5" style={{ color: THEME.textSecondary }} />
              <input
                type="text"
                placeholder="Search books or authors..."
                className="flex-grow bg-transparent outline-none"
                style={{ 
                  color: THEME.textPrimary,
                  '::placeholder': { color: THEME.textSecondary }
                }}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </motion.div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center mt-4 gap-2 px-4">
            {topics.map((t) => (
              <motion.button
                key={t.name}
                onClick={() => setActiveTopic(t.name === activeTopic ? "" : t.name)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                  activeTopic === t.name
                    ? "bg-purple-600/80 text-white shadow"
                    : "bg-white/5 text-gray-200 hover:bg-white/10"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ 
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${THEME.border}`
                }}
              >
                <span className="text-lg">{t.icon}</span>
                <span>{t.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Books */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex items-center gap-2" style={{ color: THEME.accentPrimary }}>
              <BookOpen className="w-5 h-5 animate-pulse" />
              <span>Loading books...</span>
            </div>
          </div>
        ) : (
          <InfiniteScroll
            dataLength={filteredBooks.length}
            next={() => {}}
            hasMore={false}
            loader={
              <div className="flex justify-center py-4">
                <RefreshCw className="animate-spin w-5 h-5" style={{ color: THEME.primary }} />
              </div>
            }
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {filteredBooks.map((book) => (
                <motion.div
                  key={book.id}
                  className="relative rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl"
                  style={{
                    backgroundColor: THEME.cardBg,
                    border: `1px solid ${THEME.border}`,
                    boxShadow: `0 2px 10px ${THEME.primary}10`
                  }}
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute top-3 right-3 z-10">
                    <button 
                      onClick={() => toggleFavorite(book.id)}
                      className="p-2 rounded-full backdrop-blur-sm shadow"
                      style={{
                        backgroundColor: favorites.has(book.id) ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                        color: favorites.has(book.id) ? '#EF4444' : 'white'
                      }}
                    >
                      <Heart 
                        className="w-4 h-4" 
                        fill={favorites.has(book.id) ? '#EF4444' : 'transparent'}
                      />
                    </button>
                  </div>
                  
                  <div className="aspect-[3/4] relative">
                    <img
                      src={book.formats["image/jpeg"] || "https://via.placeholder.com/150"}
                      alt={book.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h2 className="text-white font-semibold text-sm sm:text-base line-clamp-2">
                        {book.title}
                      </h2>
                      <p className="text-gray-300 text-xs line-clamp-1">
                        {book.authors.map(a => a.name).join(", ") || "Unknown Author"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex flex-wrap gap-1 mt-1">
                      {book.subjects?.slice(0, 3).map((subject, i) => (
                        <span 
                          key={i} 
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ 
                            backgroundColor: `${THEME.primary}20`,
                            color: THEME.textPrimary
                          }}
                        >
                          {subject.split(' -- ')[0]}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs" style={{ color: THEME.textSecondary }}>
                        {book.download_count?.toLocaleString() || 0} downloads
                      </span>
                      <a 
                        href={`https://www.gutenberg.org/ebooks/${book.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium px-3 py-1.5 rounded flex items-center gap-1"
                        style={{ 
                          backgroundColor: THEME.primary,
                          color: THEME.accentPrimary
                        }}
                      >
                        Read <ChevronRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </InfiniteScroll>
        )}

        {!loading && filteredBooks.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-lg" style={{ color: THEME.textPrimary }}>No books found matching your criteria</p>
            <motion.button 
              onClick={() => {
                setQuery("");
                setActiveTopic("");
              }}
              className="mt-4 px-4 py-2 rounded-lg font-medium flex items-center gap-2 mx-auto"
              style={{ 
                background: `linear-gradient(135deg, ${THEME.accentPrimary} 0%, #E2E8F0 100%)`,
                color: THEME.secondary,
                boxShadow: `0 2px 10px ${THEME.primary}30`
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw className="w-4 h-4" />
              Reset filters
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}