import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Handshake, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const THEME = {
  primary: "#6D28D9",       // Deep purple
  secondary: "#1E1B4B",     // Dark indigo
  dark: "#0F172A",          // Very dark blue (almost black)
  light: "#E2E8F0",         // Soft light text
  accentPrimary: "#7C3AED",  // Vibrant purple
  accentSecondary: "#4C1D95", // Deep purple
  textPrimary: "#F8FAFC",    // Pure white text
  textSecondary: "#94A3B8",  // Light gray-blue text
  cardBg: "rgba(30, 27, 75, 0.7)", // Semi-transparent dark indigo
  border: "rgba(124, 58, 237, 0.3)" // Purple border with transparency
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = "http://localhost:5000";

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", email);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden flex items-center justify-center p-4"
      style={{ backgroundColor: THEME.dark }}
    >
      {/* Background gradient elements */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            radial-gradient(circle at 75% 30%, ${THEME.accentPrimary}40, transparent 50%),
            radial-gradient(circle at 25% 70%, ${THEME.primary}40, transparent 50%)`
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div
          className="p-8 rounded-2xl backdrop-blur-sm border"
          style={{
            backgroundColor: THEME.cardBg,
            borderColor: THEME.border,
            boxShadow: `0 8px 32px ${THEME.primary}20`
          }}
        >
          {/* Logo / Header */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, repeat: 1, repeatType: "mirror" }}
              className="p-3 rounded-full mb-3"
              style={{
                backgroundColor: `${THEME.primary}20`,
                boxShadow: `0 0 0 4px ${THEME.primary}10`
              }}
            >
              <Handshake size={28} style={{ color: THEME.accentPrimary }} />
            </motion.div>
            <h1 className="text-2xl font-bold text-center" style={{ color: THEME.textPrimary }}>
              Welcome to InnerLight
            </h1>
            <p className="text-sm mt-2 text-center" style={{ color: THEME.textSecondary }}>
              Sign in to continue your wellness journey
            </p>
          </div>

          {error && (
            <div
              className="mb-4 p-3 rounded-lg text-sm flex items-center gap-2"
              style={{
                backgroundColor: `${THEME.primary}20`,
                color: THEME.textPrimary,
                border: `1px solid ${THEME.primary}50`
              }}
            >
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            {/* Email Field */}
<div className="mb-4">
  <label className="block text-sm font-medium mb-2" style={{ color: THEME.textPrimary }}>
    Email Address
  </label>
  <div className="relative">
    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
      <Mail size={18} style={{ color: THEME.textSecondary }} />
    </div>
    <input
      type="email"
      placeholder="your@email.com"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
      style={{
        backgroundColor: `${THEME.secondary}80`,
        border: `1px solid ${THEME.border}`,
        color: THEME.textPrimary
      }}
      required
    />
  </div>
</div>

{/* Password Field */}
<div className="mb-4">
  <label className="block text-sm font-medium mb-2" style={{ color: THEME.textPrimary }}>
    Password
  </label>
  <div className="relative">
    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
      <Lock size={18} style={{ color: THEME.textSecondary }} />
    </div>
    <input
      type="password"
      placeholder="••••••••"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full pl-100 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
      style={{
        backgroundColor: `${THEME.secondary}80`,
        border: `1px solid ${THEME.border}`,
        color: THEME.textPrimary
      }}
      required
    />
  </div>
</div>
            {/* Submit */}
            <div className="pt-2">
              <motion.button
                type="submit"
                className="w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
                style={{
                  backgroundColor: THEME.accentPrimary,
                  color: THEME.textPrimary
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div
                    className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: THEME.textPrimary }}
                  />
                ) : (
                  <span>Sign In</span>
                )}
              </motion.button>
            </div>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: THEME.textSecondary }}>
              New to InnerLight?{' '}
              <Link
                to="/signup"
                className="font-medium hover:underline"
                style={{ color: THEME.accentPrimary }}
              >
                Create an account
              </Link>
            </p>
            <p className="text-xs mt-3" style={{ color: THEME.textSecondary }}>
              By continuing, you agree to our Terms and Privacy Policy
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;