import React, { useEffect, useState } from "react";
import { 
  Smile, Frown, Meh, Laugh, Heart, 
  BarChart2, BookOpen, MessageSquare,
  RefreshCw, Sparkles, ChevronRight, Activity,
  Calendar, TrendingUp, TrendingDown, Zap, Bot
} from "lucide-react";
import MoodChart from "../components/MoodChart";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

const moodColors = {
  1: "#EF4444", // Red
  2: "#F59E0B", // Amber
  3: "#3B82F6", // Blue
  4: "#10B981", // Emerald
  5: "#8B5CF6"  // Violet
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    quote: "Be kind to yourself — every day is a fresh start.",
    moodLevel: "",
    note: "",
    alreadyLogged: false,
    activeChats: [],
    aiTip: "Take 10 minutes to breathe deeply today 💗",
    stats: {
      moodTrend: 'up',
      journalStreak: 0,
      weeklyAvgMood: 0,
      moodDistribution: [20, 30, 50, 40, 10],
      weeklyComparison: 12,
      aiSessions: 0
    },
    userName: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMoodForm, setShowMoodForm] = useState(false);
  const navigate = useNavigate();

  const chatStarters = [
    "I'm feeling anxious today",
    "How can I improve my sleep?",
    "I need motivation to work",
    "Suggest a quick mindfulness exercise"
  ];

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.data;
    } catch (err) {
      console.error("Error fetching user data:", err);
      return { name: "" }; // Return empty name instead of "Friend"
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const userData = await fetchUserData();
      
      try {
        const [quoteRes, chatsRes, statsRes, todayMoodRes] = await Promise.all([
          axios.get("http://localhost:5000/api/quotes/random"),
          axios.get("http://localhost:5000/api/chatbot/history", { 
            headers: { Authorization: `Bearer ${token}` } 
          }).catch(() => ({ data: [] })),
          axios.get("http://localhost:5000/api/stats", { 
            headers: { Authorization: `Bearer ${token}` } 
          }).catch(() => ({ data: {} })),
          axios.get("http://localhost:5000/api/moods/today", { 
            headers: { Authorization: `Bearer ${token}` } 
          }).catch(() => ({ data: {} }))
        ]);

        setDashboardData({
          userName: userData.name || "", // Use empty string if name not available
          quote: `${quoteRes.data.q} — ${quoteRes.data.a}`,
          activeChats: chatsRes.data.slice(0, 2),
          stats: {
            ...dashboardData.stats,
            ...statsRes.data
          },
          alreadyLogged: todayMoodRes.data?.logged || false,
          moodLevel: todayMoodRes.data?.mood?.toString() || "",
          aiTip: dashboardData.aiTip
        });

      } catch (err) {
        console.error("Partial dashboard data error:", err);
        setDashboardData(prev => ({
          ...prev,
          userName: userData.name || ""
        }));
      }

    } catch (err) {
      console.error("Dashboard initialization error:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleMoodSubmit = async (e) => {
    e.preventDefault();
    if (!dashboardData.moodLevel) return setError("Please select your mood.");
    
    try {
      await axios.post(
        "http://localhost:5000/api/moods",
        { moodLevel: dashboardData.moodLevel, note: dashboardData.note },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      
      setDashboardData(prev => ({
        ...prev,
        alreadyLogged: true,
        note: "",
        moodLevel: ""
      }));
      setShowMoodForm(false);
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to log mood.");
    }
  };

  const moodIcons = {
    1: <Frown className="w-6 h-6" style={{ color: moodColors[1] }} />,
    2: <Meh className="w-6 h-6" style={{ color: moodColors[2] }} />,
    3: <Smile className="w-6 h-6" style={{ color: moodColors[3] }} />,
    4: <Laugh className="w-6 h-6" style={{ color: moodColors[4] }} />,
    5: <Heart className="w-6 h-6" style={{ color: moodColors[5] }} />
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: THEME.secondary }}>
        <div className="animate-pulse flex items-center gap-2" style={{ color: THEME.accentPrimary }}>
          <Zap className="w-5 h-5 animate-pulse" />
          <span>Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: THEME.dark }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <motion.div 
          className="rounded-2xl p-6 mb-8 overflow-hidden relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Glass background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-indigo-900/20 backdrop-blur-md border border-purple-500/20 rounded-2xl" />
          
          {/* Content */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                Welcome{dashboardData.userName ? ` ${dashboardData.userName}` : ''} 👋
              </h1>
              <p className="text-white/80 italic max-w-2xl">
                {dashboardData.quote}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 rounded-full text-xs flex items-center gap-1 backdrop-blur-sm"
                style={{ 
                  backgroundColor: dashboardData.stats.moodTrend === 'up' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: dashboardData.stats.moodTrend === 'up' ? '#10B981' : '#EF4444'
                }}
              >
                {dashboardData.stats.moodTrend === 'up' ? (
                  <>
                    <TrendingUp className="w-3 h-3" />
                    <span>Mood improving</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-3 h-3" />
                    <span>Mood declining</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {/* Mood Stats Card */}
          <motion.div 
            className="rounded-xl p-4"
            style={{ 
              backgroundColor: THEME.cardBg,
              border: `1px solid ${THEME.border}`,
              boxShadow: `0 2px 10px ${THEME.primary}10`
            }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: THEME.textSecondary }}>Weekly Avg</span>
              <BarChart2 className="w-4 h-4" style={{ color: THEME.accentPrimary }} />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold" style={{ color: THEME.textPrimary }}>
                {dashboardData.stats.weeklyAvgMood.toFixed(1)}
              </span>
              <span className="text-xs mb-1" style={{ color: THEME.textSecondary }}>/5</span>
            </div>
            <div className="h-2 mt-2 rounded-full overflow-hidden" style={{ backgroundColor: `${THEME.secondary}80` }}>
              <div 
                className="h-full rounded-full" 
                style={{ 
                  width: `${(dashboardData.stats.weeklyAvgMood / 5) * 100}%`,
                  background: `linear-gradient(90deg, ${THEME.primary}, ${THEME.accentPrimary})`
                }}
              />
            </div>
          </motion.div>

          {/* Journal Streak Card */}
          <motion.div 
            className="rounded-xl p-4"
            style={{ 
              backgroundColor: THEME.cardBg,
              border: `1px solid ${THEME.border}`,
              boxShadow: `0 2px 10px ${THEME.primary}10`
            }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: THEME.textSecondary }}>Journal Streak</span>
              <BookOpen className="w-4 h-4" style={{ color: THEME.accentPrimary }} />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold" style={{ color: THEME.textPrimary }}>
                {dashboardData.stats.journalStreak}
              </span>
              <span className="text-xs mb-1" style={{ color: THEME.textSecondary }}>days</span>
            </div>
            <div className="flex gap-1 mt-2">
              {[...Array(7)].map((_, i) => (
                <div 
                  key={i} 
                  className="h-1 flex-1 rounded-full"
                  style={{ 
                    backgroundColor: i < dashboardData.stats.journalStreak ? THEME.primary : `${THEME.secondary}80`
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Weekly Comparison Card */}
          <motion.div 
            className="rounded-xl p-4"
            style={{ 
              backgroundColor: THEME.cardBg,
              border: `1px solid ${THEME.border}`,
              boxShadow: `0 2px 10px ${THEME.primary}10`
            }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: THEME.textSecondary }}>Weekly Change</span>
              {dashboardData.stats.weeklyComparison >= 0 ? (
                <TrendingUp className="w-4 h-4" style={{ color: THEME.accentSecondary }} />
              ) : (
                <TrendingDown className="w-4 h-4" style={{ color: '#EF4444' }} />
              )}
            </div>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-bold" style={{ 
                color: dashboardData.stats.weeklyComparison >= 0 ? THEME.accentSecondary : '#EF4444'
              }}>
                {dashboardData.stats.weeklyComparison >= 0 ? '+' : ''}{dashboardData.stats.weeklyComparison}%
              </span>
            </div>
            <div className="mt-2">
              <div className="text-xs" style={{ color: THEME.textSecondary }}>
                vs last week
              </div>
            </div>
          </motion.div>

          {/* AI Sessions Card */}
          <motion.div 
            className="rounded-xl p-4"
            style={{ 
              backgroundColor: THEME.cardBg,
              border: `1px solid ${THEME.border}`,
              boxShadow: `0 2px 10px ${THEME.primary}10`
            }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: THEME.textSecondary }}>AI Sessions</span>
              <MessageSquare className="w-4 h-4" style={{ color: THEME.accentPrimary }} />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold" style={{ color: THEME.textPrimary }}>
                {dashboardData.stats.aiSessions}
              </span>
              <span className="text-xs mb-1" style={{ color: THEME.textSecondary }}>this month</span>
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Mood Tracker Card */}
            <motion.div 
              className="rounded-xl p-6"
              style={{ 
                backgroundColor: THEME.cardBg,
                border: `1px solid ${THEME.border}`,
                boxShadow: `0 2px 10px ${THEME.primary}10`
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: THEME.textPrimary }}>
                  <Smile className="w-5 h-5" style={{ color: THEME.accentPrimary }} />
                  Daily Mood Check
                </h2>
                <button 
                  onClick={fetchDashboardData}
                  className="text-xs flex items-center gap-1"
                  style={{ color: THEME.textSecondary }}
                >
                  <RefreshCw className="w-3 h-3" />
                  Refresh
                </button>
              </div>
              
              {dashboardData.alreadyLogged ? (
                <div className="text-center py-4">
                  <div 
                    className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center"
                    style={{ 
                      background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.accentPrimary} 100%)`,
                      boxShadow: `0 4px 10px ${THEME.primary}30`
                    }}
                  >
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <p className="mb-2" style={{ color: THEME.accentPrimary }}>You've logged your mood today!</p>
                  <button 
                    onClick={() => setDashboardData(prev => ({ ...prev, alreadyLogged: false }))}
                    className="text-xs hover:underline"
                    style={{ color: THEME.accentPrimary }}
                  >
                    Want to update?
                  </button>
                </div>
              ) : (
                <>
                  {!showMoodForm ? (
                    <motion.button
                      onClick={() => setShowMoodForm(true)}
                      className="w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                      style={{ 
                       background: `linear-gradient(135deg, ${THEME.accentPrimary} 0%, #E2E8F0 100%)`,
                        color: THEME.secondary,
                        boxShadow: `0 2px 10px ${THEME.primary}30`
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Smile className="w-5 h-5" />
                      Log Your Mood
                    </motion.button>
                  ) : (
                    <form onSubmit={handleMoodSubmit}>
                      <div className="flex justify-between mb-4">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <motion.button
                            key={level}
                            type="button"
                            className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                            style={{
                              backgroundColor: dashboardData.moodLevel === level.toString() ? `${moodColors[level]}20` : 'transparent',
                              color: dashboardData.moodLevel === level.toString() ? moodColors[level] : THEME.textPrimary,
                              transform: dashboardData.moodLevel === level.toString() ? 'scale(1.1)' : 'scale(1)',
                              opacity: dashboardData.moodLevel === level.toString() ? 1 : 0.7
                            }}
                            onClick={() => setDashboardData(prev => ({ ...prev, moodLevel: level.toString() }))}
                            whileHover={{ scale: 1.1 }}
                          >
                            {moodIcons[level]}
                          </motion.button>
                        ))}
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" style={{ color: THEME.textPrimary }}>
                          Add a note (optional)
                        </label>
                        <textarea
                          value={dashboardData.note}
                          onChange={(e) => setDashboardData(prev => ({ ...prev, note: e.target.value }))}
                          className="w-full p-3 rounded-lg focus:ring-2 text-sm"
                          rows="2"
                          placeholder="What's influencing your mood today?"
                          style={{ 
                            backgroundColor: `${THEME.secondary}80`,
                            border: `1px solid ${THEME.border}`,
                            color: THEME.textPrimary
                          }}
                        />
                      </div>
                      {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
                      <div className="flex gap-2">
                        <motion.button
                          type="submit"
                          className="flex-1 py-2 px-4 rounded-lg font-medium"
                          style={{ 
                            background: `linear-gradient(135deg, ${THEME.accentPrimary} 0%, #E2E8F0 100%)`,
                            color: THEME.secondary,
                            boxShadow: `0 2px 10px ${THEME.primary}30`
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Submit
                        </motion.button>
                        <motion.button
                          type="button"
                          onClick={() => setShowMoodForm(false)}
                          className="py-2 px-4 rounded-lg font-medium"
                          style={{ 
                            border: `1px solid ${THEME.border}`,
                            color: THEME.textPrimary,
                            backgroundColor: `${THEME.secondary}80`
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </motion.div>

            {/* Mood Distribution Card */}
            <motion.div 
              className="rounded-xl p-6"
              style={{ 
                backgroundColor: THEME.cardBg,
                border: `1px solid ${THEME.border}`,
                boxShadow: `0 2px 10px ${THEME.primary}10`
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: THEME.textPrimary }}>
                <Activity className="w-5 h-5" style={{ color: THEME.accentPrimary }} />
                Mood Distribution
              </h2>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((level) => (
                  <div key={level} className="flex items-center gap-3">
                    <div className="w-6 h-6 flex items-center justify-center" style={{ color: moodColors[level] }}>
                      {moodIcons[level]}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1" style={{ color: THEME.textPrimary }}>
                        <span>Level {level}</span>
                        <span>{dashboardData.stats.moodDistribution[level-1] || 0}%</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${THEME.secondary}80` }}>
                        <div 
                          className="h-full rounded-full" 
                          style={{ 
                            width: `${dashboardData.stats.moodDistribution[level-1] || 0}%`,
                            backgroundColor: moodColors[level]
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Middle Column - Mood Chart */}
          <motion.div 
            className="rounded-xl p-6 lg:col-span-2"
            style={{ 
              backgroundColor: THEME.cardBg,
              border: `1px solid ${THEME.border}`,
              boxShadow: `0 2px 10px ${THEME.primary}10`
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: THEME.textPrimary }}>
                <Calendar className="w-5 h-5" style={{ color: THEME.accentPrimary }} />
                Mood Over Time
              </h2>
              <div className="flex items-center gap-2">
                <div className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                  style={{ 
                    backgroundColor: dashboardData.stats.weeklyComparison >= 0 ? `${THEME.accentSecondary}20` : '#FECDD320',
                    color: dashboardData.stats.weeklyComparison >= 0 ? THEME.textPrimary : '#F43F5E'
                  }}
                >
                  {dashboardData.stats.weeklyComparison >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{Math.abs(dashboardData.stats.weeklyComparison)}% from last week</span>
                </div>
              </div>
            </div>
            <div className="h-64 sm:h-80">
              <MoodChart 
                key={Date.now()} 
                theme={THEME} 
                data={dashboardData.stats.moodChartData || []}
              />
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Tips Card */}
          <motion.div 
            className="rounded-xl p-6"
            style={{ 
              backgroundColor: THEME.cardBg,
              border: `1px solid ${THEME.border}`,
              boxShadow: `0 2px 10px ${THEME.primary}10`
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: THEME.textPrimary }}>
                <Sparkles className="w-5 h-5" style={{ color: THEME.accentPrimary }} />
                Daily Wellness Tip
              </h2>
              <button 
                onClick={fetchDashboardData}
                className="text-xs flex items-center gap-1"
                style={{ color: THEME.textSecondary }}
              >
                <RefreshCw className="w-3 h-3" />
                New Tip
              </button>
            </div>
            <div className="p-4 rounded-lg"
              style={{ 
                backgroundColor: `${THEME.primary}10`,
                borderLeft: `3px solid ${THEME.primary}`
              }}
            >
              <p className="italic text-sm" style={{ color: THEME.textPrimary }}>{dashboardData.aiTip}</p>
              <div className="text-xs mt-2 flex items-center gap-1" style={{ color: THEME.textSecondary }}>
                <span>From InnerLight AI</span>
              </div>
            </div>
          </motion.div>

          {/* Active Chats Card */}
          <motion.div 
            className="rounded-xl p-6"
            style={{ 
              backgroundColor: THEME.cardBg,
              border: `1px solid ${THEME.border}`,
              boxShadow: `0 2px 10px ${THEME.primary}10`
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: THEME.textPrimary }}>
                <MessageSquare className="w-5 h-5" style={{ color: THEME.accentPrimary }} />
                Your Conversations
              </h2>
              <button 
                onClick={() => navigate("/chatbot")}
                className="text-xs flex items-center gap-1"
                style={{ color: THEME.textSecondary }}
              >
                View All <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            {dashboardData.activeChats.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.activeChats.map((chat, index) => (
                  <motion.div 
                    key={index}
                    className="p-4 rounded-lg hover:bg-primary/5 cursor-pointer transition-colors"
                    style={{ backgroundColor: `${THEME.primary}05` }}
                    whileHover={{ x: 5 }}
                    onClick={() => navigate(`/chat/${chat._id}`)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" 
                        style={{ 
                          backgroundColor: chat.isAI ? `${THEME.primary}20` : `${THEME.secondary}20`
                        }}
                      >
                        {chat.isAI ? (
                          <Bot className="w-5 h-5" style={{ color: THEME.primary }} />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke={THEME.secondary}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        )}
                      </div>
                      <span className="font-medium text-sm" style={{ color: THEME.textPrimary }}>
                        {chat.isAI ? "InnerLight AI" : chat.participants?.find(p => p._id !== localStorage.getItem("userId"))?.name || "Chat"}
                      </span>
                      <span className="text-xs" style={{ color: THEME.textSecondary }}>
                        {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm line-clamp-2" style={{ color: THEME.textPrimary }}>
                      {chat.lastMessage?.content || "No messages yet"}
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p style={{ color: THEME.textSecondary }}>No active conversations</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {chatStarters.map((prompt, i) => (
                    <motion.div 
                      key={i}
                      className="p-3 rounded-lg cursor-pointer"
                      style={{ backgroundColor: `${THEME.secondary}10` }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => navigate('/chatbot', { state: { initialMessage: prompt } })}
                    >
                      <p className="text-xs" style={{ color: THEME.textPrimary }}>{prompt}</p>
                    </motion.div>
                  ))}
                </div>
                <motion.button 
                  onClick={() => navigate("/chatbot")}
                  className="mt-4 w-full py-2 rounded-lg font-medium flex items-center justify-center gap-2"
                  style={{ 
                    background: `linear-gradient(135deg, ${THEME.accentPrimary} 0%, #E2E8F0 100%)`,
                    color: THEME.secondary,
                    boxShadow: `0 2px 10px ${THEME.primary}30`
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat with InnerLight AI
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;