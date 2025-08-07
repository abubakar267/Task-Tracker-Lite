const Task = require('../model/task');

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const task = new Task({
      title,
      description,
      dueDate,
      userId: req.user.id,
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ message: 'Error creating task', error: err.message });
  }
};

// Get all tasks for logged-in user
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks', error: err.message });
  }
};

// Update task status or description
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, description, title, dueDate } = req.body;
    console.log(status,description,title,dueDate);
    

    const task = await Task.findOne({ _id: id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (status === 'completed' && new Date(task.dueDate) > new Date()) {
      return res.status(400).json({ message: 'Cannot mark task as completed before due date.' });
    }

    if (status) task.status = status;
    if (description) task.description = description;
    if (title) task.title = title;
    if (dueDate) task.dueDate = dueDate;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Error updating task', error: err.message });
  }
};

const getOverdueTasks = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // set time to 00:00:00

    const tasks = await Task.find({
      userId: req.user.id,
      dueDate: { $lt: today }, // now compares only date part
      status: { $ne: 'completed' }
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching overdue tasks', error: err.message });
  }
};


module.exports = { createTask, getOverdueTasks,updateTask,getTasks };