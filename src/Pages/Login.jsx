import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Handshake, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';


const THEME = {
  primary: "#E76F51",   // Coral
  secondary: "#5C4033", // Cocoa brown
  dark: "#1F1F1F",      // Charcoal
  light: "#FAF9F6",     // Cream
  accent: "#E9C46A"     // Warm gold
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
      style={{ backgroundColor: THEME.light }}
    >
      

      {/* Warm radial light spots */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          background: `
            radial-gradient(circle at 75% 30%, ${THEME.primary}40, transparent 50%),
            radial-gradient(circle at 25% 70%, ${THEME.accent}40, transparent 50%)`
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div
          className="p-8 rounded-3xl backdrop-blur-lg border shadow-2xl"
          style={{
             backgroundColor: 'rgba(44, 0, 0, 0.7)',
            borderColor: `${THEME.primary}30`,
            boxShadow: `0 8px 32px ${THEME.primary}30`
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
              <Handshake size={28} style={{ color: THEME.primary }} />
            </motion.div>
            <h1 className="text-2xl font-bold text-center" style={{ color: THEME.light }}>
              Welcome to InnerLight
            </h1>
            <p className="text-sm mt-2 text-center" style={{ color: THEME.accent }}>
              Sign in to continue your wellness journey
            </p>
          </div>

          {error && (
            <div
              className="mb-4 p-3 rounded-lg text-sm flex items-center gap-2"
              style={{
                backgroundColor: `${THEME.primary}20`,
                color: THEME.light,
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
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: THEME.light }}>
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} style={{ color: `${THEME.light}70` }} />
                </div>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: 'rgba(250, 249, 246, 0.1)',
                    border: '1px solid rgba(250, 249, 246, 0.2)',
                    color: THEME.light
                  }}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: THEME.light }}>
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} style={{ color: `${THEME.light}70` }} />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: 'rgba(250, 249, 246, 0.1)',
                    border: '1px solid rgba(250, 249, 246, 0.2)',
                    color: THEME.light
                  }}
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
                style={{
                  backgroundColor: THEME.primary,
                  color: THEME.light,
                  boxShadow: `0 4px 12px ${THEME.primary}50`
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div
                    className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: THEME.light }}
                  />
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </div>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: `${THEME.light}80` }}>
              New to InnerLight?{' '}
              <Link
                to="/signup"
                className="font-medium hover:underline"
                style={{ color: THEME.accent }}
              >
                Create an account
              </Link>
            </p>
            <p className="text-xs mt-3" style={{ color: `${THEME.light}60` }}>
              By continuing, you agree to our Terms and Privacy Policy
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
