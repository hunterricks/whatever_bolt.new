"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/reviews/StarRating";
import { formatDistanceToNow } from "date-fns";

interface Review {
  rating: number;
  comment: string;
  reviewerName: string;
  createdAt: Date;
}

interface ProfileMetricsProps {
  totalJobs: number;
  completedJobs: number;
  totalEarnings: number;
  recentReviews: Review[];
  skills: string[];
}

export function ProfileMetrics({
  totalJobs,
  completedJobs,
  totalEarnings,
  recentReviews,
  skills
}: ProfileMetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Skills & Expertise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Job Summary</CardTitle>
          <CardDescription>Overall job performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Total Jobs</dt>
              <dd className="text-2xl font-bold">{totalJobs}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Completed Jobs</dt>
              <dd className="text-2xl font-bold">{completedJobs}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Total Earnings</dt>
              <dd className="text-2xl font-bold">
                ${totalEarnings.toLocaleString()}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reviews</CardTitle>
          <CardDescription>Latest client feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReviews.map((review, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <StarRating value={review.rating} readonly size="sm" onChange={() => {}} />
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(review.createdAt, { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm">{review.comment}</p>
                <p className="text-xs text-muted-foreground">
                  by {review.reviewerName}
                </p>
                {index < recentReviews.length - 1 && <hr className="my-2" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}