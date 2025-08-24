// components/NotificationBell.jsx
import React, { useEffect, useState } from "react";
import api from "../utils/api";
import NotificationDropdown from "./NotificationDropdown";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get("/notifications");
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleBellClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div style={{ position: "relative" }}>
      <button onClick={handleBellClick} style={{ cursor: "pointer" }}>
        🔔
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-5px",
              right: "-5px",
              background: "red",
              color: "white",
              borderRadius: "50%",
              padding: "2px 6px",
              fontSize: "12px",
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>
      {dropdownOpen && (
        <NotificationDropdown
          notifications={notifications}
          setNotifications={setNotifications}
        />
      )}
    </div>
  );
}; 

export default NotificationBell;
