import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Navbar.css";
import {
  Bell,
  LogOut,
  Users,
  Search,
  CircleDot,
  User,
  BookOpen, // ✅ NEW: Import icon
} from "lucide-react";
import axios from "axios";

const Navbar = () => {
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const toggleDropdown = (dropdown) => {
    setShowNotif(dropdown === "notif" ? !showNotif : false);
    setShowProfile(dropdown === "profile" ? !showProfile : false);
  };

  const markAsRead = async (id, link) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      if (link) navigate(link);
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (!query) return setSearchResults([]);

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `http://localhost:5000/api/users/search?query=${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSearchResults(data);
    } catch (error) {
      console.error("Search failed", error);
    }
  };

  const handleUserClick = (userId) => {
    setSearchQuery("");
    setSearchResults([]);
    navigate(`/profile/${userId}`);
  };

  const logoutHandler = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const renderNotificationMessage = (notif) => {
    switch (notif.type) {
      case "like":
        return `❤️ ${notif.from?.name} liked your post`;
      case "comment":
        return `💬 ${notif.from?.name} commented on your post`;
      case "friendRequest":
        return `👥 ${notif.from?.name} sent you a friend request`;
      default:
        return notif.message;
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-left" onClick={() => navigate("/dashboard")}>
        <h2>InnerLight</h2>
      </div>

      <div className="nav-right">
        {/* 🔔 Notifications */}
        <div className="nav-icon" onClick={() => toggleDropdown("notif")}>
          <Bell size={22} />
          {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          {showNotif && (
            <div className="dropdown notif-dropdown">
              <p className="dropdown-title">Notifications</p>
              {notifications.length === 0 ? (
                <p className="notif-empty">No notifications</p>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif._id}
                    className={`notif-item ${notif.isRead ? "read" : "unread"}`}
                    onClick={() => markAsRead(notif._id, notif.link)}
                  >
                    <span>{renderNotificationMessage(notif)}</span>
                    <small>{new Date(notif.createdAt).toLocaleString()}</small>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* 🧑‍🤝‍🧑 Community */}
        <div className="nav-icon" onClick={() => navigate("/community")}>
          <Users size={22} />
        </div>

        {/* 📚 Self-Help Library */}
        <div className="nav-icon" onClick={() => navigate("/self-help")}>
          <BookOpen size={22} />
        </div>

        {/* 👤 Profile Dropdown */}
        <div className="nav-icon" onClick={() => toggleDropdown("profile")}>
          <User size={22} />
          {showProfile && (
            <div className="dropdown profile-dropdown">
              <p onClick={() => navigate("/profile")}>👤 My Profile</p>
              <p onClick={logoutHandler}>
                <LogOut size={16} style={{ marginRight: "6px" }} /> Logout
              </p>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
