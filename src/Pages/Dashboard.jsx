import React, { useEffect, useState } from "react";
import MoodChart from "../components/MoodChart";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../Styles/Dashboard.css";

const Dashboard = () => {
  const [quote, setQuote] = useState("Loading your quote...");
  const [moodLevel, setMoodLevel] = useState("");
  const [note, setNote] = useState("");
  const [alreadyLogged, setAlreadyLogged] = useState(false);
  const [refreshChart, setRefreshChart] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/quotes");
        const [qObj] = res.data;
        setQuote(`${qObj.q} — ${qObj.a}`);
      } catch {
        setQuote("Be kind to yourself — every day is a fresh start.");
      }
    };
    fetchQuote();
  }, []);

  useEffect(() => {
    const checkMoodLogged = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/moods/today", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAlreadyLogged(res.data?.logged || false);
        if (res.data?.mood) setMoodLevel(res.data.mood.toString());
      } catch (err) {
        console.error("Error checking today's mood:", err);
      }
    };
    checkMoodLogged();
  }, [refreshChart]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!moodLevel) return setError("Please select your mood.");
    try {
      await axios.post(
        "http://localhost:5000/api/moods",
        { moodLevel, note },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAlreadyLogged(true);
      setRefreshChart((prev) => !prev);
      setError("");
      setNote("");
      setMoodLevel("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to log mood.");
    }
  };

  return (
    <div className="dashboard">
      
      <div className="dashboard-container">
        <h2>Hello There! 👋</h2>
        <p className="quote">{quote}</p>

        <div className="mood-grid">
          <div className="card mood-chart-section">
            <h3>Mood in the Last 7 Days</h3>
            <MoodChart key={refreshChart} />
          </div>

          <div className="card today-mood-section">
            <h3>Today's Mood</h3>
            {alreadyLogged ? (
              <p className="success">
                You've already logged your mood today. Check back tomorrow!
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="mood-form">
                <label>
                  How are you feeling?
                  <select
                    value={moodLevel}
                    onChange={(e) => setMoodLevel(e.target.value)}
                    required
                  >
                    <option value="">Select</option>
                    <option value="1">😞 Very Low</option>
                    <option value="2">😐 Low</option>
                    <option value="3">🙂 Neutral</option>
                    <option value="4">😊 Good</option>
                    <option value="5">😄 Great</option>
                  </select>
                </label>
                {error && <p className="error">{error}</p>}
                <button type="submit" className="btn">
                  Submit Mood
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="bottom-widgets">
          <div className="widget chatbot">
            <div className="chatbot-image-container">
    <img src="../chatbotUi.webp" alt="chat" />
  </div>
  <h4>AI Chatbot</h4>
            <button className="btn" onClick={() => navigate("/chatbot")}>
              Start Chat
            </button>
          </div>
          <div className="widget journal">
            <div className="journal-image-container">
    <img src="../journalUi.jpg" alt="journal" />
  </div>
  <h4>Journal</h4>
            
            <button className="btn" onClick={() => navigate("/journal")}>
    Start Journaling
  </button>
          </div>
        </div>
      </div>
   
    </div>
  );
};

export default Dashboard;
