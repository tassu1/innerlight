// components/NotificationDropdown.jsx
import React from "react";
import API from "../utils/axios";
import { useNavigate } from "react-router-dom";

const NotificationDropdown = ({ notifications, setNotifications }) => {
  const navigate = useNavigate();

  const markAsRead = async (id, link) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );
      if (link) navigate(link);
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const clearAll = async () => {
    try {
      await API.delete("/notifications");
      setNotifications([]);
    } catch (err) {
      console.error("Failed to clear notifications", err);
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "40px",
        right: "0",
        width: "300px",
        maxHeight: "400px",
        background: "white",
        border: "1px solid #ccc",
        boxShadow: "0px 0px 8px rgba(0,0,0,0.2)",
        overflowY: "auto",
        zIndex: 1000,
      }}
    >
      <div style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
        <strong>Notifications</strong>
        <button
          onClick={clearAll}
          style={{
            float: "right",
            background: "none",
            border: "none",
            color: "blue",
            cursor: "pointer",
          }}
        >
          Clear All
        </button>
      </div>
      {notifications.length === 0 ? (
        <div style={{ padding: "10px", textAlign: "center" }}>
          No notifications
        </div>
      ) : (
        notifications.map((n) => (
          <div
            key={n._id}
            onClick={() => markAsRead(n._id, n.link)}
            style={{
              padding: "10px",
              backgroundColor: n.isRead ? "#f5f5f5" : "#e8f0fe",
              borderBottom: "1px solid #eee",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: "14px" }}>{n.message}</div>
            <div style={{ fontSize: "12px", color: "#555" }}>
              From: {n.from?.name}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationDropdown;
