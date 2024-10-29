"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BarChart3, Home, Briefcase } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const isWebContainer = process.env.NEXT_PUBLIC_ENV_MODE === 'webcontainer';

export default function Dashboard() {
  const router = useRouter();
  const { user, checkAuth } = useAuth();

  useEffect(() => {
    if (!checkAuth()) {
      router.push('/login');
      return;
    }
    
    if (!isWebContainer) {
      if (user?.activeRole === 'homeowner') {
        router.push('/dashboard/homeowner');
      } else if (user?.activeRole === 'contractor') {
        router.push('/dashboard/contractor');
      }
    }
  }, [user?.activeRole, router, checkAuth]);

  if (!user) {
    return null;
  }

  if (!isWebContainer) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex justify-between items-center mb-8 sticky top-20 bg-background z-10 pb-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user.name}!</p>
      </div>

      <Alert variant="warning" className="mb-8">
        <AlertDescription>
          Web Container Mode: Access both homeowner and contractor dashboards
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Homeowner Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">Access homeowner features and post jobs.</p>
            <Button asChild className="w-full">
              <Link href="/dashboard/homeowner">Go to Homeowner Dashboard</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Contractor Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">Access contractor features and find work.</p>
            <Button asChild className="w-full">
              <Link href="/dashboard/contractor">Go to Contractor Dashboard</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">View platform analytics and insights.</p>
            <Button asChild className="w-full">
              <Link href="/dashboard/analytics">View Analytics</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
