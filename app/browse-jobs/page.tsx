"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { useRouter } from 'next/navigation';
import { debounce } from "@/lib/utils";

interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  category: string;
  status: string;
  location: string;
  timeline: string;
  posted_by: string;
  created_at: string;
  poster_name: string;
  skills: string[];
}

export default function BrowseJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { user, checkAuth } = useAuth();
  const router = useRouter();

  const fetchJobs = useCallback(async () => {
    if (!user?.id || !user?.activeRole) return;

    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        userId: user.id,
        userRole: user.activeRole,
        status: 'open', // Add this to specifically get open jobs
        ...(categoryFilter !== "all" ? { category: categoryFilter } : {})
      });

      const response = await fetch(`/api/jobs?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch jobs');
      
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, user?.activeRole, categoryFilter]);

  // Only fetch when category changes or on initial load
  useEffect(() => {
    if (!user) return;
    
    if (user.activeRole !== 'contractor') {
      router.push('/dashboard/homeowner');
      return;
    }

    fetchJobs();
  }, [user, categoryFilter, router, fetchJobs]); // Remove checkAuth from dependencies

  // Handle search separately
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  // Filter jobs based on search term
  const filteredJobs = useMemo(() => {
    if (!searchTerm) return jobs;
    
    return jobs.filter(job =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [jobs, searchTerm]);

  if (!user || user.activeRole !== 'contractor') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 sticky top-20 bg-background z-10 pb-4">
        <h1 className="text-3xl font-bold">Browse Jobs</h1>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <Input
            placeholder="Search jobs..."
            className="max-w-sm"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="renovation">Renovation</SelectItem>
              <SelectItem value="plumbing">Plumbing</SelectItem>
              <SelectItem value="electrical">Electrical</SelectItem>
              <SelectItem value="painting">Painting</SelectItem>
              <SelectItem value="landscaping">Landscaping</SelectItem>
              <SelectItem value="cleaning">Cleaning</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No jobs found</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                    <Badge variant="outline" className="mb-2">{job.category}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${job.budget}</p>
                    <p className="text-sm text-muted-foreground">
                      Posted {new Date(job.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {job.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills?.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <Badge variant="outline">{job.location}</Badge>
                  <Button asChild>
                    <Link href={`/jobs/${job.id}`}>View Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
