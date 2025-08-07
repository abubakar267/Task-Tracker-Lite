import React from 'react';
import './global.css';

const OverDue = ({ setTasks }) => {
  const handleClick = async () => {
    try {
      const response = await fetch('https://task-tracker-lite-a119c83c03a7.herokuapp.com/api/tasks/overdue', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch overdue tasks');
      }

      const data = await response.json();
      setTasks(data); // Replace current tasks with overdue ones
    } catch (error) {
      console.error('Error fetching overdue tasks:', error.message);
    }
  };

  return (
    <button className="logout-button" onClick={handleClick}>
      OverDue
    </button>
  );
};

export default OverDue;
