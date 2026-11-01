import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true, // Pre-save hook / schema option to trim whitespace
  },
  description: {
    type: String,
    default: '',
  },
  completed: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high'],
      message: '{VALUE} is not a valid priority. Must be low, medium, or high',
    },
    default: 'medium',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook explicitly demonstrating whitespace trimming logic
taskSchema.pre('save', function () {
  if (this.title) {
    this.title = this.title.trim();
  }
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
