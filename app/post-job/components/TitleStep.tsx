"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function TitleStep() {
  const form = useFormContext();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          Let's start with a strong title
        </h2>
        <p className="text-muted-foreground">
          This is the first thing professionals will see. A great title is short and descriptive.
        </p>
      </div>

      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Write a title for your job post</FormLabel>
            <FormControl>
              <Input 
                placeholder="e.g., Need experienced plumber for bathroom renovation" 
                {...field}
                className="text-lg"
              />
            </FormControl>
            <FormDescription>
              Keep it clear and concise
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <Card className="p-4 bg-muted/50 border-none">
        <div className="flex gap-2">
          <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0" />
          <div className="space-y-2">
            <h3 className="font-medium">Example titles that work well:</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• "Full Kitchen Remodel - Modern Design with Island"</li>
              <li>• "Experienced Plumber Needed for Bathroom Renovation"</li>
              <li>• "Install New Hardwood Flooring in Living Room (400 sq ft)"</li>
              <li>• "Paint Interior of 3-Bedroom House - Walls and Trim"</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}