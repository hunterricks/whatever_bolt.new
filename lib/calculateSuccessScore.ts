import type { ProfileDocument } from '@/models/Profile';

export function calculateSuccessScore(profile: ProfileDocument): number {
  return profile.calculateSuccessScore();
}

export function getBadgeDescription(badge: string): string {
  const descriptions: Record<string, string> = {
    'reliable': 'Completes 95% or more of accepted jobs',
    'top-rated': 'Maintains a 4.5+ star average rating',
    'client-favorite': '50% or more clients are repeat customers',
    'quick-responder': 'Responds to 90% of inquiries within an hour',
    'experienced': 'Successfully completed 100+ jobs'
  };

  return descriptions[badge] || 'Badge description not available';
}

export function getSuccessScoreLevel(score: number): {
  level: string;
  color: string;
  description: string;
} {
  if (score >= 90) {
    return {
      level: 'Elite',
      color: 'emerald',
      description: 'Outstanding performance across all metrics'
    };
  } else if (score >= 80) {
    return {
      level: 'Expert',
      color: 'blue',
      description: 'Consistently high performance and reliability'
    };
  } else if (score >= 70) {
    return {
      level: 'Professional',
      color: 'violet',
      description: 'Solid track record and good client satisfaction'
    };
  } else if (score >= 60) {
    return {
      level: 'Rising',
      color: 'amber',
      description: 'Building reputation with positive momentum'
    };
  } else {
    return {
      level: 'New',
      color: 'gray',
      description: 'Getting started and building experience'
    };
  }
}