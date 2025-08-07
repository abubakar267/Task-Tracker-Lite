const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],  
    default: 'pending'
  },
  dueDate: {
    type: Date
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',                     
    required: true
  }
}, {
  timestamps: true                 
});
const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
module.exports = Task;
