import ProfileAnalytics from '@/models/ProfileAnalytics';
import { startOfDay } from 'date-fns';

export async function trackProfileMetrics(profileId: string, metrics: {
  successScore?: number;
  rating?: number;
  responseRate?: number;
  responseTime?: number;
  completionRate?: number;
  activeJobs?: number;
  earnings?: number;
}) {
  const today = startOfDay(new Date());

  try {
    // Find or create today's analytics document
    let analytics = await ProfileAnalytics.findOne({
      profileId,
      date: today
    });

    if (!analytics) {
      analytics = new ProfileAnalytics({
        profileId,
        date: today,
        metrics: {},
        dailyStats: {
          totalResponses: 0,
          averageResponseTime: 0,
          newJobs: 0,
          completedJobs: 0,
          canceledJobs: 0,
          revenue: 0
        }
      });
    }

    // Update metrics
    analytics.metrics = {
      ...analytics.metrics,
      ...metrics
    };

    await analytics.save();
    return analytics;
  } catch (error) {
    console.error('Error tracking profile metrics:', error);
    throw error;
  }
}