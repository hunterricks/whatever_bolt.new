import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Job from '@/models/Job';
import stripe from '@/lib/stripe';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    await dbConnect();
    const { jobId } = await request.json();

    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (job.postedBy.toString() !== decoded.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (job.paymentStatus !== 'escrow') {
      return NextResponse.json({ error: 'Payment is not in escrow' }, { status: 400 });
    }

    await stripe.paymentIntents.capture(job.paymentIntentId);

    await Job.findByIdAndUpdate(jobId, {
      paymentStatus: 'released',
      status: 'completed',
    });

    return NextResponse.json({ message: 'Payment released successfully' });
  } catch (error) {
    console.error('Error releasing payment:', error);
    return NextResponse.json({ error: 'Error releasing payment' }, { status: 500 });
  }
}
