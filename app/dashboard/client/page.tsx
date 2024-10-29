"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function ClientDashboard() {
  const router = useRouter();
  const { user, checkAuth } = useAuth();

  useEffect(() => {
    if (!checkAuth()) {
      router.push('/login');
    } else if (user?.activeRole !== 'homeowner') {
      router.push('/dashboard/contractor');
    }
  }, [user, router, checkAuth]);

  if (!user || user.activeRole !== 'homeowner') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Homeowner Dashboard</h1>
      {/* Add dashboard content here */}
    </div>
  );
}
