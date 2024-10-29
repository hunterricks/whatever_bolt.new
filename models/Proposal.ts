import mongoose from 'mongoose';

const ProposalSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Please provide the job this proposal is for.'],
  },
  serviceProvider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide the service provider submitting this proposal.'],
  },
  coverLetter: {
    type: String,
    required: [true, 'Please provide a cover letter for this proposal.'],
    maxlength: [1000, 'Cover letter cannot be more than 1000 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price for this proposal.'],
  },
  estimatedDuration: {
    type: String,
    required: [true, 'Please provide an estimated duration for this job.'],
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Proposal || mongoose.model('Proposal', ProposalSchema);