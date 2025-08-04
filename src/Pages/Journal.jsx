import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/Journal.css";

const Journal = () => {
  const [entry, setEntry] = useState("");
  const [journals, setJournals] = useState([]);
  const [message, setMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/journals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJournals(res.data);
    } catch (err) {
      console.error("Failed to fetch journals", err);
    }
  };

  const handleSubmit = async () => {
    if (!entry.trim()) return;
    const token = localStorage.getItem("token");

    try {
      if (editMode) {
        await axios.put(
          `http://localhost:5000/api/journals/${editId}`,
          { entryText: entry },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage("Entry updated!");
        setEditMode(false);
        setEditId(null);
      } else {
        await axios.post(
          "http://localhost:5000/api/journals/add",
          { entryText: entry },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage("Journal saved!");
      }

      setEntry("");
      fetchJournals();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Error saving journal.");
    }
  };

  const handleEdit = (entry) => {
    setEntry(entry.entryText);
    setEditMode(true);
    setEditId(entry._id);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this entry?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/journals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Entry deleted.");
      fetchJournals();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Error deleting entry.");
    }
  };

  return (
    <div className="journal-wrapper">
   
      <div className="journal-page">
        <h2 className="journal-heading">Dear Diary 📖</h2>

        <textarea
          placeholder="Write your thoughts here..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          className="journal-textarea"
        />

        <button className="journal-save-btn" onClick={handleSubmit}>
          {editMode ? "Update Entry" : "Save Entry"}
        </button>

        {message && <p className="journal-msg">{message}</p>}

        <div className="previous-entries">
          <h3>Previous Entries</h3>
          {journals.length === 0 ? (
            <p>No entries yet</p>
          ) : (
            journals.map((j) => (
              <div key={j._id} className="journal-entry">
                <div className="journal-entry-header">
                  <p className="journal-date">
                    {new Date(j.createdAt).toLocaleString()}
                  </p>
                  <div className="journal-actions">
                    <button onClick={() => handleEdit(j)}>✏️</button>
                    <button onClick={() => handleDelete(j._id)}>🗑️</button>
                  </div>
                </div>
                <p className="journal-content">{j.entryText}</p>
              </div>
            ))
          )}
        </div>
      </div>
      
    </div>
  );
};

export default Journal;
