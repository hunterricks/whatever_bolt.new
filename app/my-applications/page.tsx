"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

interface Application {
  id: string;
  job: {
    id: string;
    title: string;
    status: string;
  };
  proposedRate: number;
  estimatedDuration: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  createdAt: string;
}

export default function MyApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, checkAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!checkAuth()) {
      router.push('/login');
      return;
    }

    if (user?.activeRole !== 'contractor') {
      router.push('/dashboard/homeowner');
      return;
    }

    fetchApplications();
  }, [user, router, checkAuth]);

  const fetchApplications = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/applications?contractorId=${user.id}`);
      if (!response.ok) throw new Error('Failed to fetch applications');
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async (applicationId: string) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'withdrawn' }),
      });

      if (!response.ok) throw new Error('Failed to withdraw application');
      
      toast.success('Application withdrawn successfully');
      fetchApplications();
    } catch (error) {
      toast.error('Error withdrawing application');
    }
  };

  const getStatusBadge = (status: Application['status']) => {
    const variants: Record<Application['status'], "default" | "secondary" | "success" | "destructive"> = {
      pending: 'secondary',
      accepted: 'success',
      rejected: 'destructive',
      withdrawn: 'default'
    };
    
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  if (!user || user.activeRole !== 'contractor') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex justify-between items-center mb-8 sticky top-20 bg-background z-10 pb-4">
        <h1 className="text-3xl font-bold">My Applications</h1>
        <Button asChild>
          <Link href="/browse-jobs">Browse More Jobs</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((application) => (
            <Card key={application.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-2">
                      {application.job.title}
                    </CardTitle>
                    {getStatusBadge(application.status)}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${application.proposedRate}</p>
                    <p className="text-sm text-muted-foreground">
                      {application.estimatedDuration}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Applied {new Date(application.createdAt).toLocaleDateString()}
                  </p>
                  <div className="space-x-2">
                    {application.status === 'pending' && (
                      <Button
                        variant="outline"
                        onClick={() => handleWithdraw(application.id)}
                      >
                        Withdraw
                      </Button>
                    )}
                    <Button asChild>
                      <Link href={`/jobs/${application.job.id}`}>View Job</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {!isLoading && applications.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">You haven't submitted any applications yet.</p>
              <Button asChild className="mt-4">
                <Link href="/browse-jobs">Browse Available Jobs</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}