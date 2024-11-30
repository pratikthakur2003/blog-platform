import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          BlogSpace
        </Link>

        <button className="menu-toggle" onClick={toggleMenu}>
          <span className="hamburger"></span>
        </button>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="navbar-start">
            <Link to="/" className="navbar-item" onClick={closeMenu}>
              Home
            </Link>
          </div>

          <div className="navbar-end">
            {user ? (
              <>
                <Link to="/create" className="navbar-item" onClick={closeMenu}>
                  Create Post
                </Link>
                <div className="navbar-item has-dropdown">
                  <div className="user-profile">
                    <span className="user-name">
                      Welcome, {user.username}
                    </span>
                    <div className="dropdown-content">
                      <Link to="/profile" className="dropdown-item" onClick={closeMenu}>
                        My Profile
                      </Link>
                      <button onClick={handleLogout} className="dropdown-item">
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="navbar-item" onClick={closeMenu}>
                  Login
                </Link>
                <Link to="/register" className="navbar-item" onClick={closeMenu}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
