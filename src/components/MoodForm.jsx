import React, { useEffect, useState } from "react";
import axios from "axios";

const MoodForm = ({ onMoodSubmit }) => {
  const [todayMoodExists, setTodayMoodExists] = useState(false);
  const [selectedMood, setSelectedMood] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const checkTodayMood = async () => {
    try {
      const res = await axios.get("/api/moods/today", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data?.mood) {
        setTodayMoodExists(true);
      }
    } catch (err) {
      console.error("Error checking today mood", err);
    }
  };

  useEffect(() => {
    checkTodayMood();
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMood) return alert("Please select a mood.");
    setLoading(true);
    try {
      await axios.post(
        "/api/moods",
        { mood: selectedMood },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTodayMoodExists(true);
      onMoodSubmit(); // refresh mood chart
    } catch (err) {
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (todayMoodExists) {
    return <p className="text-success">✅ You’ve already logged your mood today!</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="mood">Select your mood for today:</label>
      <select
        id="mood"
        value={selectedMood}
        onChange={(e) => setSelectedMood(e.target.value)}
      >
        <option value="">-- Choose mood --</option>
        <option value="happy">😊 Happy</option>
        <option value="sad">😢 Sad</option>
        <option value="anxious">😰 Anxious</option>
        <option value="neutral">😐 Neutral</option>
        <option value="angry">😡 Angry</option>
        <option value="excited">🤩 Excited</option>
      </select>
      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Mood"}
      </button>
    </form>
  );
};

export default MoodForm;
