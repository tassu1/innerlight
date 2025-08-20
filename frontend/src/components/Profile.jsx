import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Edit, Book, Activity, Heart, Award, 
  Calendar, Smile, RefreshCw, Loader,
  Zap, Moon, Sun, TrendingUp, BarChart2,
  User, Sparkles, ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const API_URL = import.meta.env.API_URL;


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
  ).then(res => res.data)
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

  const generateDummyStats = (seed = 0) => {
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - seed);
    
    const dayOfWeek = baseDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    return {
      mindGarden: { 
        level: Math.max(1, Math.floor(seed / 7) + 1),
        xp: (seed * 12) % 100,
        streak: isWeekend ? Math.min(7, seed % 8) : seed % 7,
        nextLevelXp: 100,
        progress: (seed * 12) % 100
      },
      daysActive: seed % 30,
      activitiesCompleted: (seed * 3) % 50,
      moodLogs: (seed * 2) % 30,
      weeklyProgress: 20 + (seed * 5) % 60,
      focusSessions: (seed * 2) % 20,
      communityRank: ["Novice", "Explorer", "Guide", "Sage"][Math.min(3, Math.floor(seed / 10))],
      lastActive: baseDate.toISOString()
    };
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

      await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));
      
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
          const seed = Math.floor(Date.now() / 86400000);
          return generateDummyStats(seed);
        })
      ]);

      const completeUser = {
        _id: userData._id,
        name: userData.name || "User",
        email: userData.email,
        bio: userData.bio || "Focused on self-growth & mindfulness",
        joinDate: userData.createdAt || new Date().toISOString(),
        ...userData
      };

      setUser(completeUser);
      setStats(statsData);
      
      if (Math.random() > 0.7) {
        setTimeout(() => {
          toast.info("New mindfulness tip available!", {
            icon: <Sparkles size={20} />,
            theme: "dark"
          });
        }, 2000);
      }
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

      await new Promise(resolve => setTimeout(resolve, 800));
      
      const result = await api.updateBio(newBio, token);
      
      setUser(prev => ({ ...prev, bio: newBio }));
      toast.success("Bio updated successfully!", {
        icon: "👍",
        theme: "dark"
      });
      
      setStats(prev => ({
        ...prev,
        activitiesCompleted: prev.activitiesCompleted + 1
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
  
  const interval = setInterval(() => {
    setStats(prev => {
      if (!prev || !prev.mindGarden) return prev || null;
      return {
        ...prev,
        mindGarden: {
          ...prev.mindGarden,
          xp: Math.min((prev.mindGarden.xp || 0) + 1, prev.mindGarden.nextLevelXp || 100)
        }
      };
    });
  }, 60000);
  
  return () => clearInterval(interval);
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
            <div className="flex items-center justify-between w-full mb-6">
              <h2 className="text-xl font-bold" style={{ color: THEME.textPrimary }}>
                Personal Information
              </h2>
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
          <StatCard 
            icon={<Activity style={{ color: THEME.primary }} />}
            value={stats?.mindGarden?.level || 1}
            label="Mind Garden Level"
            loading={loading}
          />
          
          <StatCard 
            icon={<Zap style={{ color: THEME.primary }} />}
            value={stats?.mindGarden?.xp || 10}
            label="Total XP"
            unit={`/ ${stats?.mindGarden?.nextLevelXp || 100}`}
            loading={loading}
          />
          
          <StatCard 
            icon={<Heart style={{ color: THEME.primary }} />}
            value={stats?.mindGarden?.streak || 1}
            label="Day Streak"
            unit="days"
            loading={loading}
          />
          
          <StatCard 
            icon={<Calendar style={{ color: THEME.primary }} />}
            value={stats?.daysActive || 1}
            label="Days Active"
            loading={loading}
          />
          
          <StatCard 
            icon={<Book style={{ color: THEME.primary }} />}
            value={stats?.activitiesCompleted || 0}
            label="Activities"
            loading={loading}
          />
          
          <StatCard 
            icon={<TrendingUp style={{ color: THEME.primary }} />}
            value={stats?.weeklyProgress || 12}
            label="Weekly Progress"
            unit="%"
            trend={5}
            loading={loading}
          />
          
          <StatCard 
            icon={<Smile style={{ color: THEME.primary }} />}
            value={stats?.moodLogs || 3}
            label="Mood Logs"
            loading={loading}
          />
          
          <StatCard 
            icon={<BarChart2 style={{ color: THEME.primary }} />}
            value={stats?.focusSessions || 1}
            label="Focus Sessions"
            loading={loading}
          />
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