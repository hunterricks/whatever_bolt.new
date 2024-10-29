import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Job from '@/models/Job';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    await dbConnect();

    const totalJobsPosted = await Job.countDocuments({ postedBy: decoded.userId });
    const totalJobsCompleted = await Job.countDocuments({ postedBy: decoded.userId, status: 'completed' });

    const aggregateResult = await Job.aggregate([
      { $match: { postedBy: decoded.userId } },
      { $group: { _id: null, averageBudget: { $avg: "$budget" } } }
    ]);
    const averageJobBudget = aggregateResult[0]?.averageBudget || 0;

    const jobsByCategory = await Job.aggregate([
      { $match: { postedBy: decoded.userId } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $project: { category: "$_id", count: 1, _id: 0 } }
    ]);

    const analytics = {
      totalJobsPosted,
      totalJobsCompleted,
      averageJobBudget,
      jobsByCategory
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Error fetching analytics' }, { status: 500 });
  }
}
