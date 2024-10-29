import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

const isWebContainer = process.env.NEXT_PUBLIC_ENV_MODE === 'webcontainer';

export async function GET() {
  try {
    const token = cookies().get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No token found' }, { status: 401 });
    }

    // For web container, return mock session
    if (isWebContainer) {
      const mockUser = {
        id: 'mock-user',
        name: 'Web Container User',
        email: 'user@webcontainer.test',
        roles: ['homeowner', 'contractor'],
        activeRole: 'homeowner',
      };
      return NextResponse.json({ user: mockUser });
    }

    // Regular session handling
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    await dbConnect();
    
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }
}