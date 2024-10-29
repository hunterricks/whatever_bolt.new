import ProfileAnalytics from '@/models/ProfileAnalytics';
import { subDays, subMonths, startOfDay, endOfDay } from 'date-fns';

export async function getProfileAnalytics(profileId: string, period: 'day' | 'week' | 'month' | 'year') {
  const today = new Date();
  let startDate;

  switch (period) {
    case 'day':
      startDate = startOfDay(today);
      break;
    case 'week':
      startDate = subDays(today, 7);
      break;
    case 'month':
      startDate = subMonths(today, 1);
      break;
    case 'year':
      startDate = subMonths(today, 12);
      break;
  }

  try {
    const analytics = await ProfileAnalytics.find({
      profileId,
      date: {
        $gte: startDate,
        $lte: endOfDay(today)
      }
    }).sort({ date: 1 });

    return analytics;
  } catch (error) {
    console.error('Error fetching profile analytics:', error);
    throw error;
  }
}