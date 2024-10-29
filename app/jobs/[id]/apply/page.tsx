"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

const formSchema = z.object({
  coverLetter: z.string().min(100, {
    message: "Cover letter must be at least 100 characters.",
  }).max(2000, {
    message: "Cover letter cannot exceed 2000 characters."
  }),
  proposedRate: z.coerce.number().min(1, {
    message: "Please enter a valid rate.",
  }),
  estimatedDuration: z.string().min(1, {
    message: "Please specify an estimated duration.",
  }),
  availability: z.string().min(1, {
    message: "Please specify your availability.",
  }),
});

export default function ApplyToJob() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { id: jobId } = useParams();
  const { user, checkAuth } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      coverLetter: "",
      proposedRate: 0,
      estimatedDuration: "",
      availability: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!checkAuth() || user?.activeRole !== 'contractor') {
      toast.error("You must be logged in as a contractor to apply");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          jobId,
          contractorId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      toast.success("Application submitted successfully!");
      router.push(`/jobs/${jobId}`);
    } catch (error) {
      toast.error("Error submitting application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!checkAuth() || user?.activeRole !== 'contractor') {
    return null;
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Apply for Job</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="coverLetter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Letter</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Introduce yourself and explain why you're the best fit for this job..."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Highlight your relevant experience and approach to this project
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="proposedRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proposed Rate ($)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your proposed rate for this project (per hour or fixed price)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estimatedDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Duration</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 2 weeks" {...field} />
                    </FormControl>
                    <FormDescription>
                      How long you expect the project to take
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Available immediately, can start next week" {...field} />
                    </FormControl>
                    <FormDescription>
                      When can you start and what's your availability?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}