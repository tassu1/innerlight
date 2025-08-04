import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Bell,
  LogOut,
  MessageCircle,
  User,
  Bookmark,
  Heart,
  Handshake,
  LampDesk,
  LogIn,
  UserPlus,
  ChevronDown,
  Bot,
  MessageSquareText,
  Menu,
  X,
  Home,
  BookOpen,
  Settings,
  ThumbsUp,
  HelpCircle
} from "lucide-react";
import { motion } from "framer-motion";

const THEME = {
  primary: "#FF7E6B",
  secondary: "#2F4858",
  dark: "#2A2D34",
  light: "#F7F4EA",
  accent: "#FF9E90"
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Fix page shift by accounting for scrollbar
  useEffect(() => {
    document.body.style.overflowY = "scroll";
    document.body.style.width = "calc(100% - (100vw - 100%))";
    return () => {
      document.body.style.overflowY = "";
      document.body.style.width = "";
    };
  }, []);



useEffect(() => {
    // Always show scrollbar to prevent layout shift
    document.documentElement.style.overflowY = 'scroll';
    
    // Set body background to match theme
    document.body.style.backgroundColor = THEME.dark;
    
    // Prevent horizontal scroll
    document.body.style.overflowX = 'hidden';
    
    return () => {
      document.documentElement.style.overflowY = '';
      document.body.style.backgroundColor = '';
      document.body.style.overflowX = '';
    };
  }, []);


  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('.mobile-menu-button')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const auth = !!token;
    setIsAuthenticated(auth);
    // Reset dropdown states on auth change
    setShowProfile(false);
    setShowNotif(false);

    if (location.pathname.startsWith("/dashboard") && !auth) {
      navigate("/login", { state: { from: location.pathname } });
    }

    if (auth) fetchNotifications();
  }, [location.pathname, navigate]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = async (id, link) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(prev => prev.map(n => n._id === id ? {...n, isRead: true} : n));
      if (link) navigate(link);
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setIsAuthenticated(false);
    setShowProfile(false); // Close profile on logout
    navigate("/");
    setMobileMenuOpen(false);
  };

  const renderNotificationMessage = (notif) => {
    switch (notif.type) {
      case "like":
        return `${notif.from?.name || 'Someone'} liked your post`;
      case "comment":
        return `${notif.from?.name || 'Someone'} commented on your post`;
      default:
        return notif.message;
    }
  };

  if (!isAuthenticated) {
  return (
    <>
      <nav 
        className="fixed w-full z-50 px-4 sm:px-6 py-3 backdrop-blur-sm bg-opacity-90"
        style={{
          backgroundColor: `${THEME.dark}EE`,
          borderBottom: `1px solid ${THEME.primary}30`
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left side - Logo */}
          <motion.div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
             <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ 
                duration: 0.5,
                repeat: 1,
                repeatType: "mirror"
              }}
              className="p-3 rounded-full mb-3"
              style={{ 
                backgroundColor: `${THEME.primary}20`,
                boxShadow: `0 0 0 4px ${THEME.primary}10`
              }}
            >
              <LampDesk size={19} style={{ color: THEME.primary }} />
            </motion.div>
            <span 
              className="text-xl font-bold"
              style={{ color: THEME.light }}
            >
              InnerLight
            </span>
          </motion.div>

          {/* Right side - Auth buttons */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4">
              <motion.button
                onClick={() => navigate("/login")}
                className="px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-theme-primary/10 transition-colors"
                style={{ color: THEME.light }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogIn className="w-4 h-4" />
                <span className="text-sm">Login</span>
              </motion.button>
              <motion.button
                onClick={() => navigate("/signup")}
                className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                style={{
                  backgroundColor: THEME.primary,
                  color: THEME.light
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <UserPlus className="w-4 h-4" />
                <span className="text-sm">Sign Up</span>
              </motion.button>
            </div>

            <button 
              className="sm:hidden p-2 rounded-lg hover:bg-theme-primary/10 transition-colors mobile-menu-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ color: THEME.light }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <motion.div 
          className="fixed top-14 left-0 right-0 z-40 sm:hidden bg-theme-dark py-2 px-4 shadow-lg"
          style={{ backgroundColor: THEME.dark }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          ref={mobileMenuRef}
        >
          <div className="flex flex-col gap-2">
            <motion.button
              onClick={() => {
                navigate("/login");
                setMobileMenuOpen(false);
              }}
              className="w-full px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-theme-primary/10 transition-colors"
              style={{ color: THEME.light }}
              whileHover={{ x: 5 }}
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </motion.button>
            <motion.button
              onClick={() => {
                navigate("/signup");
                setMobileMenuOpen(false);
              }}
              className="w-full px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
              style={{
                backgroundColor: THEME.primary,
                color: THEME.light
              }}
              whileHover={{ x: 5 }}
            >
              <UserPlus className="w-4 h-4" />
              <span>Sign Up</span>
            </motion.button>
          </div>
        </motion.div>
      )}
      <div className="h-2"></div>
    </>
  );
}

  return (
    <>
      <nav 
        className="fixed w-full z-50 px-4 sm:px-6 py-3 backdrop-blur-sm bg-opacity-90"
        style={{
          backgroundColor: `${THEME.dark}EE`,
          borderBottom: `1px solid ${THEME.primary}30`
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <button 
              className="sm:hidden p-2 rounded-lg hover:bg-theme-primary/10 transition-colors mobile-menu-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ color: THEME.light }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <motion.div 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => navigate("/dashboard")}
              whileHover={{ scale: 1.05 }}
            >
               <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ 
                duration: 0.5,
                repeat: 1,
                repeatType: "mirror"
              }}
              className="p-3 rounded-full mb-3"
              style={{ 
                backgroundColor: `${THEME.primary}20`,
                boxShadow: `0 0 0 4px ${THEME.primary}10`
              }}
            >
              <LampDesk size={18} style={{ color: THEME.primary }} />
            </motion.div>
              <span 
                className="text-xl font-bold hidden sm:block"
                style={{ color: THEME.light }}
              >
                InnerLight
              </span>
            </motion.div>
          </div>

          {/* Center Navigation Links */}
          <div className="hidden sm:flex items-center gap-2 mx-4">
            <motion.button
              onClick={() => navigate("/dashboard")}
              className="px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-theme-primary/10 transition-colors"
              style={{ color: THEME.light }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              
              <span className="text-sm">Home</span>
            </motion.button>

            <motion.button
              onClick={() => navigate("/chatbot")}
              className="px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-theme-primary/10 transition-colors"
              style={{ color: THEME.light }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
             
              <span className="text-sm">Chatbot</span>
            </motion.button>

            <motion.button
              onClick={() => navigate("/community")}
              className="px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-theme-primary/10 transition-colors"
              style={{ color: THEME.light }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              
              <span className="text-sm">Community</span>
            </motion.button>

            <motion.button
              onClick={() => navigate("/resources")}
              className="px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-theme-primary/10 transition-colors"
              style={{ color: THEME.light }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              
              <span className="text-sm">Resources</span>
            </motion.button>

            <motion.button
              onClick={() => navigate("/journal")}
              className="px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-theme-primary/10 transition-colors"
              style={{ color: THEME.light }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              
              <span className="text-sm">Journaling</span>
            </motion.button>
          </div>

          {/* Right side navigation */}
          <div className="flex items-center gap-4">
            <div className="relative" ref={notifRef}>
              <motion.button
                className={`p-2 rounded-xl transition-all ${showNotif ? 'bg-theme-primary/20' : 'hover:bg-theme-primary/10'}`}
                onClick={() => {
                  setShowNotif(!showNotif);
                  setShowProfile(false);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative">
                  <Bell size={22} style={{ color: THEME.light }} />
                  {unreadCount > 0 && (
                    <motion.span 
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        backgroundColor: THEME.primary,
                        color: THEME.light
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </div>
              </motion.button>

              {showNotif && (
                <div 
                  className="absolute right-0 mt-2 w-80 rounded-xl shadow-2xl overflow-hidden z-50"
                  style={{
                    backgroundColor: THEME.secondary,
                    border: `1px solid ${THEME.primary}30`
                  }}
                >
                  <div 
                    className="px-4 py-3 border-b flex justify-between items-center"
                    style={{
                      borderColor: `${THEME.primary}20`
                    }}
                  >
                    <h3 className="font-semibold" style={{ color: THEME.primary }}>
                      Notifications
                    </h3>
                    <button 
                      className="text-xs hover:underline"
                      style={{ color: THEME.light }}
                      onClick={() => notifications.forEach(n => !n.isRead && markAsRead(n._id))}
                    >
                      Mark all as read
                    </button>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center">
                        <p style={{ color: THEME.light }}>No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <motion.div
                          key={notif._id}
                          className={`px-4 py-3 cursor-pointer border-b flex gap-3 items-start transition-colors ${
                            notif.isRead ? 'opacity-80' : 'bg-theme-primary/10'
                          }`}
                          style={{
                            borderColor: `${THEME.primary}10`,
                            color: THEME.light
                          }}
                          onClick={() => markAsRead(notif._id, notif.link)}
                          whileHover={{ backgroundColor: `${THEME.primary}15` }}
                        >
                          <div className="mt-0.5">
                            {notif.type === 'like' ? (
                              <ThumbsUp size={16} style={{ color: THEME.primary }} />
                            ) : (
                              <MessageSquareText size={16} style={{ color: THEME.accent }} />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {renderNotificationMessage(notif)}
                            </p>
                            <p 
                              className="text-xs mt-1"
                              style={{ color: `${THEME.light}80` }}
                            >
                              {new Date(notif.createdAt).toLocaleString([], {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          {!notif.isRead && (
                            <div className="w-2 h-2 rounded-full mt-2" 
                              style={{ backgroundColor: THEME.primary }} />
                          )}
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={profileRef}>
              <motion.button
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                  showProfile ? 'bg-theme-primary/20' : 'hover:bg-theme-primary/10'
                }`}
                onClick={() => {
                  setShowProfile(!showProfile);
                  setShowNotif(false);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${THEME.primary}20` }}>
                  <User size={18} style={{ color: THEME.primary }} />
                </div>
                <ChevronDown 
                  size={16} 
                  style={{ color: THEME.light }} 
                  className={`transition-transform ${showProfile ? "rotate-180" : ""}`} 
                />
              </motion.button>

              {showProfile && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl overflow-hidden z-50"
                  style={{
                    backgroundColor: THEME.secondary,
                    border: `1px solid ${THEME.primary}30`
                  }}
                >
                  <div className="px-4 py-3 border-b" style={{ borderColor: `${THEME.primary}20` }}>
                    <p className="text-sm font-medium" style={{ color: THEME.light }}>
                      Signed in as
                    </p>
                    <p className="text-sm truncate" style={{ color: THEME.primary }}>
                      {localStorage.getItem("userEmail") || "User"}
                    </p>
                  </div>
                  <motion.button
                    className="w-full px-4 py-3 text-left hover:bg-theme-primary/10 transition-colors flex items-center gap-3 border-b"
                    style={{
                      color: THEME.light,
                      borderColor: `${THEME.primary}10`
                    }}
                    onClick={() => {
                      navigate("/profile");
                      setShowProfile(false);
                    }}
                    whileHover={{ x: 5 }}
                  >
                    <User size={16} />
                    <span>Your Profile</span>
                  </motion.button>
                  <motion.button
                    className="w-full px-4 py-3 text-left hover:bg-theme-primary/10 transition-colors flex items-center gap-3 border-b"
                    style={{
                      color: THEME.light,
                      borderColor: `${THEME.primary}10`
                    }}
                    onClick={() => {
                      navigate("/settings");
                      setShowProfile(false);
                    }}
                    whileHover={{ x: 5 }}
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </motion.button>
                  <motion.button
                    className="w-full px-4 py-3 text-left hover:bg-theme-primary/10 transition-colors flex items-center gap-3 border-b"
                    style={{
                      color: THEME.light,
                      borderColor: `${THEME.primary}10`
                    }}
                    onClick={() => {
                      navigate("/help");
                      setShowProfile(false);
                    }}
                    whileHover={{ x: 5 }}
                  >
                    <HelpCircle size={16} />
                    <span>Help & Support</span>
                  </motion.button>
                  <motion.button
                    className="w-full px-4 py-3 text-left hover:bg-theme-primary/10 transition-colors flex items-center gap-3 text-red-400"
                    onClick={logoutHandler}
                    whileHover={{ x: 5 }}
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <motion.div 
          className="fixed top-14 left-0 right-0 z-40 sm:hidden bg-theme-dark/95 py-4 px-4 shadow-lg backdrop-blur-sm"
          style={{ backgroundColor: `${THEME.dark}EE` }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          ref={mobileMenuRef}
        >
          <div className="flex flex-col gap-4">
            <motion.button
              onClick={() => {
                navigate("/dashboard");
                setMobileMenuOpen(false);
              }}
              className="w-full px-4 py-3 rounded-lg flex items-center gap-3 hover:bg-theme-primary/10 transition-colors"
              style={{ color: THEME.light }}
              whileHover={{ x: 5 }}
            >
              <Home size={20} />
              <span>Home</span>
            </motion.button>

            <motion.button
              onClick={() => {
                navigate("/chatbot");
                setMobileMenuOpen(false);
              }}
              className="w-full px-4 py-3 rounded-lg flex items-center gap-3 hover:bg-theme-primary/10 transition-colors"
              style={{ color: THEME.light }}
              whileHover={{ x: 5 }}
            >
              <Bot size={20} />
              <span>Chatbot</span>
            </motion.button>

            <motion.button
              onClick={() => {
                navigate("/community");
                setMobileMenuOpen(false);
              }}
              className="w-full px-4 py-3 rounded-lg flex items-center gap-3 hover:bg-theme-primary/10 transition-colors"
              style={{ color: THEME.light }}
              whileHover={{ x: 5 }}
            >
              <MessageCircle size={20} />
              <span>Community</span>
            </motion.button>

            <motion.button
              onClick={() => {
                navigate("/resources");
                setMobileMenuOpen(false);
              }}
              className="w-full px-4 py-3 rounded-lg flex items-center gap-3 hover:bg-theme-primary/10 transition-colors"
              style={{ color: THEME.light }}
              whileHover={{ x: 5 }}
            >
              <Bookmark size={20} />
              <span>Resources</span>
            </motion.button>

            <motion.button
              onClick={() => {
                navigate("/journaling");
                setMobileMenuOpen(false);
              }}
              className="w-full px-4 py-3 rounded-lg flex items-center gap-3 hover:bg-theme-primary/10 transition-colors"
              style={{ color: THEME.light }}
              whileHover={{ x: 5 }}
            >
              <BookOpen size={20} />
              <span>Journaling</span>
            </motion.button>

            <motion.button
              onClick={() => {
                navigate("/profile");
                setMobileMenuOpen(false);
              }}
              className="w-full px-4 py-3 rounded-lg flex items-center gap-3 hover:bg-theme-primary/10 transition-colors"
              style={{ color: THEME.light }}
              whileHover={{ x: 5 }}
            >
              <User size={20} />
              <span>Profile</span>
            </motion.button>

            <div className="px-4 py-3 border-t border-theme-primary/20 flex justify-between items-center">
              <div>
                <p className="text-xs" style={{ color: THEME.light }}>
                  Signed in as
                </p>
                <p className="text-sm truncate" style={{ color: THEME.primary }}>
                  {localStorage.getItem("userEmail") || "User"}
                </p>
              </div>
              <motion.button
                className="px-3 py-1 rounded-lg flex items-center gap-2 text-red-400"
                onClick={logoutHandler}
                whileHover={{ scale: 1.05 }}
              >
                <LogOut size={16} />
                <span className="text-sm">Sign Out</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
      <div className="h-2 w-full" style={{ backgroundColor: THEME.dark }}></div>
    </>
  );
};

export default Navbar;


