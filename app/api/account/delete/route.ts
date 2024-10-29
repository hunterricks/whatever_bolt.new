import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Job from '@/models/Job';
import Proposal from '@/models/Proposal';
import Review from '@/models/Review';

const isWebContainer = process.env.NEXT_PUBLIC_ENV_MODE === 'webcontainer';

export async function DELETE() {
  try {
    if (isWebContainer) {
      // In web container, just return success
      return NextResponse.json({ message: 'Account deleted successfully' });
    }

    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Delete all user data
    await Promise.all([
      // Delete user profile
      User.findByIdAndDelete(session.user.sub),
      
      // Delete jobs posted by user
      Job.deleteMany({ postedBy: session.user.sub }),
      
      // Delete proposals
      Proposal.deleteMany({ serviceProvider: session.user.sub }),
      
      // Delete reviews
      Review.deleteMany({
        $or: [
          { reviewer: session.user.sub },
          { reviewee: session.user.sub }
        ]
      }),
    ]);

    // Delete Auth0 user
    const auth0Response = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${session.user.sub}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${process.env.AUTH0_MANAGEMENT_API_TOKEN}`,
      },
    });

    if (!auth0Response.ok) {
      throw new Error('Failed to delete Auth0 user');
    }

    return NextResponse.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}