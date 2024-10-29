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
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";

export default function DurationStep() {
  const form = useFormContext();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          How long will your project take?
        </h2>
        <p className="text-muted-foreground">
          Choose the best estimate based on your project's scope. This helps professionals plan their availability.
        </p>
      </div>

      <FormField
        control={form.control}
        name="duration"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid gap-4"
              >
                {[
                  {
                    value: "1-3",
                    title: "1-3 Months",
                    description: "Short-term project, ideal for focused improvements"
                  },
                  {
                    value: "3-6",
                    title: "3-6 Months",
                    description: "Medium-term project, suitable for larger renovations"
                  },
                  {
                    value: "6+",
                    title: "6+ Months",
                    description: "Long-term project, perfect for complete home renovations"
                  }
                ].map((option) => (
                  <Label
                    key={option.value}
                    className={cn(
                      "flex flex-col items-start rounded-lg border p-4 cursor-pointer hover:border-primary",
                      field.value === option.value && "border-primary bg-primary/5"
                    )}
                  >
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium">{option.title}</p>
                        <RadioGroupItem value={option.value} className="ml-4" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}