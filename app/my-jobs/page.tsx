"use client";

import { useAuth } from "@/lib/auth";
import { useCallback, useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { toast } from "sonner";

export default function MyJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Remove useCallback to prevent re-renders
  const fetchJobs = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/jobs?userId=${user.id}&userRole=${user.activeRole}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch jobs');
      }
      
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setIsLoading(false);
    }
  };

  // Only fetch on initial mount and when user changes
  useEffect(() => {
    fetchJobs();
  }, [user?.id, user?.activeRole]); // Only depend on user ID and role

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "success" | "destructive"> = {
      open: "default",
      in_progress: "secondary",
      completed: "success",
      cancelled: "destructive"
    };
    return <Badge variant={variants[status] || "default"}>{status.replace('_', ' ')}</Badge>;
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex justify-between items-center mb-8 sticky top-20 bg-background z-10 pb-4">
        <h1 className="text-3xl font-bold">
          {user.activeRole === 'homeowner' ? 'My Posted Jobs' : 'My Active Jobs'}
        </h1>
        <Button asChild>
          <Link href={user.activeRole === 'homeowner' ? '/post-job' : '/browse-jobs'}>
            {user.activeRole === 'homeowner' ? 'Post New Job' : 'Find More Jobs'}
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        {jobs.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No jobs found.
          </div>
        ) : (
          jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                    {getStatusBadge(job.status)}
                  </div>
                  <Button asChild>
                    <Link href={`/jobs/${job.id}`}>View Details</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{job.description}</p>
                <div className="flex gap-4 text-sm">
                  <p>Budget: ${job.budget}</p>
                  <p>Location: {job.location}</p>
                  <p>Posted: {new Date(job.created_at).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
