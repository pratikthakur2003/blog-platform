import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { 
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError(error.response?.data?.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="profile-container">
        <div className="error-message">
          Please <Link to="/login">login</Link> to view your profile.
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="profile-container loading">Loading...</div>;
  }

  if (error) {
    return <div className="profile-container error-message">{error}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-info">
          <h1>{profileData?.user.username}'s Profile</h1>
          <p className="email">{profileData?.user.email}</p>
          <p className="stats">
            Total Posts: {profileData?.posts.length}
          </p>
        </div>
      </div>

      <div className="profile-posts">
        <h2>My Posts</h2>
        {profileData?.posts.length === 0 ? (
          <p className="no-posts">You haven't created any posts yet.</p>
        ) : (
          <div className="posts-grid">
            {profileData?.posts.map(post => (
              <div key={post._id} className="post-card">
                <h3>{post.title}</h3>
                <p className="post-preview">
                  {post.content.substring(0, 150)}
                  {post.content.length > 150 ? '...' : ''}
                </p>
                <div className="post-meta">
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <div className="post-actions">
                    <Link to={`/post/${post._id}`} className="view-button">View</Link>
                    <Link to={`/edit-post/${post._id}`} className="edit-button">Edit</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
