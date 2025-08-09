import React, { useEffect, useState } from "react";
import { 
  Smile, Frown, Meh, Laugh, Heart, 
  BarChart2, BookOpen, Users, MessageSquare,
  RefreshCw, Sparkles, ChevronRight, Activity,
  Calendar, TrendingUp, TrendingDown, ChevronDown,
  ChevronUp, Zap, Bot, Menu, Search, Bell
} from "lucide-react";
import MoodChart from "../components/MoodChart";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const THEME = {
  primary: "#E76F51",       // Vibrant coral for accents
  secondary: "#2B2B2B",     // Charcoal for backgrounds
  dark: "#1A1A1A",          // Darker charcoal for text
  light: "#F6F1E9",         // Soft cream for cards
  accentPrimary: "#F4A261", // Sunset orange
  accentSecondary: "#E9C46A"// Muted gold
};

const moodColors = {
  1: "#F87171",
  2: "#FBBF24",
  3: "#60A5FA",
  4: "#34D399",
  5: "#A78BFA"
};

const Dashboard = () => {
  // State initialization (keep your original state structure)
  const [dashboardData, setDashboardData] = useState({
    quote: "Be kind to yourself — every day is a fresh start.",
    moodLevel: "",
    note: "",
    alreadyLogged: false,
    communityPosts: [],
    activeChats: [],
    aiTip: "Take 10 minutes to breathe deeply today 💗",
    stats: {
      moodTrend: 'up',
      journalStreak: 0,
      communityEngagement: 0,
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

  // Chat starters (keep your original array)
  const chatStarters = [
    "I'm feeling anxious today",
    "How can I improve my sleep?",
    "I need motivation to work",
    "Suggest a quick mindfulness exercise"
  ];

  // fetchUserData - unchanged from your original
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (err) {
      console.error("Error fetching user data:", err);
      return { name: "Friend" };
    }
  };

  // fetchDashboardData - unchanged from your original
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const userData = await fetchUserData();
      
      try {
        const [quoteRes, postsRes, chatsRes, statsRes, todayMoodRes] = await Promise.all([
          axios.get("http://localhost:5000/api/quotes/random"),
          axios.get("http://localhost:5000/api/forum/latest", { 
            headers: { Authorization: `Bearer ${token}` } 
          }).catch(() => ({ data: [] })),
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
          userName: userData.name || "Friend",
          quote: `${quoteRes.data.q} — ${quoteRes.data.a}`,
          communityPosts: postsRes.data.slice(0, 3),
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
          userName: userData.name || "Friend"
        }));
      }

    } catch (err) {
      console.error("Dashboard initialization error:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // useEffect for initial data fetch - unchanged
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // handleMoodSubmit - unchanged from your original
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

  // moodIcons with proper color classes
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
        <div className="animate-pulse flex items-center gap-2" style={{ color: THEME.primary }}>
          <Zap className="w-5 h-5 animate-pulse" />
          <span>Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: THEME.light }}>
      {/* Charcoal Top Bar */}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <motion.div 
          className="rounded-2xl p-6 mb-8"
          style={{ 
            background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.dark} 100%)`,
            boxShadow: `0 4px 20px rgba(0,0,0,0.1)`
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                Welcome back, {dashboardData.userName} 👋
              </h1>
              <p className="text-white/90 italic">
                {dashboardData.quote}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 rounded-full text-xs flex items-center gap-1"
                style={{ 
                  backgroundColor: dashboardData.stats.moodTrend === 'up' ? `${THEME.accentSecondary}20` : '#FECDD320',
                  color: dashboardData.stats.moodTrend === 'up' ? THEME.accentSecondary : '#F43F5E'
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Mood Stats Card */}
          <motion.div 
            className="rounded-xl p-4"
            style={{ 
              backgroundColor: THEME.light,
              boxShadow: `0 2px 10px rgba(0,0,0,0.05)`
            }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: THEME.secondary }}>Weekly Avg</span>
              <BarChart2 className="w-4 h-4" style={{ color: THEME.primary }} />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold" style={{ color: THEME.dark }}>
                {dashboardData.stats.weeklyAvgMood.toFixed(1)}
              </span>
              <span className="text-xs mb-1" style={{ color: THEME.secondary }}>/5</span>
            </div>
            <div className="h-2 mt-2 rounded-full overflow-hidden bg-white">
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
              backgroundColor: THEME.light,
              boxShadow: `0 2px 10px rgba(0,0,0,0.05)`
            }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: THEME.secondary }}>Journal Streak</span>
              <BookOpen className="w-4 h-4" style={{ color: THEME.primary }} />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold" style={{ color: THEME.dark }}>
                {dashboardData.stats.journalStreak}
              </span>
              <span className="text-xs mb-1" style={{ color: THEME.secondary }}>days</span>
            </div>
            <div className="flex gap-1 mt-2">
              {[...Array(7)].map((_, i) => (
                <div 
                  key={i} 
                  className="h-1 flex-1 rounded-full"
                  style={{ 
                    backgroundColor: i < dashboardData.stats.journalStreak ? THEME.primary : `${THEME.secondary}20`
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Community Engagement Card */}
          <motion.div 
            className="rounded-xl p-4"
            style={{ 
              backgroundColor: THEME.light,
              boxShadow: `0 2px 10px rgba(0,0,0,0.05)`
            }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: THEME.secondary }}>Community</span>
              <Users className="w-4 h-4" style={{ color: THEME.primary }} />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold" style={{ color: THEME.dark }}>
                {dashboardData.stats.communityEngagement}
              </span>
              <span className="text-xs mb-1" style={{ color: THEME.secondary }}>interactions</span>
            </div>
            <div className="mt-2">
              <div className="text-xs flex items-center gap-1" style={{ color: THEME.secondary }}>
                <span>Top {dashboardData.stats.communityPercentile}%</span>
                <div className="w-8 h-1 rounded-full overflow-hidden bg-white">
                  <div 
                    className="h-full rounded-full" 
                    style={{ 
                      width: `${dashboardData.stats.communityPercentile}%`,
                      background: `linear-gradient(90deg, ${THEME.primary}, ${THEME.accentPrimary})`
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* AI Sessions Card */}
          <motion.div 
            className="rounded-xl p-4"
            style={{ 
              backgroundColor: THEME.light,
              boxShadow: `0 2px 10px rgba(0,0,0,0.05)`
            }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: THEME.secondary }}>AI Sessions</span>
              <MessageSquare className="w-4 h-4" style={{ color: THEME.primary }} />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold" style={{ color: THEME.dark }}>
                {dashboardData.stats.aiSessions}
              </span>
              <span className="text-xs mb-1" style={{ color: THEME.secondary }}>this month</span>
            </div>
            <div className="mt-2">
              <div className="text-xs" style={{ 
                color: dashboardData.stats.aiSessionsChange >= 0 ? THEME.accentSecondary : '#F43F5E'
              }}>
                {dashboardData.stats.aiSessionsChange >= 0 ? '+' : ''}
                {dashboardData.stats.aiSessionsChange} from last week
              </div>
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
                backgroundColor: THEME.light,
                boxShadow: `0 2px 10px rgba(0,0,0,0.05)`
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: THEME.dark }}>
                  <Smile className="w-5 h-5" style={{ color: THEME.primary }} />
                  Daily Mood Check
                </h2>
                <button 
                  onClick={fetchDashboardData}
                  className="text-xs flex items-center gap-1"
                  style={{ color: THEME.secondary }}
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
                  <p className="mb-2" style={{ color: THEME.primary }}>You've logged your mood today!</p>
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
                    <button
                      onClick={() => setShowMoodForm(true)}
                      className="w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                      style={{ 
                        background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.accentPrimary} 100%)`,
                        color: 'white',
                        boxShadow: `0 2px 10px ${THEME.primary}30`
                      }}
                    >
                      <Smile className="w-5 h-5" />
                      Log Your Mood
                    </button>
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
                              color: dashboardData.moodLevel === level.toString() ? moodColors[level] : THEME.dark,
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
                        <label className="block text-sm font-medium mb-1" style={{ color: THEME.dark }}>
                          Add a note (optional)
                        </label>
                        <textarea
                          value={dashboardData.note}
                          onChange={(e) => setDashboardData(prev => ({ ...prev, note: e.target.value }))}
                          className="w-full p-3 rounded-lg focus:ring-2 text-sm"
                          rows="2"
                          placeholder="What's influencing your mood today?"
                          style={{ 
                            backgroundColor: `${THEME.light}`,
                            border: `1px solid ${THEME.secondary}20`,
                            color: THEME.dark
                          }}
                        />
                      </div>
                      {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
                      <div className="flex gap-2">
                        <motion.button
                          type="submit"
                          className="flex-1 py-2 px-4 rounded-lg font-medium"
                          style={{ 
                            background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.accentPrimary} 100%)`,
                            color: 'white',
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
                            border: `1px solid ${THEME.secondary}30`,
                            color: THEME.dark
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
                backgroundColor: THEME.light,
                boxShadow: `0 2px 10px rgba(0,0,0,0.05)`
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: THEME.dark }}>
                <Activity className="w-5 h-5" style={{ color: THEME.primary }} />
                Mood Distribution
              </h2>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((level) => (
                  <div key={level} className="flex items-center gap-3">
                    <div className="w-6 h-6 flex items-center justify-center" style={{ color: moodColors[level] }}>
                      {moodIcons[level]}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1" style={{ color: THEME.dark }}>
                        <span>Level {level}</span>
                        <span>{dashboardData.stats.moodDistribution[level-1] || 0}%</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden bg-white">
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
              backgroundColor: THEME.light,
              boxShadow: `0 2px 10px rgba(0,0,0,0.05)`
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: THEME.dark }}>
                <Calendar className="w-5 h-5" style={{ color: THEME.primary }} />
                Mood Over Time
              </h2>
              <div className="flex items-center gap-2">
                <div className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                  style={{ 
                    backgroundColor: dashboardData.stats.weeklyComparison >= 0 ? `${THEME.accentSecondary}20` : '#FECDD320',
                    color: dashboardData.stats.weeklyComparison >= 0 ? THEME.accentSecondary : '#F43F5E'
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
          {/* Community Posts */}
          <motion.div 
            className="rounded-xl p-6"
            style={{ 
              backgroundColor: THEME.light,
              boxShadow: `0 2px 10px rgba(0,0,0,0.05)`
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: THEME.dark }}>
                <Users className="w-5 h-5" style={{ color: THEME.primary }} />
                Recent Community Activity
              </h2>
              <button 
                onClick={() => navigate("/community")}
                className="text-xs flex items-center gap-1"
                style={{ color: THEME.secondary }}
              >
                View All <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            {dashboardData.communityPosts.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.communityPosts.map((post, index) => (
                  <motion.div 
                    key={index}
                    className="p-4 rounded-lg hover:bg-primary/5 cursor-pointer transition-colors"
                    style={{ backgroundColor: `${THEME.primary}05` }}
                    whileHover={{ x: 5 }}
                    onClick={() => navigate(`/community/post/${post._id}`)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" 
                        style={{ backgroundColor: `${THEME.accentPrimary}20` }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke={THEME.accentPrimary}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <span className="font-medium text-sm" style={{ color: THEME.dark }}>
                        {post.author?.name || "Anonymous"}
                      </span>
                      <span className="text-xs" style={{ color: THEME.secondary }}>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm line-clamp-2" style={{ color: THEME.dark }}>
                      {post.content}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-1 text-xs" style={{ color: THEME.secondary }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        {post.likes || 0}
                      </div>
                      <div className="flex items-center gap-1 text-xs" style={{ color: THEME.secondary }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {post.comments?.length || 0}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p style={{ color: THEME.secondary }}>No recent posts yet</p>
                <button 
                  onClick={() => navigate("/community/new")}
                  className="mt-2 text-sm font-medium"
                  style={{ color: THEME.primary }}
                >
                  Be the first to post!
                </button>
              </div>
            )}
          </motion.div>

          {/* AI Tips & Chats */}
          <div className="space-y-6">
            {/* AI Tip Card */}
            <motion.div 
              className="rounded-xl p-6"
              style={{ 
                backgroundColor: THEME.light,
                boxShadow: `0 2px 10px rgba(0,0,0,0.05)`
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: THEME.dark }}>
                  <Sparkles className="w-5 h-5" style={{ color: THEME.primary }} />
                  Daily Wellness Tip
                </h2>
                <button 
                  onClick={fetchDashboardData}
                  className="text-xs flex items-center gap-1"
                  style={{ color: THEME.secondary }}
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
                <p className="italic text-sm" style={{ color: THEME.dark }}>{dashboardData.aiTip}</p>
                <div className="text-xs mt-2 flex items-center gap-1" style={{ color: THEME.secondary }}>
                  <span>From InnerLight AI</span>
                </div>
              </div>
            </motion.div>

            {/* Active Chats Card */}
            <motion.div 
              className="rounded-xl p-6"
              style={{ 
                backgroundColor: THEME.light,
                boxShadow: `0 2px 10px rgba(0,0,0,0.05)`
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: THEME.dark }}>
                  <MessageSquare className="w-5 h-5" style={{ color: THEME.primary }} />
                  Your Conversations
                </h2>
                <button 
                  onClick={() => navigate("/chatbot")}
                  className="text-xs flex items-center gap-1"
                  style={{ color: THEME.secondary }}
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
                      <span className="font-medium text-sm" style={{ color: THEME.dark }}>
                        {chat.isAI ? "InnerLight AI" : chat.participants?.find(p => p._id !== localStorage.getItem("userId"))?.name || "Chat"}
                      </span>
                      <span className="text-xs" style={{ color: THEME.secondary }}>
                        {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm line-clamp-2" style={{ color: THEME.dark }}>
                      {chat.lastMessage?.content || "No messages yet"}
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p style={{ color: THEME.secondary }}>No active conversations</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {chatStarters.map((prompt, i) => (
                    <motion.div 
                      key={i}
                      className="p-3 rounded-lg cursor-pointer"
                      style={{ backgroundColor: `${THEME.secondary}10` }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => navigate('/chatbot', { state: { initialMessage: prompt } })}
                    >
                      <p className="text-xs" style={{ color: THEME.dark }}>{prompt}</p>
                    </motion.div>
                  ))}
                </div>
                <button 
                  onClick={() => navigate("/chatbot")}
                  className="mt-4 w-full py-2 rounded-lg font-medium flex items-center justify-center gap-2"
                  style={{ 
                    background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.accentPrimary} 100%)`,
                    color: 'white',
                    boxShadow: `0 2px 10px ${THEME.primary}30`
                  }}
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat with InnerLight AI
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;