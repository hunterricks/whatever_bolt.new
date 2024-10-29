"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "./StarRating";
import { toast } from "sonner";

const reviewSchema = z.object({
  publicRating: z.number().min(1).max(5),
  privateRating: z.number().min(1).max(5),
  comment: z.string().min(10, {
    message: "Comment must be at least 10 characters.",
  }),
  privateComment: z.string().optional(),
});

interface ReviewFormProps {
  jobId: string;
  providerId: string;
  onSuccess: () => void;
}

export function ReviewForm({ jobId, providerId, onSuccess }: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      publicRating: 0,
      privateRating: 0,
      comment: "",
      privateComment: "",
    },
  });

  async function onSubmit(values: z.infer<typeof reviewSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          providerId,
          ...values,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit review');

      toast.success("Review submitted successfully!");
      onSuccess();
    } catch (error) {
      toast.error("Error submitting review");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="publicRating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Public Rating</FormLabel>
              <FormControl>
                <StarRating
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                This rating will be visible to other users
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Public Comment</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your experience..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Your public feedback helps others make informed decisions
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Private Feedback</h3>
          <p className="text-sm text-muted-foreground mb-4">
            This feedback is only visible to the service provider and helps them improve
          </p>

          <FormField
            control={form.control}
            name="privateRating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Private Rating</FormLabel>
                <FormControl>
                  <StarRating
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="privateComment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Private Comment</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Share private feedback..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </Form>
  );
}