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
  coverLetter: z.string().min(50, {
    message: "Cover letter must be at least 50 characters.",
  }),
  price: z.coerce.number().min(1, {
    message: "Please enter a valid price.",
  }),
  estimatedDuration: z.string().min(1, {
    message: "Please specify an estimated duration.",
  }),
});

export default function SubmitProposal() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { id: jobId } = useParams();
  const { user, checkAuth } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      coverLetter: "",
      price: 0,
      estimatedDuration: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!checkAuth() || user?.activeRole !== 'contractor') {
      toast.error("You must be logged in as a contractor to submit proposals");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          jobId,
          serviceProvider: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit proposal');
      }

      toast.success("Proposal submitted successfully!");
      router.push(`/jobs/${jobId}`);
    } catch (error) {
      toast.error("Error submitting proposal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!checkAuth() || user?.activeRole !== 'contractor') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Submit a Proposal</CardTitle>
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
                        placeholder="Explain why you're the best fit for this job..."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe your experience and approach to this project
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="100" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your proposed price for this project
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
                        <Input placeholder="e.g., 2-3 weeks" {...field} />
                      </FormControl>
                      <FormDescription>
                        How long you expect the project to take
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Submitting..." : "Submit Proposal"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
