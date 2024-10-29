import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

const isWebContainer = process.env.NEXT_PUBLIC_ENV_MODE === 'webcontainer';

// Define constant mock users
const MOCK_USERS = {
  homeowner: {
    id: 'mock-homeowner-123',
    name: 'Hunter Ricks (Homeowner)',
    email: 'homeowner@example.com',
    roles: ['homeowner'] as const,
    activeRole: 'homeowner',
    token: 'mock-token-homeowner'
  },
  contractor: {
    id: 'mock-contractor-123',
    name: 'Hunter Ricks (Contractor)',
    email: 'contractor@example.com',
    roles: ['contractor'] as const,
    activeRole: 'contractor',
    token: 'mock-token-contractor'
  },
  dual: {
    id: 'mock-dual-123',
    name: 'Hunter Ricks (Dual)',
    email: 'dual@example.com',
    roles: ['homeowner', 'contractor'] as const,
    activeRole: 'homeowner',
    token: 'mock-token-dual'
  }
};

export async function POST(request: Request) {
  if (!isWebContainer) {
    return NextResponse.json({ error: 'Mock auth only available in web container' }, { status: 403 });
  }

  try {
    const { userType = 'dual' } = await request.json();
    const mockUser = MOCK_USERS[userType as keyof typeof MOCK_USERS];

    // Ensure mock user exists in database
    await query(`
      INSERT INTO users (id, email, name)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE name = name
    `, [mockUser.id, mockUser.email, mockUser.name]);

    return NextResponse.json({ user: mockUser });
  } catch (error) {
    console.error('Mock auth error:', error);
    return NextResponse.json({ error: 'Error during mock authentication' }, { status: 500 });
  }
}
