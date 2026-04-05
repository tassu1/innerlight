import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LogOut,
  User,
  LampDesk,
  LogIn,
  UserPlus,
  ChevronDown,
  Menu,
  X,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

const THEME = {
  primary: "#6D28D9",
  secondary: "#1E1B4B",
  dark: "#0F172A",
  light: "#E2E8F0",
  accentPrimary: "#7C3AED",
  accentSecondary: "#4C1D95",
  textPrimary: "#F8FAFC",
  textSecondary: "#94A3B8",
  cardBg: "rgba(30, 27, 75, 0.5)",
  border: "rgba(124, 58, 237, 0.2)",
};

// Nav links — single source of truth for both desktop + mobile
const NAV_LINKS = [
  { label: "Home",      path: "/dashboard" },
  { label: "Chat",      path: "/chatbot"   },
  { label: "Journal",   path: "/journal"   },
  { label: "Resources", path: "/resources" },
  { label: "Community", path: "/community", icon: <Users className="w-3.5 h-3.5" /> },
];

const Navbar = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProfile,     setShowProfile]     = useState(false);
  const [mobileMenuOpen,  setMobileMenuOpen]  = useState(false);
  const profileRef    = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    document.body.style.backgroundColor = THEME.dark;
    return () => { document.body.style.backgroundColor = ""; };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current    && !profileRef.current.contains(e.target))    setShowProfile(false);
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)
          && !e.target.closest(".mobile-menu-button"))                          setMobileMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const token = !!localStorage.getItem("token");
    setIsAuthenticated(token);
    setShowProfile(false);
    if (location.pathname.startsWith("/dashboard") && !token)
      navigate("/login", { state: { from: location.pathname } });
  }, [location.pathname, navigate]);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setIsAuthenticated(false);
    setShowProfile(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  // ── Unauthenticated navbar ──────────────────────────────────
  if (!isAuthenticated) {
    return (
      <>
        <nav
          className="fixed w-full z-50 px-4 sm:px-6 py-3 backdrop-blur-sm"
          style={{ backgroundColor: `${THEME.secondary}CC`, borderBottom: `1px solid ${THEME.border}` }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <motion.div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="p-2 rounded-full" style={{ backgroundColor: THEME.textPrimary }}>
                <LampDesk size={20} style={{ color: THEME.primary }} />
              </div>
              <span className="text-xl font-bold" style={{ color: THEME.textPrimary }}>InnerLight</span>
            </motion.div>

            <div className="hidden sm:flex items-center gap-4">
              <motion.button
                onClick={() => navigate("/login")}
                className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                style={{ color: THEME.textPrimary }}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              >
                <LogIn className="w-4 h-4" />
                <span className="text-sm">Login</span>
              </motion.button>
              <motion.button
                onClick={() => navigate("/signup")}
                className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                style={{ backgroundColor: THEME.accentPrimary, color: THEME.textPrimary }}
                whileHover={{ scale: 1.05, backgroundColor: THEME.accentSecondary }}
                whileTap={{ scale: 0.95 }}
              >
                <UserPlus className="w-4 h-4" />
                <span className="text-sm">Sign Up</span>
              </motion.button>
            </div>

            <button
              className="sm:hidden p-2 rounded-lg transition-colors mobile-menu-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ color: THEME.textPrimary }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {mobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            className="fixed top-14 left-0 right-0 z-40 sm:hidden py-2 px-4 shadow-lg backdrop-blur-sm"
            style={{ backgroundColor: `${THEME.secondary}EE`, borderTop: `1px solid ${THEME.border}` }}
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-2">
              {[
                { label: "Login",   path: "/login",  icon: <LogIn className="w-4 h-4" /> },
                { label: "Sign Up", path: "/signup", icon: <UserPlus className="w-4 h-4" />, accent: true },
              ].map(({ label, path, icon, accent }) => (
                <motion.button
                  key={path}
                  onClick={() => { navigate(path); setMobileMenuOpen(false); }}
                  className="w-full px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                  style={accent
                    ? { backgroundColor: THEME.accentPrimary, color: THEME.textPrimary }
                    : { color: THEME.textPrimary }}
                  whileHover={{ x: 5 }}
                >
                  {icon}<span>{label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
        <div className="h-0" />
      </>
    );
  }

  // ── Authenticated navbar ────────────────────────────────────
  return (
    <>
      <nav
        className="fixed w-full z-50 px-4 sm:px-6 py-3 backdrop-blur-sm"
        style={{ backgroundColor: `${THEME.secondary}CC`, borderBottom: `1px solid ${THEME.border}` }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <button
              className="sm:hidden p-2 rounded-lg transition-colors mobile-menu-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ color: THEME.textPrimary }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <motion.div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/dashboard")}
              whileHover={{ scale: 1.05 }}
            >
              <div className="p-2 rounded-full" style={{ backgroundColor: THEME.textPrimary }}>
                <LampDesk size={18} style={{ color: THEME.primary }} />
              </div>
              <span className="text-xl font-bold hidden sm:block" style={{ color: THEME.textPrimary }}>
                InnerLight
              </span>
            </motion.div>
          </div>

          {/* Desktop nav links */}
          <div className="hidden sm:flex items-center gap-1">
            {NAV_LINKS.map(({ label, path, icon }) => (
              <motion.button
                key={path}
                onClick={() => navigate(path)}
                className="px-3 py-2 rounded-lg flex items-center gap-1.5 text-sm transition-all"
                style={{
                  color: THEME.textPrimary,
                  backgroundColor: isActive(path) ? `${THEME.primary}25` : "transparent",
                  borderBottom: isActive(path) ? `2px solid ${THEME.accentPrimary}` : "2px solid transparent",
                }}
                whileHover={{ scale: 1.05, backgroundColor: `${THEME.primary}15` }}
                whileTap={{ scale: 0.95 }}
              >
                {icon}
                <span>{label}</span>
              </motion.button>
            ))}
          </div>

          {/* Profile dropdown */}
          <div className="relative" ref={profileRef}>
            <motion.button
              className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all"
              onClick={() => setShowProfile(!showProfile)}
              style={{ backgroundColor: showProfile ? `${THEME.primary}25` : "transparent" }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${THEME.primary}20` }}
              >
                <User size={18} style={{ color: THEME.textPrimary }} />
              </div>
              <ChevronDown
                size={16}
                style={{ color: THEME.textPrimary }}
                className={`transition-transform duration-200 ${showProfile ? "rotate-180" : ""}`}
              />
            </motion.button>

            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl overflow-hidden z-50 backdrop-blur-sm"
                style={{ backgroundColor: THEME.cardBg, border: `1px solid ${THEME.border}` }}
              >
                <div className="px-4 py-3 border-b" style={{ borderColor: THEME.border }}>
                  <p className="text-xs" style={{ color: THEME.textSecondary }}>Signed in as</p>
                  <p className="text-sm font-medium truncate" style={{ color: THEME.accentPrimary }}>
                    {localStorage.getItem("userEmail") || "User"}
                  </p>
                </div>
                <motion.button
                  className="w-full px-4 py-3 text-left flex items-center gap-3 border-b transition-colors"
                  style={{ color: THEME.textPrimary, borderColor: THEME.border }}
                  onClick={() => { navigate("/profile"); setShowProfile(false); }}
                  whileHover={{ x: 5, backgroundColor: `${THEME.primary}15` }}
                >
                  <User size={15} /><span className="text-sm">Your Profile</span>
                </motion.button>
                <motion.button
                  className="w-full px-4 py-3 text-left flex items-center gap-3 transition-colors"
                  style={{ color: "#F87171" }}
                  onClick={logoutHandler}
                  whileHover={{ x: 5, backgroundColor: "rgba(248,113,113,0.1)" }}
                >
                  <LogOut size={15} /><span className="text-sm">Sign Out</span>
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          ref={mobileMenuRef}
          className="fixed top-14 left-0 right-0 z-40 sm:hidden py-4 px-4 shadow-lg backdrop-blur-sm"
          style={{ backgroundColor: `${THEME.secondary}EE`, borderTop: `1px solid ${THEME.border}` }}
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}
        >
          <div className="flex flex-col gap-2">
            {NAV_LINKS.map(({ label, path, icon }) => (
              <motion.button
                key={path}
                onClick={() => { navigate(path); setMobileMenuOpen(false); }}
                className="w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-all"
                style={{
                  color: THEME.textPrimary,
                  backgroundColor: isActive(path) ? `${THEME.primary}25` : "transparent",
                }}
                whileHover={{ x: 5 }}
              >
                {icon}<span>{label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
      <div className="h-3" />
    </>
  );
};

export default Navbar;