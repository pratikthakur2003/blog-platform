import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/posts');
      setPosts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedPosts = () => {
    let filtered = posts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return 0;
    });
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
    <div className="home-container">
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search posts..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="filter-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {filteredAndSortedPosts().length === 0 ? (
        <div className="no-posts">
          <h2>No posts found</h2>
          <p>Try adjusting your search or create a new post!</p>
        </div>
      ) : (
        <div className="posts-grid">
          {filteredAndSortedPosts().map((post) => (
            <article key={post._id} className="post-card">
              <header className="post-card-header">
                <h2 className="post-card-title">{post.title}</h2>
                <div className="post-card-meta">
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span>{post.author?.username || 'Anonymous'}</span>
                </div>
              </header>
              <div className="post-card-content">
                <p className="post-card-excerpt">
                  {post.content.substring(0, 150)}...
                </p>
              </div>
              <footer className="post-card-footer">
                <Link to={`/post/${post._id}`} className="read-more-btn">
                  Read More
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </footer>
            </article>
          ))}
        </div>
      )}

      <Link to="/create" className="create-post-btn" title="Create New Post">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      </Link>
    </div>
  );
};

export default Home;
