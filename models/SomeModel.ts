import mongoose from 'mongoose';
import './User';  // This ensures the User model is registered

const SomeModelSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this job.'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description for this job.'],
    maxlength: [2000, 'Description cannot be more than 2000 characters'],
  },
  category: {
    type: String,
    required: [true, 'Please specify the category of this job.'],
    enum: ['renovation', 'plumbing', 'electrical', 'painting', 'landscaping', 'cleaning', 'other'],
  },
  location: {
    type: String,
    required: [true, 'Please specify the location for this job.'],
  },
  budget: {
    type: Number,
    min: [0, 'Budget cannot be negative'],
  },
  minHourlyRate: {
    type: Number,
    min: [0, 'Hourly rate cannot be negative'],
  },
  maxHourlyRate: {
    type: Number,
    min: [0, 'Hourly rate cannot be negative'],
  },
  budgetType: {
    type: String,
    enum: ['fixed', 'hourly'],
    required: [true, 'Please specify the budget type.'],
  },
  scope: {
    type: String,
    required: [true, 'Please specify the scope of this job.'],
    enum: ['small', 'medium', 'large'],
  },
  duration: {
    type: String,
    required: [true, 'Please specify the duration of this job.'],
    enum: ['1-3', '3-6', '6+'],
  },
  experienceLevel: {
    type: String,
    required: [true, 'Please specify the required experience level.'],
    enum: ['entry', 'intermediate', 'expert'],
  },
  skills: [{
    type: String,
    required: [true, 'Please specify at least one required skill.'],
  }],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide the user who posted this job.'],
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'completed', 'cancelled'],
    default: 'open',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'escrow', 'released', 'refunded'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field on save
SomeModelSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.SomeModel || mongoose.model('SomeModel', SomeModelSchema);
