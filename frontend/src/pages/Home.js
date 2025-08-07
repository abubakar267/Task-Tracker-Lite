import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to My Project</h1>
      <p className="home-subtitle">Please sign in or sign up to continue</p>
      <div className="home-buttons">
        <button onClick={() => navigate('/login')}>Sign In</button>
        <button onClick={() => navigate('/signup')}>Sign Up</button>
      </div>
    </div>
  );
};

export default Home;
