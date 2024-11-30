import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './CreatePost.css';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      const response = await axios.post(
        'http://localhost:5000/api/posts',
        { title, content },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          }
        }
      );
      navigate(`/post/${response.data._id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating post');
      setIsSubmitting(false);
    }
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="create-post-container">
      <div className="create-post-header">
        <h1>Create New Post</h1>
        <p className="create-post-subtitle">Share your thoughts with the world</p>
      </div>

      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError('')} className="error-close-btn">
            ×
          </button>
        </div>
      )}

      <div className="create-post-tabs">
        <button
          className={`tab-button ${!isPreview ? 'active' : ''}`}
          onClick={() => setIsPreview(false)}
        >
          Write
        </button>
        <button
          className={`tab-button ${isPreview ? 'active' : ''}`}
          onClick={() => setIsPreview(true)}
        >
          Preview
        </button>
      </div>

      {!isPreview ? (
        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your post title..."
              maxLength="100"
              required
            />
            <div className="character-count">
              {title.length}/100 characters
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content here..."
              rows="12"
              required
            />
            <div className="character-count">
              {content.length} characters
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="cancel-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>
        </form>
      ) : (
        <div className="preview-container">
          <h1 className="preview-title">{title || 'Untitled Post'}</h1>
          <div className="preview-meta">
            <span>{user.username}</span>
            <span>•</span>
            <span>{formatDate()}</span>
          </div>
          <div className="preview-content">
            {content || 'No content yet...'}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
