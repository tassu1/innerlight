import { motion } from "framer-motion";
import { BookHeart, Sparkles, Zap, Users, MessageSquare, Lock, Heart, BarChart2, Shield, BookOpen, Image, Award } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const THEME = {
  primary: "#FF7E6B",
  secondary: "#2F4858",
  dark: "#2A2D34",
  light: "#F7F4EA",
  accent: "#FF9E90"
};

export default function Home() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Show chat after left panel appears on mobile
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
        title: "Grounding",
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: THEME.dark, color: THEME.light }}>
      {/* 🌟 Hero Section - Mobile Optimized */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-20"
          style={{ background: `radial-gradient(circle at 20% 30%, ${THEME.primary}40, transparent 50%)` }}
        />

        <div className="max-w-7xl mx-auto py-12 md:py-24 flex flex-col lg:grid lg:grid-cols-2 gap-8 md:gap-16 items-center z-10 w-full">
          {/* Left Panel - Appears first on mobile */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{
                background: `${THEME.primary}10`,
                border: `1px solid ${THEME.primary}30`
              }}
            >
              <Zap className="w-4 h-4" style={{ color: THEME.primary }} />
              <span className="text-sm font-medium" style={{ color: THEME.primary }}>
                Now with group therapy
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-tight mb-6">
              <span className="block font-medium mb-3" style={{ color: THEME.primary }}>
                You deserve support
              </span>
              <span className="block font-medium">that evolves with you</span>
            </h1>

            <p className="text-lg md:text-xl mb-8 max-w-xl opacity-80">
              InnerLight combines <span style={{ color: THEME.primary }}>AI-powered therapy</span> with <span className="underline" style={{ textDecorationColor: THEME.primary }}>authentic human connection</span>.
            </p>

            <div className="flex flex-wrap gap-4 mb-8 md:mb-12">
              <button
                onClick={() => navigate("/signup")}
                className="px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all text-sm sm:text-base"
                style={{
                  background: THEME.primary,
                  color: THEME.light
                }}
              >
                <BookHeart className="w-5 h-5" />
                Start Free Trial
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all border text-sm sm:text-base"
                style={{
                  borderColor: `${THEME.light}30`,
                  color: THEME.light
                }}
              >
                Sign In
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["👩", "🧔", "👩🏾", "🧑🏽"].map((emoji, i) => (
                    <div 
                      key={i} 
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border"
                      style={{
                        backgroundColor: THEME.secondary,
                        borderColor: `${THEME.light}10`
                      }}
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
                <span>1k+ active healers</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" style={{ color: THEME.primary }} />
                <span>HIPAA compliant</span>
              </div>
            </div>
          </motion.div>

          {/* Right Panel - Chat Messages - Appears after left panel on mobile */}
          {showChat && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-full mt-8 lg:mt-0"
            >
              <div 
                className="absolute inset-0 rounded-xl lg:rounded-3xl backdrop-blur-sm border"
                style={{
                  background: `${THEME.primary}05`,
                  borderColor: `${THEME.primary}20`
                }}
              />
              <div className="relative p-4 sm:p-6">
                <div 
                  className="rounded-xl overflow-hidden shadow-xl"
                  style={{ backgroundColor: THEME.secondary }}
                >
                  <div 
                    className="p-3 sm:p-4 border-b flex items-center gap-2"
                    style={{ borderColor: `${THEME.primary}10` }}
                  >
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: THEME.primary }} />
                    <span className="text-xs ml-2" style={{ color: `${THEME.light}60` }}>
                      InnerLight AI
                    </span>
                  </div>
                  <div 
                    className="p-3 sm:p-4 space-y-3 sm:space-y-4 h-64 sm:h-80 md:h-96 overflow-y-auto"
                    style={{ backgroundColor: THEME.secondary }}
                  >
                    {chatMessages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          delay: isMobile ? msg.delay + 1 : msg.delay,
                          type: "spring",
                          stiffness: 100
                        }}
                        className={`flex gap-2 sm:gap-3 ${msg.speaker === "User" ? "justify-end" : ""}`}
                      >
                        {msg.speaker === "AI" && (
                          <div 
                            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{
                              backgroundColor: `${THEME.primary}10`,
                              color: THEME.primary
                            }}
                          >
                            <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                          </div>
                        )}
                        <div 
                          className={`rounded-lg p-2 sm:p-3 max-w-[80%] text-xs sm:text-sm`}
                          style={{
                            backgroundColor: msg.speaker === "AI" 
                              ? `${THEME.primary}10` 
                              : `${THEME.light}10`,
                            color: THEME.light
                          }}
                        >
                          <p>{msg.message}</p>
                          {msg.exercise && !isMobile && (
                            <div 
                              className="mt-2 rounded p-2 text-xs sm:text-sm"
                              style={{
                                backgroundColor: `${THEME.primary}20`,
                                borderLeft: `3px solid ${THEME.primary}`
                              }}
                            >
                              <p className="font-medium" style={{ color: THEME.primary }}>
                                {msg.exercise.title}
                              </p>
                              <p>{msg.exercise.steps}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ✨ All Features Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl md:text-4xl font-light mb-4"
          >
            <span style={{ color: THEME.primary }}>Everything</span> you need to heal
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="max-w-2xl mx-auto opacity-80 text-sm sm:text-base"
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
              className="rounded-xl p-4 sm:p-6 border transition-all"
              style={{
                backgroundColor: `${THEME.secondary}80`,
                borderColor: `${THEME.primary}20`
              }}
            >
              <div 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg mb-3 sm:mb-4 flex items-center justify-center"
                style={{
                  backgroundColor: `${THEME.primary}10`,
                  color: THEME.primary
                }}
              >
                {feature.icon}
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-medium mb-2 sm:mb-3">{feature.title}</h3>
              <p className="opacity-80 text-xs sm:text-sm mb-3 sm:mb-4">{feature.description}</p>
              <ul className="space-y-1 sm:space-y-2">
                {feature.highlights.map((highlight, hi) => (
                  <li key={hi} className="flex items-start">
                    <div 
                      className="w-1.5 h-1.5 rounded-full mt-1.5 sm:mt-2 mr-1.5 sm:mr-2 flex-shrink-0"
                      style={{ backgroundColor: THEME.primary }}
                    />
                    <span className="text-xs sm:text-sm opacity-80">{highlight}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 💬 More AI Chat Examples */}
      <section 
        className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: THEME.secondary }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12 sm:mb-16"
          >
            <MessageSquare 
              className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-3 sm:mb-4" 
              style={{ color: THEME.primary }} 
            />
            <h2 className="text-2xl sm:text-3xl font-light mb-2 sm:mb-3">
              <span style={{ color: THEME.primary }}>AI Companion</span> Examples
            </h2>
            <p className="opacity-80 text-sm sm:text-base">
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
                className="rounded-xl p-4 sm:p-6 border"
                style={{
                  backgroundColor: THEME.dark,
                  borderColor: `${THEME.primary}20`
                }}
              >
                <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4" style={{ color: THEME.primary }}>
                  {example.title}
                </h3>
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
                            backgroundColor: `${THEME.primary}10`,
                            color: THEME.primary
                          }}
                        >
                          <MessageSquare className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        </div>
                      )}
                      <div 
                        className={`rounded-lg p-2 sm:p-3 max-w-[80%] text-xs sm:text-sm`}
                        style={{
                          backgroundColor: msg.speaker === "AI" 
                            ? `${THEME.primary}10` 
                            : `${THEME.light}10`,
                          color: THEME.light
                        }}
                      >
                        <p>{msg.message}</p>
                        {msg.exercise && (
                          <div 
                            className="mt-2 rounded p-2 text-xs sm:text-sm"
                            style={{
                              backgroundColor: `${THEME.primary}20`,
                              borderLeft: `3px solid ${THEME.primary}`
                            }}
                          >
                            <p className="font-medium" style={{ color: THEME.primary }}>
                              {msg.exercise.title}
                            </p>
                            <p>{msg.exercise.steps}</p>
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

      {/* Testimonials Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <Heart 
            className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-3 sm:mb-4" 
            style={{ color: THEME.primary }} 
          />
          <h2 className="text-2xl sm:text-3xl font-light mb-2 sm:mb-3">
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
              className="rounded-xl p-4 sm:p-6 border"
              style={{
                backgroundColor: `${THEME.secondary}80`,
                borderColor: `${THEME.primary}20`
              }}
            >
              <div 
                className="text-3xl mb-3 sm:mb-4"
                style={{ color: THEME.primary }}
              >
                {testimonial.avatar}
              </div>
              <p className="italic mb-3 sm:mb-4 text-xs sm:text-sm">"{testimonial.quote}"</p>
              <div>
                <p className="font-medium text-sm sm:text-base">{testimonial.author}</p>
                <p className="opacity-60 text-xs sm:text-sm">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section 
        className="py-12 sm:py-20 px-4 sm:px-6 text-center relative overflow-hidden"
        style={{ backgroundColor: THEME.dark }}
      >
        <div 
          className="absolute inset-0 opacity-10"
          style={{ 
            background: `url('https://grainy-gradients.vercel.app/noise.svg')`
          }}
        />
        <div className="max-w-3xl mx-auto relative">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity
            }}
            className="inline-block mb-6 sm:mb-8"
          >
            <Sparkles 
              className="w-8 h-8 sm:w-10 sm:h-10 mx-auto" 
              style={{ color: THEME.primary }} 
            />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light mb-4 sm:mb-6">
            Ready to <span style={{ color: THEME.primary }}>begin healing</span>?
          </h2>
          <p className="text-sm sm:text-base md:text-lg opacity-80 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join thousands finding support through compassionate technology.
          </p>
          <motion.button
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/signup")}
            className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium flex items-center gap-2 mx-auto transition-all text-sm sm:text-base"
            style={{
              backgroundColor: THEME.primary,
              color: THEME.light
            }}
          >
            <BookHeart className="w-4 h-4 sm:w-5 sm:h-5" />
            Get Started — Free Forever
          </motion.button>
        </div>
      </section>
    </div>
  );
}