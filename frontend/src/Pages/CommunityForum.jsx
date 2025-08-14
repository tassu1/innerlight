import { motion } from "framer-motion";
import { Sprout, Leaf, Flower, Trees, CheckCircle, Droplet, Sparkles, BarChart2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";

const THEME = {
  primary: "#6D28D9",
  secondary: "#1E1B4B",
  dark: "#0F172A",
  light: "#E2E8F0",
  accentPrimary: "#8B5CF6",
  accentSecondary: "#10B981",
  textPrimary: "#F8FAFC",
  textSecondary: "#94A3B8",
  cardBg: "rgba(30, 27, 75, 0.6)",
  border: "rgba(124, 58, 237, 0.3)",
  paper: "rgba(249, 250, 251, 0.9)",
  error: "#EF4444"
};

const CommunityForum = ({ userId }) => {
  const [garden, setGarden] = useState(null);
  const [activeTab, setActiveTab] = useState('habits');
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Visual stages cycle every 5 levels
  const growthStages = [
    { icon: <Sprout />, name: "Seedling" },
    { icon: <Leaf />, name: "Growing" },
    { icon: <Flower />, name: "Blooming" },
    { icon: <Trees />, name: "Thriving" }
  ];
  const visualStage = garden ? Math.min(Math.floor((garden.growth.level - 1) / 5) % 4, 3) : 0;

  useEffect(() => {
    // Only fetch if we have a valid userId
    if (!userId) {
      setError("User ID is required");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [gardenRes, weeklyRes] = await Promise.all([
          axios.get(`/api/mindgarden?userId=${userId}`),
          axios.get(`/api/mindgarden/weekly?userId=${userId}`)
        ]);
        
        setGarden(gardenRes.data);
        setWeeklyData(weeklyRes.data.weeklyData);
      } catch (err) {
        console.error("Error fetching garden data:", err);
        setError("Failed to load garden data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const toggleHabit = async (habitId, completed) => {
    if (!userId) {
      setError("User ID is required");
      return;
    }

    try {
      const res = await axios.post('/api/mindgarden/update', {
        userId,
        habitUpdates: [{ habitId, completed: !completed }]
      });
      
      setGarden(prev => ({
        ...prev,
        habits: prev.habits.map(h => 
          h._id === habitId ? { ...h, completed: !completed } : h
        ),
        growth: res.data.growth
      }));
    } catch (err) {
      console.error("Error updating habit:", err);
      setError("Failed to update habit. Please try again.");
    }
  };

  if (!userId) {
    return (
      <div className="flex justify-center items-center h-64">
        <p style={{ color: THEME.error }}>Error: User ID is required</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full border-t-2 border-b-2"
          style={{ borderColor: THEME.primary }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p style={{ color: THEME.error }}>{error}</p>
      </div>
    );
  }

  if (!garden) {
    return (
      <div className="flex justify-center items-center h-64">
        <p style={{ color: THEME.textPrimary }}>No garden data available</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Header with Level and Streak */}
      <motion.div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <span 
            className="px-3 py-1 rounded-full text-sm" 
            style={{ 
              backgroundColor: `${THEME.primary}20`, 
              color: THEME.primary 
            }}
          >
            Level {garden.growth.level}
          </span>
          <span 
            className="px-3 py-1 rounded-full text-sm flex items-center gap-1"
            style={{ 
              backgroundColor: `${THEME.accentPrimary}20`, 
              color: THEME.accentPrimary 
            }}
          >
            <Droplet className="w-4 h-4" /> {garden.growth.streak} day streak
          </span>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('habits')}
            style={{
              backgroundColor: activeTab === 'habits' ? THEME.primary : 'transparent',
              color: activeTab === 'habits' ? THEME.textPrimary : THEME.textSecondary
            }}
            className="px-3 py-1 rounded-full text-sm transition-colors"
          >
            Habits
          </button>
          <button 
            onClick={() => setActiveTab('stats')}
            style={{
              backgroundColor: activeTab === 'stats' ? THEME.primary : 'transparent',
              color: activeTab === 'stats' ? THEME.textPrimary : THEME.textSecondary
            }}
            className="px-3 py-1 rounded-full text-sm transition-colors"
          >
            Stats
          </button>
        </div>
      </motion.div>

      {activeTab === 'habits' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Garden Visualization */}
          <motion.div 
            className="rounded-xl p-6 flex flex-col items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${THEME.cardBg}, ${THEME.secondary}80)`,
              border: `1px solid ${THEME.border}`,
              backdropFilter: "blur(10px)"
            }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                y: [0, -5, 0],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ 
                duration: 3 + (visualStage * 0.5),
                repeat: Infinity,
                repeatType: "mirror"
              }}
              style={{ 
                color: THEME.primary,
                fontSize: `${16 + (garden.growth.level * 0.5)}px`
              }}
            >
              {growthStages[visualStage].icon}
            </motion.div>

            {/* XP Progress */}
            <div className="w-full mt-6">
              <div className="flex justify-between text-sm mb-1">
                <span style={{ color: THEME.textSecondary }}>Next Level</span>
                <span style={{ color: THEME.textPrimary }}>
                  {garden.growth.xp % 100}/100 XP
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2.5">
                <motion.div 
                  className="h-2.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${(garden.growth.xp % 100)}%`,
                    backgroundColor: THEME.primary
                  }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>
          </motion.div>

          {/* Habit Tracker */}
          <div className="space-y-4">
            <motion.div 
              className="rounded-xl p-6"
              style={{
                background: `linear-gradient(135deg, ${THEME.cardBg}, ${THEME.secondary}80)`,
                border: `1px solid ${THEME.border}`,
                backdropFilter: "blur(10px)"
              }}
            >
              <h2 className="text-xl font-medium mb-4" style={{ color: THEME.textPrimary }}>
                Today's Habits
              </h2>
              
              <div className="space-y-3">
                {garden.habits.map((habit) => (
                  <motion.div
                    key={habit._id}
                    whileHover={{ 
                      backgroundColor: `${THEME.primary}10`,
                      borderColor: THEME.accentPrimary
                    }}
                    className="flex items-center justify-between p-3 rounded-lg border"
                    style={{
                      borderColor: `${THEME.primary}20`,
                      color: THEME.textPrimary
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{habit.icon}</div>
                      <div>
                        <p className="font-medium">{habit.name}</p>
                        <p className="text-xs opacity-70" style={{ color: THEME.textSecondary }}>
                          {habit.description}
                        </p>
                      </div>
                    </div>
                    
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleHabit(habit._id, habit.completed)}
                      className={`w-6 h-6 rounded-md flex items-center justify-center ${
                        habit.completed ? 'bg-purple-500' : 'border'
                      }`}
                      style={{
                        borderColor: THEME.primary,
                        color: THEME.textPrimary
                      }}
                    >
                      {habit.completed && (
                        <motion.svg
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </motion.svg>
                      )}
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl p-6" style={{
          background: `linear-gradient(135deg, ${THEME.cardBg}, ${THEME.secondary}80)`,
          border: `1px solid ${THEME.border}`,
          backdropFilter: "blur(10px)"
        }}>
          <h2 className="text-xl font-medium mb-6 flex items-center gap-2" style={{ color: THEME.textPrimary }}>
            <BarChart2 className="w-5 h-5" /> Weekly Progress
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2" style={{ color: THEME.textPrimary }}>
                Current Streak: {weeklyData.currentStreak || 0} days
              </h3>
              <div className="flex gap-1 h-8">
                {Array.from({ length: 7 }).map((_, i) => {
                  const date = dayjs().subtract(6 - i, 'day');
                  const hasData = weeklyData.some(d => dayjs(d.date).isSame(date, 'day'));
                  return (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className={`flex-1 rounded ${hasData ? 'bg-purple-500' : 'bg-gray-800'}`}
                      title={date.format('ddd, MMM D')}
                    />
                  );
                })}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2" style={{ color: THEME.textPrimary }}>
                XP Earned This Week
              </h3>
              <div className="h-64">
                <div className="flex items-end justify-between h-full gap-1">
                  {weeklyData.map((day, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.min(day.totalXp || 0, 100)}%` }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="flex-1 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t"
                      title={`${dayjs(day.date).format('ddd')}: ${day.totalXp || 0} XP`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityForum;