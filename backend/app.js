// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); // Ensure this file exists and connects to MongoDB
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRouter = require('./routes/auth');
const taskRoutes = require('./routes/task');
const cookieParser = require('cookie-parser');

dotenv.config();


const app = express();
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,  
}));
app.use(express.json());
app.use('/api', authRouter);
app.use('/api/tasks', taskRoutes); 
// Connect to MongoDB
connectDB(); // This should be a function that connects to MongoDB

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Node.js backend with MongoDB!' }); // ✅ Send valid JSON
});

app.get('/api', (req, res) => {
  res.json({ message: 'This is the API response.' }); // ✅ Valid JSON
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`✅ Server running on http://localhost:${process.env.PORT}`);
});
