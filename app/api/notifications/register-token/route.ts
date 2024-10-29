import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    await dbConnect();
    const { fcmToken } = await request.json();

    await User.findByIdAndUpdate(decoded.userId, {
      $addToSet: { fcmTokens: fcmToken },
    });

    return NextResponse.json({ message: 'Token registered successfully' });
  } catch (error) {
    console.error('Error registering FCM token:', error);
    return NextResponse.json({ error: 'Error registering token' }, { status: 500 });
  }
}
