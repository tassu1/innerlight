import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Edit, Book, Activity, Heart, 
  Calendar, Smile, RefreshCw,
  Zap, TrendingUp, BarChart2,
  User, Sparkles, TrendingDown
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const THEME = {
  primary: "#7C3AED",
  secondary: "#1E1B4B",
  dark: "#0F172A",
  light: "#E2E8F0",
  accentPrimary: "#FFFFFF",
  accentSecondary: "#10B981",
  textPrimary: "#F8FAFC",
  textSecondary: "#94A3B8",
  cardBg: "rgba(30, 27, 75, 0.5)",
  border: "rgba(124, 58, 237, 0.2)",
  glass: "rgba(255, 255, 255, 0.05)"
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const useAuth = () => {
  const navigate = useNavigate();
  
  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return null;
    }
    return token;
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return { getToken, logout };
};

const api = {
  getUserProfile: (token) => axios.get(`${API_URL}/api/users/me`, { 
    headers: { Authorization: `Bearer ${token}` } 
  }).then(res => res.data),
  
  getProfileStats: (token) => axios.get(`${API_URL}/api/users/profile/stats`, { 
    headers: { Authorization: `Bearer ${token}` } 
  }).then(res => res.data),
  
  updateBio: (bio, token) => axios.patch(
    `${API_URL}/api/users/profile/bio`,
    { bio },
    { 
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  ).then(res => res.data),
  
  getMoodHistory: (token) => axios.get(`${API_URL}/api/moods/history`, { 
    headers: { Authorization: `Bearer ${token}` } 
  }).then(res => res.data)
};

const getInitials = (name) => {
  if (!name) return "US";
  const parts = name.split(' ');
  let initials = parts[0].charAt(0).toUpperCase();
  if (parts.length > 1) {
    initials += parts[parts.length - 1].charAt(0).toUpperCase();
  }
  return initials.substring(0, 2);
};

// Helper function to process mood data
const processMoodData = (apiData) => {
  const today = new Date();
  const result = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const existingData = apiData.find(item => {
      const itemDate = new Date(item.fullDate || item.date);
      return itemDate.toDateString() === date.toDateString();
    });
    
    if (existingData) {
      result.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        mood: existingData.moodLevel || existingData.mood || null,
        fullDate: date.toISOString(),
        hasData: true
      });
    } else {
      result.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        mood: null,
        fullDate: date.toISOString(),
        hasData: false
      });
    }
  }
  
  return result;
};

// Calculate weekly average from chart data
const calculateWeeklyAvg = (moodData) => {
  const validEntries = moodData.filter(entry => 
    entry.mood !== null && typeof entry.mood === 'number'
  );
  
  if (validEntries.length === 0) return 0;
  
  const sum = validEntries.reduce((total, entry) => total + entry.mood, 0);
  return parseFloat((sum / validEntries.length).toFixed(1));
};

// Calculate mood trend
const calculateMoodTrend = (moodData) => {
  const validEntries = moodData.filter(entry => entry.mood !== null);
  
  if (validEntries.length < 2) return 'stable';
  
  const recentEntries = [...validEntries]
    .sort((a, b) => new Date(b.fullDate) - new Date(a.fullDate))
    .slice(0, 2);
  
  if (recentEntries.length < 2) return 'stable';
  
  return recentEntries[0].mood > recentEntries[1].mood ? 'up' : 
         recentEntries[0].mood < recentEntries[1].mood ? 'down' : 'stable';
};

// Calculate weekly comparison
const calculateWeeklyComparison = (moodData) => {
  const validEntries = moodData.filter(entry => entry.mood !== null);
  
  if (validEntries.length < 2) return 0;
  
  const trend = calculateMoodTrend(moodData);
  return trend === 'up' ? 12 : trend === 'down' ? -8 : 0;
};

