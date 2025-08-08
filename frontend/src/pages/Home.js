import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-box">
        <h1 className="home-title">Task Manager</h1>
        <p className="home-subtitle">Manage your tasks easily and efficiently</p>
        <div className="home-buttons">
          <button onClick={() => navigate('/login')}>Sign In</button>
          <button onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
