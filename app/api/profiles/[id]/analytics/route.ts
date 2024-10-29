import { NextResponse } from 'next/server';
import { getProfileAnalytics } from '@/lib/analytics/getProfileAnalytics';
import { NextRequest } from 'next/server';

type RouteParams = {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { searchParams } = new URL(request.url);
    const period = (searchParams.get('period') || 'month') as 'day' | 'week' | 'month' | 'year';

    const analytics = await getProfileAnalytics(params.id, period);
    
    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching profile analytics:', error);
    return NextResponse.json(
      { error: 'Error fetching profile analytics' },
      { status: 500 }
    );
  }
}