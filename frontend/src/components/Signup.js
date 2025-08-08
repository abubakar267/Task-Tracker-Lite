import React, { useState } from 'react';
import './signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState(''); // 👈 error state

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when user starts typing again
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match'); // 👈 display error instead of alert
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Signup successful:', data);
        localStorage.setItem('token', data.token);
        localStorage.setItem("userName", data.username);
        window.location.href = '/dashboard';

        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
      } else {
        setError(data.message || 'Signup failed'); // 👈 display API error
      }
    } catch (err) {
      console.error('Server error:', err);
      setError('Server error. Please try again later.');
    }
  };

  return (
  <div className="signup-container">
    <h1 className="main-heading">Task Manager</h1>
    <h2>Sign Up</h2>
    <form onSubmit={handleSubmit} className="signup-form">
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
      />

      {error && <div className="error-text">{error}</div>}

      <button type="submit">Register</button>

      <p className="redirect-text">
        Already have an account? <a href="/login">Login</a>
      </p>
    </form>
  </div>
);

};

export default Signup;
