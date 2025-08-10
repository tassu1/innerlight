import { LampDesk, Github, Linkedin, MessageSquare, Users, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const THEME = {
  primary: "#6D28D9",       // Deep purple
  secondary: "#1E1B4B",     // Dark indigo
  dark: "#0F172A",          // Very dark blue (almost black)
  light: "#E2E8F0",         // Soft light text
  accentPrimary: "#7C3AED",  // Vibrant purple
  accentSecondary: "#4C1D95", // Deep purple
  textPrimary: "#F8FAFC",    // Pure white text
  textSecondary: "#94A3B8",  // Light gray-blue text
  cardBg: "rgba(30, 27, 75, 0.5)", // Semi-transparent dark indigo
  border: "rgba(124, 58, 237, 0.2)" // Purple border with transparency
};

export default function Footer() {
  return (
    <footer 
      className="w-full bg-opacity-90"
      style={{
        backgroundColor: THEME.secondary,
        color: THEME.textPrimary
      }}
    >
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <LampDesk 
                className="w-6 h-6" 
                style={{ color: THEME.accentPrimary }}
              />
              <span className="text-xl font-bold" style={{ color: THEME.textPrimary }}>
                InnerLight
              </span>
            </div>
            <p className="text-sm opacity-80 max-w-xs" style={{ color: THEME.textSecondary }}>
              Your compassionate companion for mental wellness and healing journeys.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4 pt-2">
              <a 
                href="https://www.linkedin.com/in/md-tahseen-alam-892317263/" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full transition-all hover:bg-theme-primary/20"
                aria-label="LinkedIn"
                style={{ color: THEME.textPrimary }}
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://github.com/tassu1/innerlight" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full transition-all hover:bg-theme-primary/20"
                aria-label="GitHub"
                style={{ color: THEME.textPrimary }}
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: THEME.accentPrimary }}>
              Navigation
            </h3>
            <ul className="space-y-2">
              {['Home', 'Features', 'Pricing', 'About'].map(item => (
                <motion.li 
                  key={item}
                  whileHover={{ x: 2 }}
                >
                  <a 
                    href="#" 
                    className="text-sm transition-colors"
                    style={{ 
                      color: THEME.textPrimary,
                      hover: { color: THEME.accentPrimary }
                    }}
                  >
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: THEME.accentPrimary }}>
              Resources
            </h3>
            <ul className="space-y-2">
              {['Blog', 'Guides', 'Community', 'FAQ'].map(item => (
                <motion.li 
                  key={item}
                  whileHover={{ x: 2 }}
                >
                  <a 
                    href="#" 
                    className="text-sm transition-colors"
                    style={{ 
                      color: THEME.textPrimary,
                      hover: { color: THEME.accentPrimary }
                    }}
                  >
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: THEME.accentPrimary }}>
              Stay Updated
            </h3>
            <p className="text-sm opacity-80" style={{ color: THEME.textSecondary }}>
              Join our newsletter for mental wellness tips
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-grow px-3 py-2 rounded text-sm bg-white bg-opacity-5 border focus:outline-none transition-all"
                style={{ 
                  borderColor: THEME.border,
                  color: THEME.textPrimary,
                  backgroundColor: THEME.cardBg
                }}
              />
              <motion.button 
                className="px-4 py-2 rounded text-sm font-medium"
                style={{
                  backgroundColor: THEME.accentPrimary,
                  color: THEME.textPrimary
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div 
          className="mt-12 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-2 text-sm"
          style={{ 
            borderColor: THEME.border,
            color: THEME.textPrimary
          }}
        >
          <div>
            © {new Date().getFullYear()} InnerLight. All rights reserved.
          </div>
          <div className="flex gap-4">
            <span className="opacity-70" style={{ color: THEME.textSecondary }}>v1.0.0</span>
            <span className="opacity-70" style={{ color: THEME.textSecondary }}>
              Made with <span style={{ color: THEME.primary }}>♥</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}