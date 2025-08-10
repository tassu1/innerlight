import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../Styles/OtherUserProfile.css";

const OtherUserProfile = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchUserProfile();
    fetchUserPosts();
  }, [id]);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch user:", err.response?.data || err.message);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/forum/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch posts:", err.response?.data || err.message);
    }
  };

  return (
    <div className="other-user-wrapper">
    

      <div className="profile-container">
        {user && (
          <div className="profile-header">
            <div className="profile-left">
              <img
                src={user.profilePictureUrl || "/default-avatar.png"}
                alt="avatar"
                className="profile-avatar"
              />
            </div>
            <div className="profile-right">
              <h2>{user.name}</h2>
              <p>{user.email}</p>
            </div>
          </div>
        )}
      </div>

      <div className="posts-tab">
        <h3>{user?.name}'s Posts</h3>
        {posts.length === 0 ? (
          <p className="no-posts">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div className="post-card" key={post._id}>
              <p>{post.content}</p>
              {post.image && (
                <img
                  src={`http://localhost:5000/uploads/${post.image}`}
                  alt="Post"
                  className="post-image"
                />
              )}
            </div>
          ))
        )}
      </div>

    
    </div>
  );
};

export default OtherUserProfile;
