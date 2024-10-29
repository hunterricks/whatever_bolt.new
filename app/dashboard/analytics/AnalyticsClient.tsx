"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface AnalyticsData {
  totalJobsPosted: number;
  totalJobsCompleted: number;
  averageJobBudget: number;
  jobsByCategory: { category: string; count: number }[];
}

export default function AnalyticsClient({ analyticsData }: { analyticsData: AnalyticsData }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Job Analytics</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Jobs Posted</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{analyticsData.totalJobsPosted}</p>
          </CardContent>
        </Card>
        {/* ... other cards ... */}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Jobs by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.jobsByCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}