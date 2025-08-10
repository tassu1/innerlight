import React, { useState, useEffect } from "react";
import axios from "axios";

const AddMood = ({ onMoodLogged }) => {
  const [moodLevel, setMoodLevel] = useState("");
  const [note, setNote] = useState("");
  const [alreadyLogged, setAlreadyLogged] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkTodayMood = async () => {
      try {
        const res = await axios.get("/api/moods/today");
        if (res.data.alreadyLogged) {
          setAlreadyLogged(true);
        }
      } catch (err) {
        console.error("Failed to check today’s mood.");
      }
    };
    checkTodayMood();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("/api/moods", { moodLevel, note });
      setAlreadyLogged(true);
      onMoodLogged(); // to refresh chart
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  if (alreadyLogged) {
    return <p>You’ve already logged your mood today 😊</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="add-mood-form">
      <h3>How are you feeling today?</h3>
      <select value={moodLevel} onChange={(e) => setMoodLevel(e.target.value)} required>
        <option value="">Select mood level</option>
        <option value="1">😔 Very Low</option>
        <option value="2">😕 Low</option>
        <option value="3">😐 Neutral</option>
        <option value="4">🙂 Good</option>
        <option value="5">😁 Excellent</option>
      </select>
      <textarea
        placeholder="Optional note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button type="submit">Submit Mood</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default AddMood;
