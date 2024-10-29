"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, Briefcase, UserCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const isWebContainer = process.env.NEXT_PUBLIC_ENV_MODE === 'webcontainer';

export default function HomeownerDashboard() {
  const router = useRouter();
  const { user, checkAuth } = useAuth();

  useEffect(() => {
    if (!checkAuth()) {
      router.push('/login');
      return;
    }
    
    if (!isWebContainer && user?.activeRole !== 'homeowner') {
      router.push('/dashboard/contractor');
    }
  }, [user?.activeRole, router, checkAuth]);

  if (!user || (!isWebContainer && user.activeRole !== 'homeowner')) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex justify-between items-center mb-8 sticky top-20 bg-background z-10 pb-4">
        <h1 className="text-3xl font-bold">Homeowner Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user.name}!</p>
      </div>

      {isWebContainer && (
        <Alert variant="warning" className="mb-8">
          <AlertDescription>
            Web Container Mode: You have access to both homeowner and contractor features
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Post a New Job
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">Create a new job listing for contractors to bid on.</p>
            <Button asChild className="w-full">
              <Link href="/post-job">Post a Job</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              My Active Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">View and manage your current job listings.</p>
            <Button asChild className="w-full">
              <Link href="/my-jobs">View Jobs</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="h-5 w-5" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">Update your profile information and settings.</p>
            <Button asChild className="w-full">
              <Link href="/profile">Edit Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
