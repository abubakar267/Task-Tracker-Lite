const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcryptjs');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();


// LOGIN CONTROLLER
const login = async (req, res) => {
  console.log("Login controller");

  const { username, password } = req.body;
  console.log("Login request:", username, password);

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid username or password' });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });


    res.status(StatusCodes.OK).json({ token,username });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
  }
};


// SIGNUP CONTROLLER
const signup = async (req, res) => {
  const { username, email, password } = req.body;
  console.log("Signup details:", username, email, password);

  try {
    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Username or email already taken' });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.status(StatusCodes.CREATED).json({ message: 'User created successfully', token,username });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
  }
};

module.exports = { login, signup };
