import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import OverDue from '../components/OverDue'; // keep your OverDue component

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [userName, setUserName] = useState('');
  const [form, setForm] = useState({ title: '', description: '', dueDate: '' });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', dueDate: '', status: '' });
  const [editError, setEditError] = useState(''); // error shown in edit UI

  useEffect(() => {
    const name = localStorage.getItem('userName');
    if (name) setUserName(name);
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      setTasks(data || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const getTaskCounts = () => {
    const now = new Date();
    let completed = 0, pending = 0, overdue = 0;
    tasks.forEach(task => {
      if (task.status === 'completed') completed++;
      else if (new Date(task.dueDate) < now) overdue++;
      else pending++;
    });
    return { completed, pending, overdue };
  };
  const { completed, pending, overdue } = getTaskCounts();

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({ title: '', description: '', dueDate: '' });
        await fetchTasks();
      }
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  // Utility to parse YYYY-MM-DD (date-only) into local Date w/out timezone shift
  const parseDateOnly = (dateStr) => {
    if (!dateStr) return null;
    // support full ISO string or just YYYY-MM-DD
    const datePart = dateStr.split('T')[0];
    const [y, m, d] = datePart.split('-').map(Number);
    return new Date(y, m - 1, d);
  };

  const canComplete = (dateStr) => {
    const due = parseDateOnly(dateStr);
    if (!due) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Completion allowed if due date is today or in the past
    return due <= today;
  };

  const handleUpdateTask = async (taskId, updatedFields) => {
    // Validation: cannot mark completed if due date is in future
    if (updatedFields.status === 'completed') {
      const dueDateStr = updatedFields.dueDate || editForm.dueDate;
      if (!dueDateStr) {
        setEditError('Please set a due date before marking completed.');
        return;
      }
      if (!canComplete(dueDateStr)) {
        setEditError('❌ You cannot complete a task before its due date.');
        return;
      }
    }

    // Clear any edit errors before sending request
    setEditError('');
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedFields),
      });
      if (res.ok) {
        await fetchTasks();
        setEditingTaskId(null);
      } else {
        const errData = await res.json();
        setEditError(errData.message || 'Update failed');
      }
    } catch (err) {
      console.error('Error updating task:', err);
      setEditError('Server error. Please try again later.');
    }
  };

  const getDueStatus = (dueDate, status) => {
    const today = new Date();
    const due = parseDateOnly(dueDate);
    if (!due) return 'No due date';
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    const overdueDays = Math.ceil((today - due) / (1000 * 60 * 60 * 24));
    if (status === 'completed') return 'Completed';
    if (due.toDateString() === today.toDateString()) return 'Due today';
    if (due < today) return `Overdue by ${overdueDays} day(s)`;
    return `Due in ${diffDays} day(s)`;
  };

  const isOverdueBy5 = (dueDate, status) => {
    const today = new Date();
    const due = parseDateOnly(dueDate);
    if (!due) return false;
    const overdueDays = Math.floor((today - due) / (1000 * 60 * 60 * 24));
    return status !== 'completed' && overdueDays >= 5;
  };

  const isDueToday = (dueDate, status) => {
    const due = parseDateOnly(dueDate);
    if (!due) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    return status !== 'completed' && due.getTime() === today.getTime();
  };

  const handleEditClick = (task) => {
    setEditingTaskId(task._id);
    setEditForm({
      title: task.title,
      description: task.description,
      // ensure YYYY-MM-DD string for input[type=date]
      dueDate: task.dueDate ? parseDateOnly(task.dueDate).toISOString().split('T')[0] : '',
      status: task.status,
    });
    setEditError('');
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
    setEditError(''); // clear error while user edits
  };

  return (
    <div className="dashboard">
      <h1>Hey, {userName}</h1>

      <div className="dashboard-header">
        <h1>Task Dashboard</h1>
        <div>
          <OverDue setTasks={setTasks} />
          <button className="logout-button" onClick={fetchTasks}>All Tasks</button>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="task-status-boxes">
        <div className="status-box completed-statusbox">Completed: {completed}</div>
        <div className="status-box pending">Pending: {pending}</div>
        <div className="status-box overdue">Overdue: {overdue}</div>
      </div>

      <form onSubmit={handleAddTask} className="task-form">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <input
          type="date"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          required
        />
        <button type="submit">Add Task</button>
      </form>

      <div className="task-list">
        {tasks.map((task) => {
          const taskClasses = [
            'task-card',
            task.status === 'completed' ? 'completed' : '',
            isDueToday(task.dueDate, task.status) ? 'due-today' : '',
            isOverdueBy5(task.dueDate, task.status) ? 'overdue-red' : '',
          ].join(' ');

          return (
            <div key={task._id} className={taskClasses}>
              {editingTaskId === task._id ? (
                <>
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                  />
                  <input
                    type="text"
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                  />
                  <input
                    type="date"
                    name="dueDate"
                    value={editForm.dueDate}
                    onChange={handleEditChange}
                  />
                  <select
                    name="status"
                    value={editForm.status}
                    onChange={handleEditChange}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>

                  {/* inline validation message if attempting to complete before due date */}
                  {editForm.status === 'completed' && !canComplete(editForm.dueDate) && (
                    <p className="edit-error">❌ You cannot complete this task before its due date.</p>
                  )}

                  {editError && <p className="edit-error">{editError}</p>}

                  <div style={{ marginTop: 8 }}>
                    <button
                      onClick={() => handleUpdateTask(task._id, { ...editForm })}
                    >
                      Save
                    </button>
                    <button onClick={() => { setEditingTaskId(null); setEditError(''); }}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="task-header">
                    <h3>{task.title}</h3>
                    <button onClick={() => handleEditClick(task)}>Edit</button>
                  </div>

                  <p>{task.description}</p>

                  <div className={`status-badge ${
                    task.status === 'completed'
                      ? 'badge-completed'
                      : isOverdueBy5(task.dueDate, task.status)
                      ? 'badge-overdue'
                      : isDueToday(task.dueDate, task.status)
                      ? 'badge-due-today'
                      : 'badge-pending'
                  }`}>
                    {task.status}
                  </div>

                  {task.status !== 'completed' && (
                    <p className={`due-status ${
                      isOverdueBy5(task.dueDate, task.status)
                        ? 'text-overdue'
                        : isDueToday(task.dueDate, task.status)
                        ? 'text-due-today'
                        : 'text-pending'
                    }`}>
                      {getDueStatus(task.dueDate, task.status)}
                    </p>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
