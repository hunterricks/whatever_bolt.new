import { NextResponse } from 'next/server';
import { startOfMonth, subMonths } from 'date-fns';
import dbConnect from '@/lib/mongodb';
import Profile from '@/models/Profile';
import Job from '@/models/Job';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const profile = await Profile.findOne({ userId: params.id });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Get jobs from the last 6 months
    const sixMonthsAgo = subMonths(new Date(), 6);
    const jobs = await Job.find({
      providerId: params.id,
      createdAt: { $gte: sixMonthsAgo }
    }).sort({ createdAt: -1 });

    // Calculate monthly ratings
    const monthlyRatings = new Map();
    jobs.forEach(job => {
      if (job.rating) {
        const month = startOfMonth(job.createdAt).toISOString();
        if (!monthlyRatings.has(month)) {
          monthlyRatings.set(month, { total: 0, count: 0 });
        }
        const current = monthlyRatings.get(month);
        current.total += job.rating;
        current.count += 1;
      }
    });

    const ratingHistory = Array.from(monthlyRatings.entries()).map(([month, data]) => ({
      month: new Date(month).toLocaleDateString('en-US', { month: 'short' }),
      rating: data.total / data.count
    }));

    // Calculate total earnings
    const totalEarnings = jobs.reduce((sum, job) => sum + (job.budget || 0), 0);

    const stats = {
      totalJobs: profile.totalJobs,
      completedJobs: profile.completedJobs,
      averageRating: profile.averageRating,
      completionRate: profile.completionRate,
      repeatClientRate: profile.repeatClientRate,
      responseRate: profile.responseRate,
      responseTime: profile.responseTime,
      totalEarnings,
      ratingHistory,
      skills: profile.skills
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching profile stats:', error);
    return NextResponse.json(
      { error: 'Error fetching profile stats' },
      { status: 500 }
    );
  }
}