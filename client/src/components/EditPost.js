import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreatePost.css';

const EditPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/posts/${id}`);
      setTitle(response.data.title);
      setContent(response.data.content);
      setError(null);
    } catch (err) {
      setError('Failed to fetch post. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/posts/${id}`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/post/${id}`);
    } catch (err) {
      setError('Failed to update post. Please try again later.');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="create-post-container">
      <h1>Edit Post</h1>
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter post title"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="Write your post content here"
            className="form-control"
            rows="10"
          />
        </div>
        <div className="form-actions">
          <button type="button" onClick={() => navigate(`/post/${id}`)} className="cancel-button">
            Cancel
          </button>
          <button type="submit" className="submit-button">
            Update Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