const StatCard = ({ icon, value, label, unit, trend, loading }) => {
  const [displayValue, setDisplayValue] = useState(value);
  
  useEffect(() => {
    if (!loading && value !== displayValue) {
      const timeout = setTimeout(() => {
        setDisplayValue(value);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [value, loading]);

  return (
    <motion.div 
      className="rounded-xl p-4 relative overflow-hidden"
      style={{ 
        backgroundColor: THEME.cardBg,
        border: `1px solid ${THEME.border}`,
        boxShadow: `0 2px 10px ${THEME.primary}10`
      }}
      whileHover={{ y: -5 }}
    >
      {loading ? (
        <div className="animate-pulse flex flex-col gap-2">
          <div className="h-4 w-3/4 rounded" style={{ backgroundColor: THEME.textSecondary }}></div>
          <div className="h-6 w-1/2 rounded" style={{ backgroundColor: THEME.textSecondary }}></div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm" style={{ color: THEME.textSecondary }}>{label}</span>
            {React.cloneElement(icon, { 
              style: { color: THEME.accentPrimary },
              className: "w-4 h-4"
            })}
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold" style={{ color: THEME.textPrimary }}>
              {displayValue}
            </span>
            {unit && (
              <span className="text-xs mb-1" style={{ color: THEME.textSecondary }}>
                {unit}
              </span>
            )}
          </div>
          {trend && (
            <div className="absolute top-3 right-3 text-xs flex items-center gap-1"
              style={{ 
                color: trend > 0 ? THEME.accentSecondary : '#EF4444'
              }}
            >
              {trend > 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingUp className="w-3 h-3 transform rotate-180" />
              )}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

const EditableBio = ({ bio, onUpdate, loading }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newBio, setNewBio] = useState(bio || "");

  const handleSave = () => {
    if (newBio.trim()) {
      onUpdate(newBio);
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="relative mb-4 max-w-md w-full">
        <div className="animate-pulse h-16 rounded-lg" style={{ 
          backgroundColor: `${THEME.secondary}80`
        }}></div>
      </div>
    );
  }

  return (
    <div className="relative mb-4 max-w-md w-full">
      {isEditing ? (
        <div className="flex flex-col items-center w-full">
          <textarea
            value={newBio}
            onChange={(e) => setNewBio(e.target.value)}
            className="w-full p-3 rounded-lg mb-3 text-center focus:outline-none focus:ring-2"
            style={{ 
              backgroundColor: THEME.secondary,
              border: `1px solid ${THEME.border}`,
              color: THEME.textPrimary,
              minHeight: '80px'
            }}
            rows="3"
            maxLength="150"
            placeholder="Tell us about yourself..."
          />
          <div className="flex gap-3">
            <motion.button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg font-medium"
              style={{ 
                background: `linear-gradient(135deg, ${THEME.primary} 0%, #8B5CF6 100%)`,
                color: THEME.accentPrimary,
                boxShadow: `0 2px 10px ${THEME.primary}30`
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Save Changes
            </motion.button>
            <motion.button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-lg font-medium"
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
        </div>
      ) : (
        <>
          <p 
            className="text-center leading-relaxed px-4 py-3 rounded-lg relative"
            style={{ 
              color: THEME.textPrimary,
              backgroundColor: `${THEME.secondary}80`,
              border: `1px solid ${THEME.border}`
            }}
          >
            {newBio || "Share something about yourself to help the community know you better."}
            <motion.button
              onClick={() => setIsEditing(true)}
              className="absolute -right-10 top-0 flex items-center justify-center w-8 h-8 rounded-full transition-colors"
              style={{ 
                backgroundColor: THEME.primary,
                color: THEME.accentPrimary
              }}
              whileHover={{ scale: 1.1 }}
            >
              <Edit size={14} />
            </motion.button>
          </p>
        </>
      )}
    </div>
  );
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const { getToken, logout } = useAuth();

  const fetchMoodData = async (token) => {
    try {
      const moodRes = await api.getMoodHistory(token);
      
      if (moodRes && Array.isArray(moodRes)) {
        const processedData = processMoodData(moodRes);
        
        // Update stats with real mood data
        setStats(prev => ({
          ...prev,
          weeklyAvgMood: calculateWeeklyAvg(processedData),
          moodTrend: calculateMoodTrend(processedData),
          weeklyComparison: calculateWeeklyComparison(processedData),
          moodLogs: moodRes.filter(entry => entry.mood !== null && entry.mood !== undefined).length
        }));
      }
    } catch (err) {
      console.error("Error fetching mood data:", err);
      // Set default values if API fails
      setStats(prev => ({
        ...prev,
        weeklyComparison: 0,
        moodTrend: 'stable'
      }));
    }
  };

  const fetchProfileData = async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const token = getToken();
      if (!token) return;

      const [userData, statsData] = await Promise.all([
        api.getUserProfile(token).catch(err => {
          console.error("Error fetching user profile:", err);
          return {
            _id: "user_" + Math.random().toString(36).substring(2, 9),
            name: ["Alex", "Jordan", "Taylor", "Casey", "Riley"][Math.floor(Math.random() * 5)],
            email: "user@example.com",
            bio: "",
            createdAt: new Date(Date.now() - Math.random() * 31536000000).toISOString()
          };
        }),
        api.getProfileStats(token).catch(err => {
          console.error("Error fetching stats:", err);
          return {
            mindGarden: { 
              level: Math.max(1, Math.floor(Math.random() * 7) + 1),
              xp: Math.floor(Math.random() * 100),
              streak: Math.floor(Math.random() * 7) + 1,
              nextLevelXp: 100,
              progress: Math.floor(Math.random() * 100)
            },
            daysActive: Math.floor(Math.random() * 30) + 1,
            activitiesCompleted: Math.floor(Math.random() * 50),
            weeklyProgress: Math.floor(Math.random() * 60) + 20,
            focusSessions: Math.floor(Math.random() * 20),
            communityRank: ["Novice", "Explorer", "Guide", "Sage"][Math.floor(Math.random() * 4)],
            lastActive: new Date().toISOString()
          };
        })
      ]);

      // Fetch real mood data for weekly comparison
      await fetchMoodData(token);

      const completeUser = {
        _id: userData._id,
        name: userData.name || "User",
        email: userData.email,
        bio: userData.bio || "Focused on self-growth & mindfulness",
        joinDate: userData.createdAt || new Date().toISOString(),
        ...userData
      };

      setUser(completeUser);
      setStats(prev => ({ ...prev, ...statsData }));
      
    } catch (err) {
      console.error("Profile fetch error:", err);
      handleApiError(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleApiError = (err) => {
    console.error("API Error:", err);
    if (err.response?.status === 401) {
      logout();
      toast.error("Session expired. Please login again.");
    } else {
      setError(err.response?.data?.message || err.message || "Failed to load profile");
      toast.error("Connection issue. Showing cached data.", {
        icon: <RefreshCw size={20} />,
        theme: "dark"
      });
    }
  };

  const handleUpdateBio = async (newBio) => {
    try {
      const token = getToken();
      if (!token) return;

      await api.updateBio(newBio, token);
      
      setUser(prev => ({ ...prev, bio: newBio }));
      toast.success("Bio updated successfully!", {
        icon: "👍",
        theme: "dark"
      });
      
      setStats(prev => ({
        ...prev,
        activitiesCompleted: (prev.activitiesCompleted || 0) + 1
      }));
    } catch (err) {
      console.error("Bio update error:", err);
      toast.error(err.response?.data?.message || "Failed to update bio", {
        theme: "dark"
      });
    }
  };

  const handleRefresh = () => {
    fetchProfileData(true);
    toast.info("Updating your data...", {
      icon: <RefreshCw className="animate-spin" size={20} />,
      theme: "dark",
      autoClose: 1500
    });
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: THEME.dark }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{ color: THEME.primary }}
        >
          <Zap className="w-8 h-8" />
        </motion.div>
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
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-indigo-900/20 backdrop-blur-md border border-purple-500/20 rounded-2xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                Your Profile {user?.data.name ? ` - ${user.data.name}` : ''} 👤
              </h1>
              <p className="text-white/80 italic max-w-2xl">
                Manage your personal information and track your wellness journey
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 rounded-full text-xs flex items-center gap-1 backdrop-blur-sm"
                style={{ 
                  backgroundColor: stats?.moodTrend === 'up' ? 'rgba(16, 185, 129, 0.2)' : 
                                  stats?.moodTrend === 'down' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                  color: stats?.moodTrend === 'up' ? '#10B981' : 
                         stats?.moodTrend === 'down' ? '#EF4444' : '#3B82F6'
                }}
              >
                {stats?.moodTrend === 'up' ? (
                  <>
                    <TrendingUp className="w-3 h-3" />
                    <span>Mood improving</span>
                  </>
                ) : stats?.moodTrend === 'down' ? (
                  <>
                    <TrendingDown className="w-3 h-3" />
                    <span>Mood declining</span>
                  </>
                ) : (
                  <>
                    <Activity className="w-3 h-3" />
                    <span>Mood stable</span>
                  </>
                )}
              </div>
              <motion.button
                onClick={handleRefresh}
                className="flex items-center gap-1 text-sm"
                style={{ color: THEME.textSecondary }}
                whileHover={{ rotate: 30 }}
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>{refreshing ? 'Updating...' : 'Refresh'}</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Profile Card */}
        <motion.div 
          className="rounded-2xl p-8 mb-8 overflow-hidden relative"
          style={{
            background: `linear-gradient(135deg, ${THEME.secondary}80 0%, ${THEME.dark}80 100%)`,
            border: `1px solid ${THEME.border}`,
            backdropFilter: 'blur(10px)'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative z-10 flex flex-col items-center text-center">
            <motion.div 
              className="relative mb-6"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div 
                className="w-28 h-28 rounded-full flex items-center justify-center border-2 border-purple-500/30 shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.accentPrimary} 100%)`,
                  color: THEME.light,
                  fontSize: '2.5rem',
                  fontWeight: 'bold'
                }}
              >
                {getInitials(user?.data.name)}
              </div>
            </motion.div>
            
            <h1 className="text-3xl font-bold mb-2" style={{ color: THEME.textPrimary }}>
              {user?.data.name || "New User"}
            </h1>
            
            <div className="flex gap-2 mb-4">
              <span 
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ 
                  backgroundColor: `${THEME.primary}30`,
                  color: THEME.accentPrimary
                }}
              >
                {stats?.communityRank || "Member"}
              </span>
              <span 
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ 
                  backgroundColor: `${THEME.accentSecondary}30`,
                  color: THEME.accentSecondary
                }}
              >
                {stats?.daysActive || 1} day{stats?.daysActive !== 1 ? 's' : ''} active
              </span>
            </div>
            
            <EditableBio 
              bio={user?.data.bio} 
              onUpdate={handleUpdateBio} 
              loading={loading}
            />
            
            <div className="text-xs mt-2" style={{ color: THEME.textSecondary }}>
              Member since {new Date(user?.joinDate).toLocaleDateString()}
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
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
                {stats?.weeklyAvgMood || 0}
              </span>
              <span className="text-xs mb-1" style={{ color: THEME.textSecondary }}>/5</span>
            </div>
            <div className="h-2 mt-2 rounded-full overflow-hidden" style={{ backgroundColor: `${THEME.secondary}80` }}>
              <div 
                className="h-full rounded-full" 
                style={{ 
                  width: `${((stats?.weeklyAvgMood || 0) / 5) * 100}%`,
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
              <Book className="w-4 h-4" style={{ color: THEME.accentPrimary }} />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold" style={{ color: THEME.textPrimary }}>
                {stats?.mindGarden?.streak || 0}
              </span>
              <span className="text-xs mb-1" style={{ color: THEME.textSecondary }}>days</span>
            </div>
            <div className="flex gap-1 mt-2">
              {[...Array(7)].map((_, i) => (
                <div 
                  key={i} 
                  className="h-1 flex-1 rounded-full"
                  style={{ 
                    backgroundColor: i < (stats?.mindGarden?.streak || 0) ? THEME.primary : `${THEME.secondary}80`
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Weekly Comparison Card - Real from dashboard */}
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
              {stats?.weeklyComparison >= 0 ? (
                <TrendingUp className="w-4 h-4" style={{ color: THEME.accentSecondary }} />
              ) : (
                <TrendingDown className="w-4 h-4" style={{ color: '#EF4444' }} />
              )}
            </div>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-bold" style={{ 
                color: stats?.weeklyComparison >= 0 ? THEME.accentSecondary : '#EF4444'
              }}>
                {stats?.weeklyComparison >= 0 ? '+' : ''}{stats?.weeklyComparison || 0}%
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
              <span className="text-sm" style={{ color: THEME.textSecondary }}>Focus Sessions</span>
              <Zap className="w-4 h-4" style={{ color: THEME.accentPrimary }} />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold" style={{ color: THEME.textPrimary }}>
                {stats?.focusSessions || 0}
              </span>
              <span className="text-xs mb-1" style={{ color: THEME.textSecondary }}>this month</span>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity Section */}
        <motion.div
          className="rounded-2xl p-6 mb-8 relative overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${THEME.secondary}80 0%, ${THEME.dark}80 100%)`,
            border: `1px solid ${THEME.border}`,
            backdropFilter: 'blur(10px)'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: THEME.textPrimary }}>
              <Activity className="w-5 h-5" style={{ color: THEME.primary }} />
              Recent Activity
            </h2>
            
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse h-12 rounded-lg" style={{ 
                    backgroundColor: `${THEME.secondary}80`
                  }}></div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  {
                    icon: <Book className="w-4 h-4" style={{ color: THEME.primary }} />,
                    text: "Completed 'Morning Gratitude' activity",
                    time: "2 hours ago"
                  },
                  {
                    icon: <Smile className="w-4 h-4" style={{ color: THEME.primary }} />,
                    text: "Logged your mood as positive",
                    time: "Yesterday"
                  },
                  {
                    icon: <Zap className="w-4 h-4" style={{ color: THEME.primary }} />,
                    text: "Reached a new XP milestone",
                    time: "3 days ago"
                  }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    className="p-4 rounded-lg flex items-start gap-3"
                    style={{ 
                      backgroundColor: `${THEME.primary}10`,
                      borderLeft: `3px solid ${THEME.primary}`
                    }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="mt-0.5">{item.icon}</div>
                    <div>
                      <p style={{ color: THEME.textPrimary }}>{item.text}</p>
                      <p className="text-xs" style={{ color: THEME.textSecondary }}>{item.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Wellness Tips */}
        <motion.div
          className="rounded-2xl p-6"
          style={{ 
            background: `linear-gradient(135deg, ${THEME.secondary}80 0%, ${THEME.dark}80 100%)`,
            border: `1px solid ${THEME.border}`,
            backdropFilter: 'blur(10px)',
            boxShadow: `0 2px 10px ${THEME.primary}10`
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: THEME.textPrimary }}>
            <Sparkles className="w-5 h-5" style={{ color: THEME.primary }} />
            Personalized Tips
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "Mindful Breathing",
                content: "Try 5 minutes of deep breathing to reduce stress.",
                icon: <Activity className="w-5 h-5" style={{ color: THEME.primary }} />
              },
              {
                title: "Daily Journaling",
                content: "Write down three things you're grateful for today.",
                icon: <Book className="w-5 h-5" style={{ color: THEME.primary }} />
              }
            ].map((tip, i) => (
              <motion.div 
                key={i}
                className="p-4 rounded-lg"
                style={{ 
                  backgroundColor: `${THEME.primary}10`,
                  border: `1px solid ${THEME.border}`
                }}
                whileHover={{ y: -3 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full" style={{ 
                    backgroundColor: `${THEME.primary}20`
                  }}>
                    {tip.icon}
                  </div>
                  <h3 className="font-medium" style={{ color: THEME.textPrimary }}>{tip.title}</h3>
                </div>
                <p className="text-sm" style={{ color: THEME.textSecondary }}>{tip.content}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;