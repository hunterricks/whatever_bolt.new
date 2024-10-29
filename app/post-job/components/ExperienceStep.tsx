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

export default function ExperienceStep() {
  const form = useFormContext();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          What level of expertise do you need?
        </h2>
        <p className="text-muted-foreground">
          Choose the experience level that best matches your project's complexity and requirements.
        </p>
      </div>

      <FormField
        control={form.control}
        name="experienceLevel"
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
                    value: "entry",
                    title: "Entry Level",
                    description: "Newer professionals with basic experience. Best for simple tasks and smaller projects."
                  },
                  {
                    value: "intermediate",
                    title: "Intermediate",
                    description: "Experienced professionals with a proven track record. Good for most standard projects."
                  },
                  {
                    value: "expert",
                    title: "Expert",
                    description: "Top professionals with extensive experience. Ideal for complex or specialized projects."
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