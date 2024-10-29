"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from 'next/link';
import Messaging from '@/components/Messaging';

interface Job {
  _id: string;
  title: string;
  description: string;
  budget: number;
  location: string;
  timeline: string;
  status: string;
  postedBy: string;
  postedByName: string;
}

interface Proposal {
  _id: string;
  status: string;
  coverLetter: string;
  price: number;
  estimatedDuration: string;
  serviceProvider: {
    _id: string;
    name: string;
  };
}

export default function JobPage() {
  const { id } = useParams();
  const { user, checkAuth } = useAuth();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);

  useEffect(() => {
    if (!checkAuth()) {
      router.push('/login');
      return;
    }
    if (id && typeof id === 'string') {
      fetchJobDetails();
      if (user?.activeRole === 'contractor') {
        fetchMyProposal();
      } else if (user?.activeRole === 'homeowner') {
        fetchAllProposals();
      }
    } else {
      toast.error("Invalid job ID");
      router.push('/browse-jobs');
    }
  }, [id, user, router, checkAuth]);

  const fetchJobDetails = async () => {
    try {
      const response = await fetch(`/api/jobs/${id}`);
      if (!response.ok) throw new Error('Failed to fetch job details');
      const data: Job = await response.json();
      setJob(data);
    } catch (error) {
      toast.error("Error fetching job details");
    }
  };

  const fetchMyProposal = async () => {
    try {
      const response = await fetch(`/api/proposals?jobId=${id}&serviceProvider=${user?.id}`);
      if (!response.ok) throw new Error('Failed to fetch proposal');
      const data: Proposal[] = await response.json();
      if (data.length > 0) {
        setProposal(data[0]);
      }
    } catch (error) {
      toast.error("Error fetching proposal");
    }
  };

  const fetchAllProposals = async () => {
    try {
      const response = await fetch(`/api/proposals?jobId=${id}`);
      if (!response.ok) throw new Error('Failed to fetch proposals');
      const data: Proposal[] = await response.json();
      setProposals(data);
    } catch (error) {
      toast.error("Error fetching proposals");
    }
  };

  const handleAcceptProposal = async (proposalId: string) => {
    try {
      const response = await fetch(`/api/proposals/${proposalId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'accepted' }),
      });

      if (!response.ok) throw new Error('Failed to accept proposal');
      toast.success("Proposal accepted successfully!");
      fetchJobDetails();
      fetchAllProposals();
    } catch (error) {
      toast.error("Error accepting proposal");
    }
  };

  const canMessage = () => {
    if (user?.activeRole === 'homeowner' && job?.postedBy === user.id) {
      return true;
    }
    if (user?.activeRole === 'contractor' && proposal?.status === 'accepted') {
      return true;
    }
    return false;
  };

  if (!job) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
        <p className="text-muted-foreground mb-4">{job.description}</p>
        <div className="flex flex-wrap gap-4">
          <Badge variant="outline">Budget: ${job.budget}</Badge>
          <Badge variant="outline">Location: {job.location}</Badge>
          <Badge variant="outline">Timeline: {job.timeline}</Badge>
          <Badge>{job.status}</Badge>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          {user?.activeRole === 'homeowner' && <TabsTrigger value="proposals">Proposals</TabsTrigger>}
          {canMessage() && <TabsTrigger value="messages">Messages</TabsTrigger>}
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardContent className="pt-6">
              {user?.activeRole === 'contractor' && job.status === 'open' && !proposal && (
                <Button asChild>
                  <Link href={`/jobs/${id}/submit-proposal`}>Submit Proposal</Link>
                </Button>
              )}
              {proposal && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Your Proposal</h3>
                  <Badge className="mb-4">{proposal.status}</Badge>
                  <p className="text-muted-foreground">{proposal.coverLetter}</p>
                  <div className="flex gap-4">
                    <p><strong>Price:</strong> ${proposal.price}</p>
                    <p><strong>Duration:</strong> {proposal.estimatedDuration}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {user?.activeRole === 'homeowner' && (
          <TabsContent value="proposals">
            <Card>
              <CardHeader>
                <CardTitle>Submitted Proposals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {proposals.map((proposal) => (
                    <Card key={proposal._id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-semibold">{proposal.serviceProvider.name}</h4>
                            <Badge className="mt-1">{proposal.status}</Badge>
                          </div>
                          {proposal.status === 'pending' && job.status === 'open' && (
                            <Button onClick={() => handleAcceptProposal(proposal._id)}>
                              Accept Proposal
                            </Button>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-4">{proposal.coverLetter}</p>
                        <div className="flex gap-4">
                          <p><strong>Price:</strong> ${proposal.price}</p>
                          <p><strong>Duration:</strong> {proposal.estimatedDuration}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {proposals.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      No proposals received yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {canMessage() && (
          <TabsContent value="messages">
            <Card>
              <CardContent className="p-0">
                <Messaging
                  jobId={job._id}
                  otherUserId={user?.activeRole === 'homeowner' 
                    ? proposal?.serviceProvider._id ?? '' 
                    : job.postedBy ?? ''}
                  otherUserName={user?.activeRole === 'homeowner' 
                    ? proposal?.serviceProvider.name ?? 'Contractor' 
                    : job.postedByName ?? 'Homeowner'}
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
