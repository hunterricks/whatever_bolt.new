"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";

export default function DescriptionStep() {
  const form = useFormContext();

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your project in detail..."
                className="min-h-[200px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Include specific requirements, deliverables, and any important details that will help contractors understand your needs.
              
              Consider including:
              - Specific tasks to be completed
              - Required materials or equipment
              - Timeline and milestones
              - Any specific requirements or preferences
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}