import mongoose from 'mongoose';

export interface ProfileDocument extends mongoose.Document {
  userId: string;
  role: 'homeowner' | 'contractor';
  ratings: number[];
  privateRatings: number[];
  repeatClients: string[]; // Array of client IDs
  totalClients: number;
  completedJobs: number;
  totalJobs: number;
  recentRatings: {
    rating: number;
    timestamp: Date;
  }[];
  successScore: number;
  lastCalculated: Date;
  badges: string[];
  skills: string[];
  responseRate: number;
  responseTime: number; // Average response time in minutes
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new mongoose.Schema<ProfileDocument>({
  userId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  role: { 
    type: String, 
    enum: ['homeowner', 'contractor'], 
    required: true 
  },
  ratings: [Number],
  privateRatings: [Number],
  repeatClients: [String],
  totalClients: { 
    type: Number, 
    default: 0 
  },
  completedJobs: { 
    type: Number, 
    default: 0 
  },
  totalJobs: { 
    type: Number, 
    default: 0 
  },
  recentRatings: [{
    rating: Number,
    timestamp: Date
  }],
  successScore: { 
    type: Number, 
    default: 0 
  },
  lastCalculated: { 
    type: Date, 
    default: Date.now 
  },
  badges: [String],
  skills: [String],
  responseRate: { 
    type: Number, 
    default: 100 
  },
  responseTime: { 
    type: Number, 
    default: 0 
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for average rating
ProfileSchema.virtual('averageRating').get(function() {
  if (!this.ratings.length) return 0;
  return this.ratings.reduce((a, b) => a + b, 0) / this.ratings.length;
});

// Virtual for completion rate
ProfileSchema.virtual('completionRate').get(function() {
  if (!this.totalJobs) return 0;
  return (this.completedJobs / this.totalJobs) * 100;
});

// Virtual for repeat client rate
ProfileSchema.virtual('repeatClientRate').get(function() {
  if (!this.totalClients) return 0;
  return (this.repeatClients.length / this.totalClients) * 100;
});

// Method to calculate success score
ProfileSchema.methods.calculateSuccessScore = function() {
  const now = new Date();
  const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
  
  // Get recent ratings (last 3 months)
  const recentRatings = this.recentRatings.filter(r => 
    r.timestamp >= threeMonthsAgo
  ).map(r => r.rating);

  // Calculate component scores
  const ratingScore = this.averageRating * 20; // Convert 5-star to 100-point scale
  const completionScore = this.completionRate;
  const repeatScore = this.repeatClientRate;
  const responseScore = this.responseRate;
  const recentScore = recentRatings.length ? 
    (recentRatings.reduce((a, b) => a + b, 0) / recentRatings.length) * 20 : 
    0;

  // Weight the components
  const score = (
    (ratingScore * 0.3) +      // 30% weight on overall ratings
    (completionScore * 0.2) +  // 20% weight on job completion
    (repeatScore * 0.2) +      // 20% weight on repeat clients
    (responseScore * 0.15) +   // 15% weight on response rate
    (recentScore * 0.15)       // 15% weight on recent performance
  );

  // Update the success score and last calculated date
  this.successScore = Math.round(score * 100) / 100;
  this.lastCalculated = new Date();

  return this.successScore;
};

// Pre-save middleware to update badges
ProfileSchema.pre('save', function(next) {
  // Update badges based on metrics
  const badges = [];

  if (this.completionRate >= 95) badges.push('reliable');
  if (this.averageRating >= 4.5) badges.push('top-rated');
  if (this.repeatClientRate >= 50) badges.push('client-favorite');
  if (this.responseRate >= 90 && this.responseTime <= 60) badges.push('quick-responder');
  if (this.completedJobs >= 100) badges.push('experienced');

  this.badges = badges;
  next();
});

export default mongoose.models.Profile || mongoose.model<ProfileDocument>('Profile', ProfileSchema);