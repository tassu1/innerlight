import React, { useState, useEffect } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { FaSearch, FaBookOpen, FaHeart, FaRegHeart } from "react-icons/fa";
import { motion } from "framer-motion";

const THEME = {
  primary: "#4A6FA5",       // Softer blue for accents (replaced coral)
  secondary: "#2B2B2B",     // Charcoal for backgrounds
  dark: "#1A1A1A",          // Darker charcoal for text
  light: "#F6F1E9",         // Soft cream for cards
  accentPrimary: "#6B8C9E", // Muted teal (replaced sunset orange)
  accentSecondary: "#9DB4C0"// Soft blue-gray (replaced gold)
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
    <div className="min-h-screen" style={{ backgroundColor: THEME.light }}>
      {/* Header - Updated with calming colors */}
      <motion.div 
        className="bg-gradient-to-r from-[#4A6FA5] to-[#6B8C9E] py-8 shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-white drop-shadow-lg">
            <span className="inline-block mr-2">📚</span> 
            Self-Help & Personal Growth
          </h1>
          <p className="text-center text-white/90 mt-2 max-w-2xl mx-auto">
            Discover books to inspire, motivate, and help you grow
          </p>

          {/* Search bar */}
          <div className="flex justify-center mt-6">
            <motion.div 
              className="flex items-center bg-white/90 backdrop-blur-md rounded-full px-4 py-2 shadow-md w-full max-w-lg"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <FaSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search books or authors..."
                className="flex-grow bg-transparent outline-none text-gray-700 placeholder-gray-400"
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
                className={`px-4 py-1 rounded-full text-sm font-medium transition flex items-center gap-1 ${
                  activeTopic === t.name
                    ? "bg-white text-[#4A6FA5] shadow"
                    : "bg-white/60 text-gray-700 hover:bg-white"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{t.icon}</span>
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
            <div className="animate-pulse flex items-center gap-2" style={{ color: THEME.primary }}>
              <FaBookOpen className="w-5 h-5 animate-pulse" />
              <span>Loading books...</span>
            </div>
          </div>
        ) : (
          <InfiniteScroll
            dataLength={filteredBooks.length}
            next={() => {}}
            hasMore={false}
            loader={<p className="text-center">Loading more...</p>}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {filteredBooks.map((book) => (
                <motion.div
                  key={book.id}
                  className="relative bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute top-2 right-2 z-10">
                    <button 
                      onClick={() => toggleFavorite(book.id)}
                      className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow"
                    >
                      {favorites.has(book.id) ? (
                        <FaHeart className="text-red-500" />
                      ) : (
                        <FaRegHeart className="text-gray-400 hover:text-red-500" />
                      )}
                    </button>
                  </div>
                  
                  <div className="aspect-[3/4] relative">
                    <img
                      src={book.formats["image/jpeg"] || "https://via.placeholder.com/150"}
                      alt={book.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <h2 className="text-white font-semibold text-sm sm:text-base line-clamp-2">
                        {book.title}
                      </h2>
                      <p className="text-gray-200 text-xs line-clamp-1">
                        {book.authors.map(a => a.name).join(", ") || "Unknown Author"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <div className="flex flex-wrap gap-1 mt-1">
                      {book.subjects?.slice(0, 3).map((subject, i) => (
                        <span 
                          key={i} 
                          className="text-xs px-1.5 py-0.5 rounded-full"
                          style={{ 
                            backgroundColor: `${THEME.primary}10`,
                            color: THEME.dark
                          }}
                        >
                          {subject.split(' -- ')[0]}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs" style={{ color: THEME.secondary }}>
                        {book.download_count?.toLocaleString() || 0} downloads
                      </span>
                      <a 
                        href={`https://www.gutenberg.org/ebooks/${book.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium px-2 py-1 rounded"
                        style={{ 
                          backgroundColor: THEME.primary,
                          color: 'white'
                        }}
                      >
                        Read
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
            <p className="text-lg" style={{ color: THEME.secondary }}>No books found matching your criteria</p>
            <button 
              onClick={() => {
                setQuery("");
                setActiveTopic("");
              }}
              className="mt-4 px-4 py-2 rounded-lg font-medium"
              style={{ 
                backgroundColor: THEME.primary,
                color: 'white'
              }}
            >
              Reset filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}