import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Trash2, Send, Users } from "lucide-react";

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

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ── Skeleton ──────────────────────────────────────────────────
function SkeletonCard({ index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="rounded-xl p-5 border animate-pulse"
      style={{
        background: `linear-gradient(135deg, ${THEME.cardBg}, ${THEME.secondary}80)`,
        borderColor: `${THEME.primary}20`,
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full" style={{ background: `${THEME.primary}30` }} />
        <div className="h-3 w-24 rounded-full" style={{ background: `${THEME.primary}20` }} />
        <div className="h-3 w-14 rounded-full ml-auto" style={{ background: `${THEME.primary}20` }} />
      </div>
      <div className="space-y-2 mb-4">
        {[1, 0.8, 0.6].map((w, i) => (
          <div key={i} className="h-3 rounded-full" style={{ width: `${w * 100}%`, background: `${THEME.primary}15` }} />
        ))}
      </div>
      <div className="h-px mt-4" style={{ background: `${THEME.border}` }} />
    </motion.div>
  );
}

// ── Comment ───────────────────────────────────────────────────
function CommentItem({ comment, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex gap-3"
    >
      <div
        className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: THEME.accentPrimary, boxShadow: `0 0 6px ${THEME.accentPrimary}60` }}
      />
      <div>
        <span className="text-[11px] block mb-0.5" style={{ color: THEME.textSecondary }}>
          Anonymous · {timeAgo(comment.createdAt)}
        </span>
        <p className="text-sm leading-relaxed" style={{ color: THEME.textPrimary }}>
          {comment.text}
        </p>
      </div>
    </motion.div>
  );
}

