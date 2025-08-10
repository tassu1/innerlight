import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';


// Warm, no-blue theme
const THEME = {
  primary: "#E76F51",   // Warm coral
  secondary: "#5C4033", // Cocoa brown
  dark: "#2B2B2B",      // Charcoal
  light: "#FAF5E9",     // Cream
  accent: "#F4A261"     // Sunset orange
};

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = "http://localhost:5000";

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!name || !email || !password) {
      setError("All fields are required!");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      navigate("/login");
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
      
      

      {/* Warm Gradient Overlay */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          background: `
            radial-gradient(circle at 75% 30%, ${THEME.primary}40, transparent 50%),
            radial-gradient(circle at 25% 70%, ${THEME.accent}40, transparent 50%)
          `,
        }}
      ></div>

      {/* Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
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
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="p-3 rounded-full mb-3"
              style={{ backgroundColor: `${THEME.primary}20` }}
            >
              <UserPlus size={28} style={{ color: THEME.primary }} />
            </div>
            <h1 className="text-2xl font-bold text-center" style={{ color: THEME.light }}>
              Create Your Account
            </h1>
            <p className="text-sm mt-2 text-center" style={{ color: THEME.accent }}>
              Join our wellness community
            </p>
          </div>

          {/* Error Message */}
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
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: THEME.light }}>
                Full Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'rgba(250, 245, 233, 0.08)',
                  border: '1px solid rgba(250, 245, 233, 0.2)',
                  color: THEME.light
                }}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: THEME.light }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'rgba(250, 245, 233, 0.08)',
                  border: '1px solid rgba(250, 245, 233, 0.2)',
                  color: THEME.light
                }}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: THEME.light }}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'rgba(250, 245, 233, 0.08)',
                  border: '1px solid rgba(250, 245, 233, 0.2)',
                  color: THEME.light
                }}
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2"
              style={{
                backgroundColor: THEME.primary,
                color: THEME.light
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <div
                  className="w-5 h-5 border-2 border-t-transparent border-r-transparent rounded-full animate-spin"
                  style={{ borderColor: THEME.light }}
                />
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div
            className="mt-6 text-center text-sm"
            style={{ color: `${THEME.light}80` }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium hover:underline"
              style={{ color: THEME.accent }}
            >
              Log In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Signup;
