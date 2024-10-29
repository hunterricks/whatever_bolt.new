"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Plus, Minus } from "lucide-react";

interface Milestone {
  name: string;
  budget: number;
}

export default function PaymentStep() {
  const [milestones, setMilestones] = useState<Milestone[]>([
    { name: "", budget: 0 },
  ]);
  const form = useFormContext();

  const addMilestone = () => {
    setMilestones([...milestones, { name: "", budget: 0 }]);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const updateMilestone = (index: number, field: keyof Milestone, value: string | number) => {
    const newMilestones = [...milestones];
    newMilestones[index] = {
      ...newMilestones[index],
      [field]: field === 'budget' ? Number(value) || 0 : value,
    };
    setMilestones(newMilestones);
    
    // Update total budget if using milestones
    if (form.watch('budgetType') === 'fixed') {
      const total = newMilestones.reduce((sum, m) => sum + (m.budget || 0), 0);
      form.setValue('budget', total);
    }
  };

  const getMarketRateHint = () => {
    const skills = form.watch('skills') || [];
    const scope = form.watch('scope');

    if (skills.includes('Plumbing')) {
      return {
        hourly: '$50-$150',
        fixed: {
          small: '$100-$500',
          medium: '$500-$2000',
          large: '$2000-$10000'
        }
      };
    }
    return {
      hourly: '$25-$100',
      fixed: {
        small: '$100-$1000',
        medium: '$1000-$5000',
        large: '$5000+'
      }
    };
  };

  const rates = getMarketRateHint();

  return (
    <div className="space-y-8">
      <FormField
        control={form.control}
        name="budgetType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>How would you like to pay?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <Label
                  className={cn(
                    "flex flex-col items-start justify-between rounded-lg border p-4 cursor-pointer hover:border-primary",
                    field.value === "fixed" && "border-primary bg-primary/5"
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="space-y-1">
                      <p className="font-medium">Fixed Price</p>
                      <p className="text-sm text-muted-foreground">
                        Pay a fixed amount for the entire project
                      </p>
                    </div>
                    <RadioGroupItem value="fixed" />
                  </div>
                </Label>
                <Label
                  className={cn(
                    "flex flex-col items-start justify-between rounded-lg border p-4 cursor-pointer hover:border-primary",
                    field.value === "hourly" && "border-primary bg-primary/5"
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="space-y-1">
                      <p className="font-medium">Hourly Rate</p>
                      <p className="text-sm text-muted-foreground">
                        Pay based on hours worked
                      </p>
                    </div>
                    <RadioGroupItem value="hourly" />
                  </div>
                </Label>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {form.watch("budgetType") === "hourly" ? (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="minHourlyRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Hourly Rate ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                    value={field.value || 0}
                  />
                </FormControl>
                <FormDescription>
                  Typical hourly rates for this type of work: {rates.hourly}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxHourlyRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Hourly Rate ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                    value={field.value || 0}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estimatedHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Hours (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                    value={field.value || 0}
                  />
                </FormControl>
                <FormDescription>
                  Estimate how many hours you think the project will take
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="useMilestones"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Enable Milestones</FormLabel>
                  <FormDescription>
                    Break your project into phases with separate payments
                  </FormDescription>
                </div>
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="accent-primary"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {form.watch("useMilestones") ? (
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-1 space-y-2">
                    <Label>Milestone Name</Label>
                    <Input
                      value={milestone.name}
                      onChange={(e) => updateMilestone(index, 'name', e.target.value)}
                      placeholder={`Phase ${index + 1}`}
                    />
                  </div>
                  <div className="w-1/3 space-y-2">
                    <Label>Budget ($)</Label>
                    <Input
                      type="number"
                      value={milestone.budget || 0}
                      onChange={(e) => updateMilestone(index, 'budget', Number(e.target.value) || 0)}
                      min="0"
                      step="100"
                    />
                  </div>
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeMilestone(index)}
                      className="mt-8"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addMilestone}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Milestone
              </Button>
              <p className="text-sm text-muted-foreground">
                Total Budget: ${milestones.reduce((sum, m) => sum + (m.budget || 0), 0)}
              </p>
            </div>
          ) : (
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Project Budget ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="100"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                      value={field.value || 0}
                    />
                  </FormControl>
                  <FormDescription>
                    For {form.watch('scope')} projects like this, typical budgets are around{' '}
                    {rates.fixed[form.watch('scope') as keyof typeof rates.fixed]}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      )}
    </div>
  );
}