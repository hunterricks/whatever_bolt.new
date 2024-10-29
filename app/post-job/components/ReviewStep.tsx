"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function ReviewStep() {
  const form = useFormContext();
  const values = form.getValues();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const hasValidationErrors = Object.keys(form.formState.errors).length > 0;

  if (hasValidationErrors) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please fix the errors in previous steps before submitting your job post.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Review your job post before submitting. Make sure all the details are correct.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>{values.title}</CardTitle>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline">{values.category}</Badge>
            <Badge variant="outline">{values.scope} Project</Badge>
            <Badge variant="outline">{values.experienceLevel}</Badge>
            <Badge variant="outline">{values.duration} months</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Location</h3>
            <p className="text-muted-foreground">{values.location}</p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {values.skills.map((skill: string) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Budget</h3>
            {values.budgetType === 'fixed' ? (
              <p>Fixed Price: {formatCurrency(values.budget)}</p>
            ) : (
              <p>
                Hourly Rate: {formatCurrency(values.minHourlyRate)} - {formatCurrency(values.maxHourlyRate)}/hr
                {values.estimatedHours > 0 && ` (Est. ${values.estimatedHours} hours)`}
              </p>
            )}
            {values.useMilestones && values.milestones?.length > 0 && (
              <div className="mt-2">
                <h4 className="text-sm font-medium mb-1">Milestones:</h4>
                <ul className="space-y-1">
                  {values.milestones.map((milestone: any, index: number) => (
                    <li key={index} className="text-sm">
                      {milestone.name}: {formatCurrency(milestone.budget)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-medium mb-2">Project Description</h3>
            <p className="whitespace-pre-wrap text-muted-foreground">
              {values.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}