import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userRes = await axios.get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userRes.data);

      const postsRes = await axios.get(
        `http://localhost:5000/api/forum/user/${userRes.data._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(postsRes.data);
    } catch (err) {
      console.error("Error loading profile:", err);
    }
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePicture", file); // ✅ Correct field name

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/upload-pic",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser((prev) => ({ ...prev, profilePictureUrl: res.data.url })); // ✅ Correct image key
    } catch (err) {
      console.error("Profile picture upload failed", err);
    }
  };

  return (
    <div className="other-user-wrapper">
      

      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-left">
            <label htmlFor="profilePicInput" style={{ cursor: "pointer" }}>
              <img
                src={
                  user?.profilePictureUrl
                    ? user.profilePictureUrl
                    : "/default-avatar.png"
                }
                alt="Profile"
                className="profile-avatar"
                title="Click to change profile picture"
              />
            </label>
            <input
              type="file"
              id="profilePicInput"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleProfilePicChange}
            />
          </div>

          <div className="profile-right">
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="posts-tab">
        <h3>My Posts</h3>
        {posts.length === 0 ? (
          <p className="no-posts">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              <p className="post-content">{post.content}</p>
              {post.image && (
                <img
                  src={post.image} // Already a full Cloudinary URL
                  alt="Post"
                  className="post-image"
                />
              )}
              <p className="post-time">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>

  
    </div>
  );
};

export default Profile;
