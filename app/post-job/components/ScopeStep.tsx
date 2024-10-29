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

export default function ScopeStep() {
  const form = useFormContext();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          What's the size of your project?
        </h2>
        <p className="text-muted-foreground">
          This helps us match you with professionals who handle projects of this scope.
        </p>
      </div>

      <FormField
        control={form.control}
        name="scope"
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
                    value: "small",
                    title: "Small Project",
                    description: "Quick, straightforward tasks (e.g., fixing a leaky faucet, painting a room)",
                    details: [
                      "Usually takes a few days",
                      "Simple, well-defined tasks",
                      "Minimal planning required"
                    ]
                  },
                  {
                    value: "medium",
                    title: "Medium Project",
                    description: "Well-defined projects (e.g., bathroom remodel, deck construction)",
                    details: [
                      "Takes a few weeks to complete",
                      "May require multiple skills",
                      "Some planning and coordination needed"
                    ]
                  },
                  {
                    value: "large",
                    title: "Large Project",
                    description: "Complex projects (e.g., full house renovation, new construction)",
                    details: [
                      "Takes months to complete",
                      "Multiple phases and contractors",
                      "Extensive planning required"
                    ]
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
                      <p className="text-sm text-muted-foreground mb-2">
                        {option.description}
                      </p>
                      <ul className="text-sm text-muted-foreground list-disc list-inside">
                        {option.details.map((detail, index) => (
                          <li key={index}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </FormControl>
            <FormDescription>
              Choose the size that best matches your project's complexity and requirements
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}