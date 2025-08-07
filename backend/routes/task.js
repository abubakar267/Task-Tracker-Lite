const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');
const { createTask,getTasks,getOverdueTasks,updateTask } = require('../controller/task');

// All routes require auth
router.use(authMiddleware);

// POST /tasks → Add task
router.post('/', createTask);

// GET /tasks → Get user's tasks
router.get('/',getTasks);

// PATCH /tasks/:id → Update task
router.patch('/:id', updateTask);

// GET /tasks/overdue → Get overdue tasks
router.get('/overdue', getOverdueTasks);

module.exports = router;