// ── Post Card ─────────────────────────────────────────────────
function PostCard({ post, onDelete, index }) {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState("");
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [hovered, setHovered] = useState(false);
  const inputRef = useRef(null);

  const toggleComments = () => {
    setOpen((v) => !v);
    if (!open) setTimeout(() => inputRef.current?.focus(), 250);
  };

  const handleComment = async () => {
    const text = commentText.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      const res = await fetch(`${API}/api/forum/posts/${post._id}/comments`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.success) {
        setComments((prev) => [...prev, data.comment]);
        setCommentText("");
      }
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API}/api/forum/posts/${post._id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) onDelete(post._id);
      else setDeleting(false);
    } catch {
      setDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="rounded-xl border transition-all duration-300"
      style={{
        background: `linear-gradient(135deg, ${THEME.cardBg}, ${THEME.secondary}80)`,
        borderColor: hovered ? `${THEME.primary}50` : `${THEME.primary}20`,
        boxShadow: hovered ? `0 8px 24px ${THEME.primary}20` : `0 4px 6px ${THEME.secondary}10`,
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.accentPrimary} 100%)`,
                color: THEME.textPrimary,
              }}
            >
              <Users className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm" style={{ color: THEME.textSecondary }}>Anonymous</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: THEME.textSecondary }}>
              {timeAgo(post.createdAt)}
            </span>
            {post.isOwner && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDelete}
                disabled={deleting}
                className="p-1.5 rounded-lg transition-all duration-200"
                style={{ color: THEME.textSecondary }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
                onMouseLeave={(e) => (e.currentTarget.style.color = THEME.textSecondary)}
              >
                {deleting
                  ? <span className="text-xs">…</span>
                  : <Trash2 className="w-3.5 h-3.5" />
                }
              </motion.button>
            )}
          </div>
        </div>

        {/* Content */}
        <p
          className="text-sm leading-relaxed mb-4 whitespace-pre-wrap"
          style={{ color: THEME.textPrimary }}
        >
          {post.content}
        </p>

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-3"
          style={{ borderTop: `1px solid ${THEME.border}` }}
        >
          <motion.button
            whileHover={{ x: 2 }}
            onClick={toggleComments}
            className="flex items-center gap-2 text-xs transition-colors duration-200"
            style={{ color: open ? THEME.accentPrimary : THEME.textSecondary }}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            {comments.length > 0
              ? `${comments.length} ${comments.length === 1 ? "response" : "responses"}`
              : "Respond with kindness"}
          </motion.button>

          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: THEME.primary, boxShadow: `0 0 6px ${THEME.primary}` }}
          />
        </div>
      </div>

      {/* Comments Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div
              className="px-5 pb-5 pt-4 space-y-3"
              style={{
                borderTop: `1px solid ${THEME.border}`,
                background: `linear-gradient(135deg, ${THEME.secondary}60, ${THEME.primary}10)`,
              }}
            >
              {comments.length === 0 && (
                <p className="text-xs italic" style={{ color: THEME.textSecondary }}>
                  Be the first to say something kind…
                </p>
              )}

              {comments.map((c, i) => (
                <CommentItem key={c._id} comment={c} index={i} />
              ))}

              {/* Comment input */}
              <div className="flex gap-2 pt-2">
                <input
                  ref={inputRef}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleComment()}
                  placeholder="Say something warm…"
                  maxLength={400}
                  className="flex-1 rounded-lg px-3 py-2 text-xs outline-none transition-all duration-200"
                  style={{
                    background: `${THEME.secondary}80`,
                    border: `1px solid ${THEME.border}`,
                    color: THEME.textPrimary,
                    backdropFilter: "blur(5px)",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = `${THEME.accentPrimary}60`)
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = THEME.border)
                  }
                />
                <motion.button
                  whileHover={{ y: -1, boxShadow: `0 4px 14px ${THEME.primary}40` }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleComment}
                  disabled={sending}
                  className="px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-200"
                  style={{
                    background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.accentPrimary} 100%)`,
                    color: THEME.textPrimary,
                    opacity: sending ? 0.6 : 1,
                  }}
                >
                  {sending
                    ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <><Send className="w-3 h-3" /> Send</>
                  }
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Create Post ───────────────────────────────────────────────
function CreatePostBox({ onCreated }) {
  const [content, setContent] = useState("");
  const [focused, setFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const maxLen = 800;
  const pct = content.length / maxLen;
  const circumference = 2 * Math.PI * 8;
  const ringColor = pct > 0.9 ? "#f87171" : pct > 0.7 ? "#fb923c" : THEME.accentPrimary;

  const handleSubmit = async () => {
    const text = content.trim();
    if (!text || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/forum/posts`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ content: text }),
      });
      const data = await res.json();
      if (data.success) {
        setContent("");
        setSuccess(true);
        onCreated(data.post);
        setTimeout(() => setSuccess(false), 2000);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border transition-all duration-300"
      style={{
        background: `linear-gradient(135deg, ${THEME.cardBg}, ${THEME.secondary}80)`,
        borderColor: focused
          ? `${THEME.accentPrimary}60`
          : success
          ? "rgba(52,211,153,0.4)"
          : `${THEME.primary}20`,
        boxShadow: focused
          ? `0 0 0 3px ${THEME.primary}20, 0 8px 24px ${THEME.primary}15`
          : success
          ? "0 0 0 3px rgba(52,211,153,0.1)"
          : "none",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.accentPrimary} 100%)`,
              color: THEME.textPrimary,
            }}
          >
            <Users className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs" style={{ color: THEME.textSecondary }}>
            You're safe here
          </span>
          <AnimatePresence>
            {success && (
              <motion.span
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="ml-auto text-xs font-medium"
                style={{ color: "#34d399" }}
              >
                ✦ Shared
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Textarea */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Say anything… no names, no judgement, just you."
          maxLength={maxLen}
          rows={4}
          className="w-full bg-transparent border-none outline-none resize-none text-sm leading-relaxed"
          style={{
            color: THEME.textPrimary,
            caretColor: THEME.accentPrimary,
          }}
        />

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-3 mt-2"
          style={{ borderTop: `1px solid ${THEME.border}` }}
        >
          {/* Char ring */}
          <div className="flex items-center gap-1.5">
            <svg width="20" height="20" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="8" fill="none" stroke={`${THEME.primary}25`} strokeWidth="2" />
              <circle
                cx="10" cy="10" r="8"
                fill="none"
                stroke={ringColor}
                strokeWidth="2"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - pct)}
                strokeLinecap="round"
                transform="rotate(-90 10 10)"
                style={{ transition: "stroke-dashoffset 0.2s, stroke 0.3s" }}
              />
            </svg>
            <span className="text-[11px] font-medium" style={{ color: ringColor }}>
              {maxLen - content.length}
            </span>
          </div>

          <motion.button
            whileHover={{
              y: -2,
              boxShadow: `0 8px 20px ${THEME.accentPrimary}60`,
            }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            disabled={!content.trim() || submitting}
            className="px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200"
            style={{
              background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.accentPrimary} 100%)`,
              color: THEME.textPrimary,
              opacity: !content.trim() || submitting ? 0.5 : 1,
              cursor: !content.trim() || submitting ? "default" : "pointer",
            }}
          >
            {submitting ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><Send className="w-3.5 h-3.5" /> Share quietly</>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Empty State ───────────────────────────────────────────────
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-20"
    >
      <motion.div
        animate={{ scale: [1, 1.06, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="w-16 h-16 rounded-full mx-auto mb-5"
        style={{
          background: `radial-gradient(circle, ${THEME.primary}40, transparent 70%)`,
          border: `1px solid ${THEME.primary}30`,
        }}
      />
      <p className="text-lg font-light italic mb-2" style={{ color: THEME.textSecondary }}>
        The space is quiet…
      </p>
      <p className="text-sm opacity-60" style={{ color: THEME.textSecondary }}>
        No one has shared yet. Be the first voice in the room.
      </p>
    </motion.div>
  );
}

// ── Toast ─────────────────────────────────────────────────────
function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="fixed bottom-7 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full text-xs"
      style={{
        background: THEME.secondary,
        border: `1px solid ${THEME.accentPrimary}40`,
        color: THEME.textPrimary,
        backdropFilter: "blur(12px)",
        boxShadow: `0 4px 24px ${THEME.primary}30`,
      }}
    >
      {message}
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function Community() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/forum/posts`, { headers: authHeaders() });
        const data = await res.json();
        if (data.success) setPosts(data.posts);
        else setToast("Couldn't load posts right now.");
      } catch {
        setToast("Connection issue. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: THEME.dark, color: THEME.light }}>
      {/* Same animated background as Home */}
      <motion.div
        className="fixed inset-0 z-0 pointer-events-none"
        animate={{
          background: [
            `radial-gradient(circle at 10% 20%, ${THEME.secondary} 0%, ${THEME.dark} 50%)`,
            `radial-gradient(circle at 90% 30%, ${THEME.primary}20 0%, ${THEME.dark} 50%)`,
            `radial-gradient(circle at 50% 80%, ${THEME.accentSecondary}20 0%, ${THEME.dark} 50%)`,
            `radial-gradient(circle at 10% 20%, ${THEME.secondary} 0%, ${THEME.dark} 50%)`,
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pb-24">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pt-12 pb-8"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5"
            style={{
              background: `linear-gradient(90deg, ${THEME.primary}20, ${THEME.accentPrimary}20)`,
              border: `1px solid ${THEME.primary}30`,
              color: THEME.light,
              backdropFilter: "blur(5px)",
            }}
            whileHover={{ scale: 1.04 }}
          >
            <MessageSquare className="w-3.5 h-3.5" style={{ color: THEME.accentPrimary }} />
            <span className="text-xs font-medium">InnerLight · Community</span>
          </motion.div>

          <h1
            className="text-4xl sm:text-5xl font-light leading-tight mb-3"
            style={{ color: THEME.textPrimary }}
          >
            A quiet place to{" "}
            <span
              className="font-medium"
              style={{
                background: `linear-gradient(135deg, ${THEME.primary}, ${THEME.accentPrimary})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              breathe
            </span>
          </h1>
          <p className="text-sm opacity-80" style={{ color: THEME.textSecondary }}>
            Anonymous. Safe. Real. Say what you can't say anywhere else.
          </p>
        </motion.header>

        {/* Divider */}
        <div
          className="h-px mb-7"
          style={{ background: `linear-gradient(to right, transparent, ${THEME.border}, transparent)` }}
        />

        {/* Compose */}
        <div className="mb-8">
          <CreatePostBox onCreated={(post) => setPosts((p) => [post, ...p])} />
        </div>

        {/* Feed label */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-xs uppercase tracking-widest" style={{ color: THEME.textSecondary }}>
            What people are feeling
          </span>
          {!loading && (
            <span
              className="text-xs px-3 py-1 rounded-full"
              style={{
                background: `${THEME.primary}15`,
                border: `1px solid ${THEME.primary}20`,
                color: THEME.textSecondary,
              }}
            >
              {posts.length} {posts.length === 1 ? "voice" : "voices"}
            </span>
          )}
        </div>

        {/* Feed */}
        <div className="space-y-4">
          {loading ? (
            [0, 1, 2].map((i) => <SkeletonCard key={i} index={i} />)
          ) : posts.length === 0 ? (
            <EmptyState />
          ) : (
            <AnimatePresence>
              {posts.map((post, i) => (
                <PostCard
                  key={post._id}
                  post={post}
                  index={i}
                  onDelete={(id) => setPosts((p) => p.filter((x) => x._id !== id))}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}