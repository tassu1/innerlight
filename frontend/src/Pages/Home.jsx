import { motion } from "framer-motion";
import { BookHeart, Sparkles, Zap, Users, MessageSquare, Lock, Heart, BarChart2, Shield, BookOpen, Image, Award } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

export default function Home() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [activeBubble, setActiveBubble] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    
    const timer = setTimeout(() => setShowChat(true), isMobile ? 1000 : 0);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [isMobile]);

  const chatMessages = [
    {
      speaker: "AI",
      message: "Welcome back! I noticed you journaled about work stress yesterday. Would you like to explore that further?",
      delay: 0.5
    },
    {
      speaker: "User",
      message: "Yes, I'm still feeling overwhelmed with my project deadline.",
      delay: 1.5
    },
    {
      speaker: "AI",
      message: "That sounds really challenging. Before we problem-solve, let's ground ourselves with a quick exercise:",
      delay: 2.5,
      exercise: {
        title: "Grounding Technique",
        steps: "Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste"
      }
    },
    {
      speaker: "User",
      message: "I did the exercise. My heart rate feels slower now. Thank you.",
      delay: 4
    },
    {
      speaker: "AI",
      message: "Wonderful! Now, about your project - would breaking it into smaller tasks help? I can guide you through prioritization.",
      delay: 5
    }
  ];

  const chatExamples = [
    {
      title: "Anxiety Support",
      icon: "🧘‍♀️",
      messages: [
        {
          speaker: "User",
          message: "I'm feeling really anxious about my presentation tomorrow.",
          delay: 0.5
        },
        {
          speaker: "AI",
          message: "I hear you. Public speaking is a common anxiety trigger. Let's try a visualization exercise:",
          delay: 1.5,
          exercise: {
            title: "Success Visualization",
            steps: "Close your eyes and imagine yourself presenting confidently, receiving positive feedback"
          }
        }
      ]
    },
    {
      title: "Relationship Advice",
      icon: "💑",
      messages: [
        {
          speaker: "User",
          message: "My partner and I keep arguing about chores.",
          delay: 0.5
        },
        {
          speaker: "AI",
          message: "Household responsibilities can be stressful. Would you like to try a communication framework?",
          delay: 1.5,
          exercise: {
            title: "Non-Violent Communication",
            steps: "1. Observe without judgment 2. Name your feeling 3. Identify your need 4. Make a request"
          }
        }
      ]
    },
    {
      title: "Sleep Issues",
      icon: "🌙",
      messages: [
        {
          speaker: "User",
          message: "I can't stop worrying when I try to sleep.",
          delay: 0.5
        },
        {
          speaker: "AI",
          message: "Let's practice a bedtime relaxation technique:",
          delay: 1.5,
          exercise: {
            title: "4-7-8 Breathing",
            steps: "Inhale 4 sec, hold 7 sec, exhale 8 sec. Repeat 4 times"
          }
        }
      ]
    }
  ];

 const testimonials = [
    {
      quote: "The AI companion helped me through my divorce when I had no one else to talk to at 3am.",
      author: "Sarah T.",
      role: "Marketing Director",
      avatar: "👩‍💼"
    },
    {
      quote: "As a veteran with PTSD, the grounding exercises have prevented countless panic attacks.",
      author: "Marcus R.",
      role: "Military Veteran",
      avatar: "🎖️"
    },
    {
      quote: "My teen daughter actually opens up to the AI when she won't talk to me or her therapist.",
      author: "Lisa & Tom",
      role: "Parents",
      avatar: "👨‍👩‍👧"
    },
    {
      quote: "The mood tracking revealed my depressive episodes were tied to my menstrual cycle.",
      author: "Priya K.",
      role: "Graphic Designer",
      avatar: "🧑‍🎨"
    },
    {
      quote: "I recommend InnerLight to all my patients as supplemental care between sessions.",
      author: "Dr. Elena M.",
      role: "Clinical Psychologist",
      avatar: "👩‍⚕️"
    },
    {
      quote: "Found my people in the ADHD support group after years of feeling misunderstood.",
      author: "Jamie L.",
      role: "College Student",
      avatar: "🧑‍🎓"
    }
  ];



   const features = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Therapeutic Community",
      description: "Safe spaces for shared healing journeys",
      highlights: ["Anonymous posting", "Topic-based groups", "Peer support"]
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Connection Circles",
      description: "Curated support networks",
      highlights: ["Friend matching", "Group activities", "Accountability partners"]
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "AI Companion",
      description: "Your 24/7 mental health ally",
      highlights: ["Crisis support", "Personalized coping tools", "Multilingual"]
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Mood Journal",
      description: "Track your emotional patterns",
      highlights: ["Custom tags", "Therapist exports", "Trend analysis"]
    },
    {
      icon: <Image className="w-6 h-6" />,
      title: "Safe Sharing",
      description: "Express yourself authentically",
      highlights: ["Trigger warnings", "Content moderation", "Private/public options"]
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Ironclad Privacy",
      description: "Your safety comes first",
      highlights: ["End-to-end encryption", "Data controls", "Incognito mode"]
    },
    {
      icon: <BarChart2 className="w-6 h-6" />,
      title: "Progress Dashboard",
      description: "Visualize your growth",
      highlights: ["Wellness metrics", "Activity streaks", "Custom goals"]
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Achievements",
      description: "Celebrate your milestones",
      highlights: ["Healing badges", "Progress rewards", "Community recognition"]
    }
  ];

  // Animated floating bubbles for background
 

  // Animated chat bubble component
  const AnimatedChatBubble = ({ message, speaker, exercise, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          delay: isMobile ? message.delay + 1 : message.delay,
          type: "spring",
          stiffness: 100,
          damping: 10
        }}
        whileHover={{ 
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
        onHoverStart={() => setActiveBubble(index)}
        onHoverEnd={() => setActiveBubble(null)}
        className={`flex gap-2 sm:gap-3 ${speaker === "User" ? "justify-end" : ""}`}
      >
        {speaker === "AI" && (
          <motion.div 
            animate={{
              scale: activeBubble === index ? 1.1 : 1,
              rotate: activeBubble === index ? 5 : 0
            }}
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.accentPrimary} 100%)`,
              color: THEME.textPrimary
            }}
          >
            <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
          </motion.div>
        )}
        <motion.div 
          className={`rounded-lg p-2 sm:p-3 max-w-[80%] text-xs sm:text-sm relative overflow-hidden`}
          style={{
            background: speaker === "AI" 
              ? `linear-gradient(135deg, rgba(109, 40, 217, 0.3) 0%, rgba(30, 27, 75, 0.5) 100%)` 
              : `linear-gradient(135deg, rgba(30, 27, 75, 0.5) 0%, rgba(124, 58, 237, 0.3) 100%)`,
            color: THEME.textPrimary,
            backdropFilter: "blur(10px)",
            border: `1px solid ${THEME.border}`
          }}
        >
          {/* Animated border effect on hover */}
          {activeBubble === index && (
            <motion.div 
              className="absolute inset-0 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                background: `linear-gradient(90deg, transparent, ${THEME.accentPrimary}40, transparent)`,
                border: `1px solid ${THEME.accentPrimary}`
              }}
            />
          )}
          <p>{message}</p>
          {exercise && !isMobile && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ delay: 0.3 }}
              className="mt-2 rounded p-2 text-xs sm:text-sm"
              style={{
                background: `linear-gradient(135deg, ${THEME.secondary} 0%, ${THEME.primary}20 100%)`,
                borderLeft: `3px solid ${THEME.accentPrimary}`
              }}
            >
              <p className="font-medium" style={{ color: THEME.accentPrimary }}>
                {exercise.title}
              </p>
              <p style={{ color: THEME.textSecondary }}>{exercise.steps}</p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: THEME.dark, color: THEME.light }}>
      {/* 🌌 Deep Gradient Hero Section with Glass Morphism */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Animated gradient background */}
        <motion.div 
          className="absolute inset-0"
          animate={{
            background: [
              `radial-gradient(circle at 10% 20%, ${THEME.secondary} 0%, ${THEME.dark} 50%)`,
              `radial-gradient(circle at 90% 30%, ${THEME.primary}20 0%, ${THEME.dark} 50%)`,
              `radial-gradient(circle at 50% 80%, ${THEME.accentSecondary}20 0%, ${THEME.dark} 50%)`,
              `radial-gradient(circle at 10% 20%, ${THEME.secondary} 0%, ${THEME.dark} 50%)`
            ]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
       

        <div className="max-w-7xl mx-auto py-12 md:py-24 flex flex-col lg:grid lg:grid-cols-2 gap-8 md:gap-16 items-center z-10 w-full">
          {/* Left Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{
                background: `linear-gradient(90deg, ${THEME.primary}20, ${THEME.accentPrimary}20)`,
                border: `1px solid ${THEME.primary}30`,
                color: THEME.light,
                backdropFilter: "blur(5px)"
              }}
              whileHover={{ scale: 1.05 }}
            >
              <Zap className="w-4 h-4" style={{ color: THEME.accentPrimary }} />
              <span className="text-sm font-medium">
                Now with group therapy
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-tight mb-6" style={{ color: THEME.textPrimary }}>
              <span className="block font-medium mb-3">
                You deserve support
              </span>
              <span className="block font-medium">that evolves with you</span>
            </h1>

            <p className="text-lg md:text-xl mb-8 max-w-xl opacity-90" style={{ color: THEME.textSecondary }}>
              InnerLight combines <span className="font-medium" style={{ color: THEME.accentPrimary }}>AI-powered therapy</span> with <span className="underline" style={{ textDecorationColor: THEME.accentPrimary }}>authentic human connection</span>.
            </p>

            <div className="flex flex-wrap gap-4 mb-8 md:mb-12">
              <motion.button
                whileHover={{ 
                  y: -4,
                  background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.accentPrimary} 100%)`,
                  boxShadow: `0 8px 20px ${THEME.accentPrimary}80`
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/signup")}
                className="px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all text-sm sm:text-base"
                style={{
                  background: THEME.primary,
                  color: THEME.textPrimary,
                  boxShadow: `0 4px 14px ${THEME.primary}40`
                }}
              >
                <BookHeart className="w-5 h-5" />
                Start Free Trial
              </motion.button>
              <motion.button
                whileHover={{ 
                  y: -4,
                  background: `${THEME.primary}20`,
                  borderColor: THEME.accentPrimary,
                  backdropFilter: "blur(5px)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/login")}
                className="px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all border text-sm sm:text-base"
                style={{
                  borderColor: `${THEME.light}60`,
                  color: THEME.light,
                  backdropFilter: "blur(5px)"
                }}
              >
                Sign In
              </motion.button>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm" style={{ color: THEME.textSecondary }}>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["👩", "🧔", "👩🏾", "🧑🏽"].map((emoji, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ y: -5, scale: 1.1 }}
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border"
                      style={{
                        backgroundColor: THEME.cardBg,
                        borderColor: `${THEME.light}30`,
                        color: THEME.light,
                        backdropFilter: "blur(5px)"
                      }}
                    >
                      {emoji}
                    </motion.div>
                  ))}
                </div>
                <span>1k+ active healers</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" style={{ color: THEME.accentPrimary }} />
                <span>HIPAA compliant</span>
              </div>
            </div>
          </motion.div>

          {/* Right Panel - Chat Messages with Glass Effect */}
          {showChat && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-full mt-8 lg:mt-0"
            >
              <div 
                className="absolute inset-0 rounded-xl lg:rounded-3xl backdrop-blur-lg border"
                style={{
                  background: `${THEME.cardBg}80`,
                  borderColor: `${THEME.primary}30`,
                  boxShadow: `0 10px 30px ${THEME.primary}20`
                }}
              />
              <div className="relative p-4 sm:p-6">
                <motion.div 
                  whileHover={{ 
                    y: -5,
                    boxShadow: `0 15px 30px ${THEME.primary}40`
                  }}
                  className="rounded-xl overflow-hidden shadow-xl"
                  style={{ 
                    background: `linear-gradient(135deg, ${THEME.secondary}80 0%, ${THEME.primary}20 100%)`,
                    backdropFilter: "blur(10px)",
                    border: `1px solid ${THEME.border}`
                  }}
                >
                  <div 
                    className="p-3 sm:p-4 border-b flex items-center gap-2"
                    style={{ 
                      borderColor: `${THEME.primary}10`,
                      background: `linear-gradient(90deg, ${THEME.primary} 0%, ${THEME.accentPrimary} 100%)`,
                      color: THEME.textPrimary
                    }}
                  >
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.6, 1, 0.6]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity
                      }}
                      className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" 
                      style={{ backgroundColor: THEME.accentPrimary }} 
                    />
                    <span className="text-xs ml-2">
                      InnerLight AI
                    </span>
                  </div>
                  <div 
                    className="p-3 sm:p-4 space-y-3 sm:space-y-4 h-64 sm:h-80 md:h-96 overflow-y-auto"
                    style={{ backgroundColor: "rgba(15, 23, 42, 0.3)" }}
                  >
                    {chatMessages.map((msg, i) => (
                      <AnimatedChatBubble 
                        key={i}
                        message={msg.message} 
                        speaker={msg.speaker} 
                        exercise={msg.exercise}
                        index={i}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ✨ All Features Section with Glass Cards */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl md:text-4xl font-light mb-4"
            style={{ color: THEME.textPrimary }}
          >
            <span style={{ color: THEME.primary }}>Everything</span> you need to heal
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="max-w-2xl mx-auto opacity-80 text-sm sm:text-base"
            style={{ color: THEME.textSecondary }}
          >
            Clinically validated tools designed with mental health professionals
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="rounded-xl p-4 sm:p-6 border transition-all hover:shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${THEME.cardBg}, ${THEME.secondary}80)`,
                borderColor: `${THEME.primary}20`,
                boxShadow: `0 4px 6px ${THEME.secondary}10`,
                backdropFilter: "blur(10px)"
              }}
            >
              <div 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg mb-3 sm:mb-4 flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.accentPrimary} 100%)`,
                  color: THEME.textPrimary
                }}
              >
                {feature.icon}
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-medium mb-2 sm:mb-3" style={{ color: THEME.textPrimary }}>{feature.title}</h3>
              <p className="opacity-80 text-xs sm:text-sm mb-3 sm:mb-4" style={{ color: THEME.textSecondary }}>{feature.description}</p>
              <ul className="space-y-1 sm:space-y-2">
                {feature.highlights.map((highlight, hi) => (
                  <li key={hi} className="flex items-start">
                    <motion.div 
                      whileHover={{ scale: 1.3 }}
                      className="w-1.5 h-1.5 rounded-full mt-1.5 sm:mt-2 mr-1.5 sm:mr-2 flex-shrink-0"
                      style={{ backgroundColor: THEME.primary }}
                    />
                    <span className="text-xs sm:text-sm opacity-80" style={{ color: THEME.textSecondary }}>{highlight}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 💬 More AI Chat Examples with Glass Effect */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E1B4B] to-[#0F172A]" />
       
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12 sm:mb-16"
          >
            <MessageSquare 
              className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-3 sm:mb-4" 
              style={{ color: THEME.accentPrimary }} 
            />
            <h2 className="text-2xl sm:text-3xl font-light mb-2 sm:mb-3" style={{ color: THEME.textPrimary }}>
              <span style={{ color: THEME.accentPrimary }}>AI Companion</span> Examples
            </h2>
            <p className="opacity-80 text-sm sm:text-base" style={{ color: THEME.textSecondary }}>
              See how our therapeutic AI responds in different situations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {chatExamples.map((example, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -5 }}
                className="rounded-xl p-4 sm:p-6 border hover:shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${THEME.cardBg}, ${THEME.secondary}80)`,
                  borderColor: `${THEME.primary}20`,
                  color: THEME.textPrimary,
                  boxShadow: `0 4px 6px ${THEME.secondary}20`,
                  backdropFilter: "blur(10px)"
                }}
              >
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="text-2xl">{example.icon}</div>
                  <h3 className="text-base sm:text-lg font-medium" style={{ color: THEME.primary }}>
                    {example.title}
                  </h3>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  {example.messages.map((msg, mi) => (
                    <div
                      key={mi}
                      className={`flex gap-2 sm:gap-3 ${msg.speaker === "User" ? "justify-end" : ""}`}
                    >
                      {msg.speaker === "AI" && (
                        <div 
                          className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.accentPrimary} 100%)`,
                            color: THEME.textPrimary
                          }}
                        >
                          <MessageSquare className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        </div>
                      )}
                      <div 
                        className={`rounded-lg p-2 sm:p-3 max-w-[80%] text-xs sm:text-sm`}
                        style={{
                          background: msg.speaker === "AI" 
                            ? `linear-gradient(135deg, ${THEME.primary}20 0%, ${THEME.secondary}80 100%)` 
                            : `linear-gradient(135deg, ${THEME.secondary}80 0%, ${THEME.primary}20 100%)`,
                          color: THEME.textPrimary,
                          backdropFilter: "blur(5px)",
                          border: `1px solid ${THEME.border}`
                        }}
                      >
                        <p>{msg.message}</p>
                        {msg.exercise && (
                          <div 
                            className="mt-2 rounded p-2 text-xs sm:text-sm"
                            style={{
                              background: `linear-gradient(135deg, ${THEME.secondary} 0%, ${THEME.primary}20 100%)`,
                              borderLeft: `3px solid ${THEME.accentPrimary}`
                            }}
                          >
                            <p className="font-medium" style={{ color: THEME.accentPrimary }}>
                              {msg.exercise.title}
                            </p>
                            <p style={{ color: THEME.textSecondary }}>{msg.exercise.steps}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section with Glass Cards */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] to-[#1E1B4B]" />
    
        
        <div className="relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <Heart 
              className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-3 sm:mb-4" 
              style={{ color: THEME.primary }} 
            />
            <h2 className="text-2xl sm:text-3xl font-light mb-2 sm:mb-3" style={{ color: THEME.textPrimary }}>
              Real <span style={{ color: THEME.primary }}>stories</span> from our community
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="rounded-xl p-4 sm:p-6 border hover:shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${THEME.cardBg}, ${THEME.secondary}80)`,
                  borderColor: `${THEME.primary}20`,
                  boxShadow: `0 4px 6px ${THEME.secondary}10`,
                  backdropFilter: "blur(10px)"
                }}
              >
                <div 
                  className="text-3xl mb-3 sm:mb-4"
                  style={{ color: THEME.primary }}
                >
                  {testimonial.avatar}
                </div>
                <p className="italic mb-3 sm:mb-4 text-xs sm:text-sm" style={{ color: THEME.textPrimary }}>"{testimonial.quote}"</p>
                <div>
                  <p className="font-medium text-sm sm:text-base" style={{ color: THEME.textPrimary }}>{testimonial.author}</p>
                  <p className="opacity-60 text-xs sm:text-sm" style={{ color: THEME.textSecondary }}>{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

   
      {/* Final CTA */}
<section className="py-16 sm:py-24 px-4 sm:px-6 text-center" 
         style={{ backgroundColor: THEME.dark }}>
  <div className="max-w-2xl mx-auto">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h2 className="text-2xl sm:text-3xl font-light mb-6" style={{ color: THEME.textPrimary }}>
        Ready to begin your healing journey?
      </h2>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <motion.button
          whileHover={{ y: -2, backgroundColor: THEME.accentPrimary }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/signup")}
          className="px-8 py-3 rounded-lg font-medium flex items-center gap-2"
          style={{
            backgroundColor: THEME.primary,
            color: THEME.textPrimary
          }}
        >
          <BookHeart className="w-5 h-5" />
          Get Started
        </motion.button>
        
        <motion.button
          whileHover={{ y: -2, borderColor: THEME.accentPrimary }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/about")}
          className="px-8 py-3 rounded-lg font-medium border"
          style={{
            borderColor: `${THEME.textPrimary}40`,
            color: THEME.textPrimary
          }}
        >
          How It Works
        </motion.button>
      </div>
      
      <p className="mt-6 text-sm opacity-70" style={{ color: THEME.textSecondary }}>
        Free forever. No credit card required.
      </p>
    </motion.div>
  </div>
</section>
    </div>
  );
}