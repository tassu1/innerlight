import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import "../Styles/Chatbot.css";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch chat history on load
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/chatbot/history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Transform existing chat history into frontend-compatible structure
        const chat = res.data.map((msg) => ({
          text: msg.content,
          from: msg.role === "user" ? "user" : "bot",
          emoji: msg.emoji || null,
          timestamp: msg.createdAt,
        }));

        setMessages(chat);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setMessages([]);
      }
    };
    fetchMessages();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      from: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/chatbot/ask",
        { message: input },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const botMessage = {
        text: res.data.botReply,
        from: "bot",
        emoji: res.data.emoji || null,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Send Error:", err);
      setError("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chatbot-wrapper">
      <Navbar />
      <div className="chatbot-container">
        <h2 className="chatbot-title">Talk to InnerLight 🧠</h2>
        <div className="chatbox">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${msg.from === "user" ? "user" : "bot"}`}
            >
              <span>
                {msg.emoji && <span className="emoji">{msg.emoji} </span>}
                {msg.text}
              </span>
            </div>
          ))}
          {loading && <div className="chat-message bot">Typing...</div>}
        </div>

        {error && <p className="error-msg">{error}</p>}

        <div className="chat-input-section">
          <input
            type="text"
            placeholder="Say something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={sendMessage} className="send-btn">Send</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Chatbot;
