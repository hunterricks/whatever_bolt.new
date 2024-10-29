import mongoose from 'mongoose';

const ProfileAnalyticsSchema = new mongoose.Schema({
  profileId: {
    type: String,
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true
  },
  metrics: {
    successScore: Number,
    rating: Number,
    responseRate: Number,
    responseTime: Number,
    completionRate: Number,
    activeJobs: Number,
    earnings: Number
  },
  // Daily aggregated statistics
  dailyStats: {
    totalResponses: Number,
    averageResponseTime: Number,
    newJobs: Number,
    completedJobs: Number,
    canceledJobs: Number,
    revenue: Number
  }
}, {
  timestamps: true
});

// Compound index for efficient querying
ProfileAnalyticsSchema.index({ profileId: 1, date: 1 });

export default mongoose.models.ProfileAnalytics || 
  mongoose.model('ProfileAnalytics', ProfileAnalyticsSchema);