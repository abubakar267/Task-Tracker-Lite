import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import OverDue from '../components/OverDue';  //importing the overdue button here
const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [userName, setUserName] = useState('');


  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: ''
  });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: ''
  });

    useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name) {
      setUserName(name);
    }
    fetchTasks();
  }, []);


  const fetchTasks = async () => {
    try {
      const res = await fetch('https://task-tracker-lite-a119c83c03a7.herokuapp.com/api/tasks', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };


const handleLogout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login'; 
};



  const getTaskCounts = () => {
    const now = new Date();
    let completed = 0;
    let pending = 0;
    let overdue = 0;

    tasks.forEach(task => {
      if (task.status === 'completed') {
        completed++;
      } else if (new Date(task.dueDate) < now) {
        overdue++;
      } else {
        pending++;
      }
    });

    return { completed, pending, overdue };
  };

  const { completed, pending, overdue } = getTaskCounts();





  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://task-tracker-lite-a119c83c03a7.herokuapp.com/api/tasks', {
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
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleUpdateTask = async (taskId, updatedFields) => {
    try {
      const res = await fetch(`https://task-tracker-lite-a119c83c03a7.herokuapp.com/api/tasks/${taskId}`, {
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
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const getDueStatus = (dueDate, status) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    const overdueDays = Math.ceil((today - due) / (1000 * 60 * 60 * 24));

    if (status === 'completed') return 'Completed';
    if (due.toDateString() === today.toDateString()) return 'Due today';
    if (due < today) return `Overdue by ${overdueDays} day(s)`;
    return `Due in ${diffDays} day(s)`;
  };

  const isOverdueBy5 = (dueDate, status) => {
    const today = new Date();
    const due = new Date(dueDate);
    const overdueDays = Math.floor((today - due) / (1000 * 60 * 60 * 24));
    return status !== 'completed' && overdueDays > 5;
  };

  const isDueToday = (dueDate, status) => {
    const today = new Date();
    const due = new Date(dueDate);
    return status !== 'completed' && due.toDateString() === today.toDateString();
  };

  const handleEditClick = (task) => {
    setEditingTaskId(task._id);
    setEditForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate.split('T')[0],
      status: task.status,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="dashboard">
      <h1>Hey, {userName}</h1>
      <div className="dashboard-header">
  <h1>Task Dashboard</h1>
  <div>
    <OverDue setTasks={setTasks}/>
    <button className="logout-button" onClick={fetchTasks}>
      All Tasks
    </button>
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
                  <button onClick={() => handleUpdateTask(task._id, { ...editForm })}>Save</button>
                  <button onClick={() => setEditingTaskId(null)}>Cancel</button>
                </>
              ) : (
                <>
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <button onClick={() => handleEditClick(task)}>Edit</button>
                </div>
                  <p>{task.description}</p>


                <div className="status-badge"></div>

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
