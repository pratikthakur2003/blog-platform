import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './PostDetail.css';

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [summary, setSummary] = useState('');
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/posts/${id}`);
      setPost(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch post. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const token = user?.token;
      if (!token) {
        setError('You must be logged in to delete posts.');
        return;
      }

      await axios.delete(
        `http://localhost:5000/api/posts/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete post. Please try again later.';
      setError(errorMessage);
      setShowDeleteModal(false);
    }
  };

  const generateSummary = async () => {
    try {
      setGeneratingSummary(true);
      const response = await axios.post(`http://localhost:5000/api/summary/generate`, {
        content: post.content
      });
      setSummary(response.data.summary);
    } catch (err) {
      setError('Failed to generate summary. Please try again later.');
    } finally {
      setGeneratingSummary(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isAuthor = user && post?.author?._id === user.userId;

  if (loading) {
    return (
      <div className="post-detail-container">
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>Loading post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="post-detail-container">
        <div className="error-container">
          <div className="error-banner">
            <p>{error}</p>
            <button onClick={() => navigate('/')} className="button">
              Go Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="post-detail-container">
        <div className="error-container">
          <p>Post not found.</p>
          <button onClick={() => navigate('/')} className="button">
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="post-detail-container">
      <button onClick={() => navigate('/')} className="back-button">
        ← Back to Posts
      </button>

      <article className="post-content-container">
        <header className="post-header">
          <h1>{post.title}</h1>
          <div className="post-meta">
            <div className="author-info">
              <span className="author-name">{post.author?.username || 'Unknown'}</span>
              <span className="post-date">{formatDate(post.createdAt)}</span>
            </div>
            {isAuthor && (
              <div className="post-actions">
                <button
                  onClick={() => navigate(`/edit/${id}`)}
                  className="edit-button"
                >
                  Edit Post
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="delete-button"
                >
                  Delete Post
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="post-content">
          {post.content}
        </div>

        <div className="summary-section">
          {!summary ? (
            <button
              onClick={generateSummary}
              className="summary-button"
              disabled={generatingSummary}
            >
              {generatingSummary ? (
                <>
                  <div className="loading-spinner-small"></div>
                  Generating Summary...
                </>
              ) : (
                'Generate Summary'
              )}
            </button>
          ) : (
            <div className="summary-content">
              <h3>
                Summary
                <button
                  onClick={() => setSummary('')}
                  className="regenerate-button"
                  title="Generate new summary"
                >
                  ↺
                </button>
              </h3>
              <p>{summary}</p>
            </div>
          )}
        </div>
      </article>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Delete Post</h2>
            <p>Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="cancel-button"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
