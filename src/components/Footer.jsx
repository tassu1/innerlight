import { LampDesk, Github, Linkedin, MessageSquare, Users, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
const FOOTER_THEME = {
  bg: "#1A202C", // Dark slate blue
  text: "#EDF2F7", // Bright off-white
  accent: "#FF7E6B", // Your coral
  border: "#2D3748", // Deep border
  card: "#2D3748" // Elevated card color
};

export default function Footer() {
  return (
    <footer 
      className="w-full"
      style={{
        backgroundColor: FOOTER_THEME.bg,
        color: FOOTER_THEME.text
      }}
    >
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <LampDesk 
                className="w-6 h-6" 
                style={{ color: FOOTER_THEME.accent }} 
              />
              <span className="text-xl font-bold">InnerLight</span>
            </div>
            <p className="text-sm opacity-80 max-w-xs">
              Your compassionate companion for mental wellness and healing journeys.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4 pt-2">
              <a 
                href="https://www.linkedin.com/in/md-tahseen-alam-892317263/" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-black hover:bg-opacity-10 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://github.com/tassu1/innerlight" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-black hover:bg-opacity-10 transition-all"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: FOOTER_THEME.accent }}>
                Navigation
              </h3>
              <ul className="space-y-2">
                {['Home', 'Features', 'Pricing', 'About'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-sm hover:opacity-80 transition-opacity">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: FOOTER_THEME.accent }}>
                Legal
              </h3>
              <ul className="space-y-2">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-sm hover:opacity-80 transition-opacity">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: FOOTER_THEME.accent }}>
              Stay Updated
            </h3>
            <p className="text-sm opacity-80">
              Join our newsletter for mental wellness tips
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-grow px-3 py-2 rounded text-sm bg-white bg-opacity-5 border border-transparent focus:border-opacity-50 focus:outline-none"
                style={{ borderColor: FOOTER_THEME.accent }}
              />
              <button 
                className="px-4 py-2 rounded text-sm font-medium"
                style={{
                  backgroundColor: FOOTER_THEME.accent,
                  color: FOOTER_THEME.bg
                }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div 
          className="mt-12 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-2 text-sm"
          style={{ 
            borderColor: FOOTER_THEME.border,
            color: FOOTER_THEME.text
          }}
        >
          <div>
            © {new Date().getFullYear()} InnerLight. All rights reserved.
          </div>
          <div className="flex gap-4">
            <span className="opacity-70">v1.0.0</span>
            <span className="opacity-70">Made with ♥</span>
          </div>
        </div>
      </div>
    </footer>
  );
}