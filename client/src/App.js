import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import CreatePost from './components/CreatePost';
import PostDetail from './components/PostDetail';
import EditPost from './components/EditPost';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import './App.css';
import './styles/animations.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<CreatePost />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/edit/:id" element={<EditPost />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
