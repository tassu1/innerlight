import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/CommunityForum.css";
import { formatDistanceToNow } from "date-fns";

const CommunityForum = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [commentInput, setCommentInput] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [myId, setMyId] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchPosts = async (pageNum = 1) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/forum?page=${pageNum}&limit=5`);
      if (pageNum === 1) {
        setPosts(res.data);
      } else {
        setPosts((prev) => [...prev, ...res.data]);
      }
      if (res.data.length < 5) setHasMore(false);
    } catch (err) {
      console.error("Error fetching posts", err);
    }
  };

  const fetchMe = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyId(res.data._id);
    } catch (err) {
      console.error("Error fetching user info", err);
    }
  };

  useEffect(() => {
    fetchMe();
    fetchPosts();
  }, []);

  const handlePostSubmit = async () => {
    if (!content.trim()) return;
    try {
      await axios.post(
        "http://localhost:5000/api/forum",
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContent("");
      setPage(1);
      fetchPosts(1);
      setHasMore(true);
    } catch (err) {
      console.error("Error creating post", err);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.put(`http://localhost:5000/api/forum/${postId}/like`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPosts(1);
    } catch (err) {
      console.error("Error liking post", err);
    }
  };

  const handleComment = async (postId) => {
    const text = commentInput[postId];
    if (!text?.trim()) return;
    try {
      await axios.post(
        `http://localhost:5000/api/forum/${postId}/comments`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentInput((prev) => ({ ...prev, [postId]: "" }));
      fetchPosts(1);
    } catch (err) {
      console.error("Error commenting", err);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/api/forum/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPosts(1);
    } catch (err) {
      console.error("Error deleting post", err);
    }
  };

  const handleEdit = (postId, currentContent) => {
    setEditingPostId(postId);
    setEditedContent(currentContent);
  };

  const saveEditedPost = async () => {
    if (!editedContent.trim()) return;
    try {
      await axios.put(
        `http://localhost:5000/api/forum/${editingPostId}`,
        { content: editedContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingPostId(null);
      setEditedContent("");
      fetchPosts(1);
    } catch (err) {
      console.error("Error updating post", err);
    }
  };

  return (
    <div className="forum-wrapper">
  
      <div className="forum-container">
        <div className="new-post">
          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="post-actions">
            <button onClick={handlePostSubmit}>Post</button>
          </div>
        </div>

        {posts.length === 0 ? (
          <p className="no-posts">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              <div className="post-header">
                <div className="avatar">{post.user.name[0]}</div>
                <div className="post-meta">
                  <p
                    className="user-name"
                    onClick={() => navigate(`/profile/${post.user._id}`)}
                  >
                    {post.user.name}
                  </p>
                  <p className="timestamp">
                    {formatDistanceToNow(new Date(post.createdAt))} ago
                  </p>
                </div>
              </div>

              <div className="post-content">
                {editingPostId === post._id ? (
                  <>
                    <textarea
                      className="edit-area"
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                    />
                    <div className="edit-buttons">
                      <button onClick={saveEditedPost}>Save</button>
                      <button onClick={() => setEditingPostId(null)}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <p>{post.content}</p>
                )}
              </div>

              <div className="post-actions">
                <span onClick={() => handleLike(post._id)}>👍 {post.likes.length} Like</span>
                {post.user._id === myId && (
                  <>
                    <span onClick={() => handleEdit(post._id, post.content)}>✏️ Edit</span>
                    <span onClick={() => handleDelete(post._id)}>🗑️ Delete</span>
                  </>
                )}
              </div>

              <div className="comments-section">
                {post.comments.map((c, idx) => (
                  <div key={idx} className="comment">
                    <strong
                      className="comment-username"
                      onClick={() => navigate(`/profile/${c.user._id}`)}
                    >
                      {c.user.name}
                    </strong>
                    : {c.text}
                  </div>
                ))}
                <div className="comment-box">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentInput[post._id] || ""}
                    onChange={(e) =>
                      setCommentInput((prev) => ({
                        ...prev,
                        [post._id]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleComment(post._id);
                    }}
                  />
                  <button onClick={() => handleComment(post._id)}>Post</button>
                </div>
              </div>
            </div>
          ))
        )}

        {hasMore && (
          <button
            className="view-more"
            onClick={() => {
              const next = page + 1;
              setPage(next);
              fetchPosts(next);
            }}
          >
            View More
          </button>
        )}
      </div>
      
    </div>
  );
};

export default CommunityForum;
