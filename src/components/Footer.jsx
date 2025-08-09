import { LampDesk, Github, Linkedin, MessageSquare, Users, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer 
      className="w-full"
      style={{
        backgroundColor: "#2B2B2B", // THEME.dark
        color: "#F6F1E9" // THEME.light
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
                style={{ color: "#E9C46A" }} // THEME.accentSecondary
              />
              <span className="text-xl font-bold" style={{ color: "#F6F1E9" }}>InnerLight</span>
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
                className="p-2 rounded-full transition-all hover:bg-[#E76F51] hover:bg-opacity-20"
                aria-label="LinkedIn"
                style={{ color: "#F6F1E9" }} // THEME.light
              >
                <Linkedin className="w-5 h-5 hover:text-[#E76F51]" /> {/* THEME.primary */}
              </a>
              <a 
                href="https://github.com/tassu1/innerlight" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full transition-all hover:bg-[#E76F51] hover:bg-opacity-20"
                aria-label="GitHub"
                style={{ color: "#F6F1E9" }} // THEME.light
              >
                <Github className="w-5 h-5 hover:text-[#E76F51]" /> {/* THEME.primary */}
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#E9C46A" }}> {/* THEME.accentSecondary */}
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
                    className="text-sm transition-colors hover:text-[#E9C46A]" // THEME.accentSecondary
                    style={{ color: "#F6F1E9" }} // THEME.light
                  >
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#E9C46A" }}> {/* THEME.accentSecondary */}
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
                    className="text-sm transition-colors hover:text-[#E9C46A]" // THEME.accentSecondary
                    style={{ color: "#F6F1E9" }} // THEME.light
                  >
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#E9C46A" }}> {/* THEME.accentSecondary */}
              Stay Updated
            </h3>
            <p className="text-sm opacity-80">
              Join our newsletter for mental wellness tips
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-grow px-3 py-2 rounded text-sm bg-white bg-opacity-5 border border-opacity-20 focus:border-opacity-50 focus:outline-none transition-all"
                style={{ 
                  borderColor: "#E9C46A", // THEME.accentSecondary
                  color: "#F6F1E9" // THEME.light
                }}
              />
              <motion.button 
                className="px-4 py-2 rounded text-sm font-medium"
                style={{
                  backgroundColor: "#E76F51", // THEME.primary
                  color: "#2B2B2B" // THEME.dark
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
            borderColor: "#5C4033", // THEME.secondary
            color: "#F6F1E9" // THEME.light
          }}
        >
          <div>
            © {new Date().getFullYear()} InnerLight. All rights reserved.
          </div>
          <div className="flex gap-4">
            <span className="opacity-70">v1.0.0</span>
            <span className="opacity-70">Made with <span style={{ color: "#E76F51" }}>♥</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
}