"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

interface Proposal {
  _id: string;
  job: {
    _id: string;
    title: string;
    status: string;
  };
  price: number;
  estimatedDuration: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export default function MyProposals() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
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

    fetchProposals();
  }, [user, router, checkAuth]);

  const fetchProposals = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/proposals?contractorId=${user.id}`);
      if (!response.ok) throw new Error('Failed to fetch proposals');
      const data = await response.json();
      setProposals(data);
    } catch (error) {
      console.error('Error fetching proposals:', error);
      toast.error('Failed to load proposals');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const getStatusBadge = (status: Proposal['status']) => {
    const variants: Record<Proposal['status'], "secondary" | "default" | "destructive"> = {
      pending: 'secondary',
      accepted: 'default',
      rejected: 'destructive'
    };
    
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  if (!user || user.activeRole !== 'contractor') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex justify-between items-center mb-8 sticky top-20 bg-background z-10 pb-4">
        <h1 className="text-3xl font-bold">My Proposals</h1>
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
          {proposals.map((proposal) => (
            <Card key={proposal._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-2">
                      {proposal.job.title}
                    </CardTitle>
                    {getStatusBadge(proposal.status)}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${proposal.price}</p>
                    <p className="text-sm text-muted-foreground">
                      {proposal.estimatedDuration}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Submitted on {new Date(proposal.createdAt).toLocaleDateString()}
                  </p>
                  <Button asChild>
                    <Link href={`/jobs/${proposal.job._id}`}>View Job</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {!isLoading && proposals.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">You haven't submitted any proposals yet.</p>
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
