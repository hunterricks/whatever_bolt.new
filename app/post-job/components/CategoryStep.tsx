"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { value: "renovation", label: "Home Renovation", description: "Full or partial home renovations" },
  { value: "plumbing", label: "Plumbing", description: "Repairs, installations, and maintenance" },
  { value: "electrical", label: "Electrical", description: "Wiring, fixtures, and electrical systems" },
  { value: "painting", label: "Painting", description: "Interior and exterior painting" },
  { value: "landscaping", label: "Landscaping", description: "Outdoor design and maintenance" },
  { value: "cleaning", label: "Cleaning", description: "Deep cleaning and maintenance" },
  { value: "other", label: "Other Services", description: "Other home improvement services" },
];

export default function CategoryStep() {
  const form = useFormContext();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          Choose a category
        </h2>
        <p className="text-muted-foreground">
          This helps us match you with the right professionals for your project.
        </p>
      </div>

      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem className="space-y-4">
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid gap-4"
              >
                {categories.map((category) => (
                  <Label
                    key={category.value}
                    className={cn(
                      "flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:border-primary",
                      field.value === category.value && "border-primary bg-primary/5"
                    )}
                    onClick={() => field.onChange(category.value)}
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{category.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                    <RadioGroupItem value={category.value} className="ml-4" />
                  </Label>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {form.watch('category') && (
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g., New York, NY" {...field} />
              </FormControl>
              <FormDescription>
                Where will this work take place?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {form.watch('category') && (
        <Card className="p-4 bg-muted/50 border-none">
          <div className="flex gap-2">
            <Lightbulb className="h-5 w-5 text-muted-foreground shrink-0" />
            <div>
              <h3 className="font-medium">Why is this important?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Choosing the right category ensures your job reaches professionals with the specific skills and experience you need. This leads to more relevant proposals and better matches.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}