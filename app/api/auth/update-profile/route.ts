import { NextResponse } from 'next/server';
import { getSession, updateUser } from '@auth0/nextjs-auth0';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const data = await request.json();
    const { user_id } = session.user;

    // Update user metadata in Auth0
    await updateUser(user_id, {
      name: data.name,
      user_metadata: {
        ...data.user_metadata,
      },
    });

    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}