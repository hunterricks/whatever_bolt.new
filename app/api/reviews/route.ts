import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Profile from '@/models/Profile';
import Job from '@/models/Job';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    await dbConnect();

    const {
      jobId,
      providerId,
      publicRating,
      privateRating,
      comment,
      privateComment
    } = await request.json();

    // Update job with public rating and comment
    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (job.postedBy.toString() !== decoded.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    job.rating = publicRating;
    job.review = comment;
    await job.save();

    // Update provider's profile
    const profile = await Profile.findOne({ userId: providerId });
    if (!profile) {
      return NextResponse.json({ error: 'Provider profile not found' }, { status: 404 });
    }

    // Add ratings
    profile.ratings.push(publicRating);
    profile.privateRatings.push(privateRating);
    profile.recentRatings.push({
      rating: publicRating,
      timestamp: new Date()
    });

    // Check if this is a repeat client
    if (!profile.repeatClients.includes(decoded.userId)) {
      const previousJobs = await Job.find({
        postedBy: decoded.userId,
        providerId: providerId,
        status: 'completed',
        _id: { $ne: jobId }
      });

      if (previousJobs.length > 0) {
        profile.repeatClients.push(decoded.userId);
      }
    }

    // Update job counts
    profile.completedJobs += 1;
    profile.totalJobs += 1;

    // Recalculate success score
    profile.calculateSuccessScore();

    await profile.save();

    return NextResponse.json({ message: 'Review submitted successfully' });
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json(
      { error: 'Error submitting review' },
      { status: 500 }
    );
  }
}