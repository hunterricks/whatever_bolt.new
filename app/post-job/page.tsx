"use client";

import { useState, useEffect } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { formSchema } from './formSchema';

// Import step components
import TitleStep from "./components/TitleStep";
import CategoryStep from "./components/CategoryStep";
import SkillsStep from "./components/SkillsStep";
import ScopeStep from "./components/ScopeStep";
import DurationStep from "./components/DurationStep";
import ExperienceStep from "./components/ExperienceStep";
import PaymentStep from "./components/PaymentStep";
import DescriptionStep from "./components/DescriptionStep";
import ReviewStep from "./components/ReviewStep";

const STEPS = [
  { title: "Title", component: TitleStep },
  { title: "Category", component: CategoryStep },
  { title: "Skills", component: SkillsStep },
  { title: "Scope", component: ScopeStep },
  { title: "Duration", component: DurationStep },
  { title: "Experience", component: ExperienceStep },
  { title: "Budget", component: PaymentStep },
  { title: "Description", component: DescriptionStep },
  { title: "Review", component: ReviewStep },
];

export default function PostJob() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { user, checkAuth } = useAuth();

  useEffect(() => {
    console.log('Current user:', user);
  }, [user]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      location: "",
      skills: [],
      scope: undefined,
      duration: undefined,
      experienceLevel: undefined,
      budgetType: "fixed",
      budget: 0,
      minHourlyRate: 0,
      maxHourlyRate: 0,
      estimatedHours: 0,
      useMilestones: false,
      milestones: [],
      description: "",
    },
  });

  useEffect(() => {
    const checkAuthAndLoadDraft = () => {
      if (!checkAuth()) {
        router.push('/login');
        return;
      }

      if (user?.activeRole !== 'homeowner') {
        router.push('/dashboard/contractor');
        return;
      }

      // Load draft from localStorage if available
      const savedDraft = localStorage.getItem('jobDraft');
      if (savedDraft) {
        try {
          const { data } = JSON.parse(savedDraft);
          form.reset(data);
        } catch (error) {
          console.error('Error loading draft:', error);
        }
      }
    };

    checkAuthAndLoadDraft();
  }, [form, router, user?.activeRole, checkAuth]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!checkAuth()) {
      toast.error("You must be logged in to post a job");
      return;
    }

    setIsSubmitting(true);

    console.log('Submitting with user ID:', user?.id);
    console.log('Form values:', values);

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          postedBy: user?.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || error.details || 'Failed to create job');
      }

      // Clear draft after successful submission
      localStorage.removeItem('jobDraft');
      
      toast.success("Job posted successfully!");
      router.push('/dashboard/homeowner');
    } catch (error: any) {
      console.error('Error posting job:', error);
      toast.error(error.message || "Error posting job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentStep = STEPS[step - 1].component;
  const progress = (step / STEPS.length) * 100;

  const nextStep = async () => {
    const fields = getFieldsForStep(step) as (keyof z.infer<typeof formSchema>)[];
    const isValid = await form.trigger(fields);
    
    if (isValid) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const getFieldsForStep = (stepNumber: number): (keyof z.infer<typeof formSchema>)[] => {
    switch (stepNumber) {
      case 1: return ["title"];
      case 2: return ["category", "location"];
      case 3: return ["skills"];
      case 4: return ["scope"];
      case 5: return ["duration"];
      case 6: return ["experienceLevel"];
      case 7: return ["budgetType", "budget", "minHourlyRate", "maxHourlyRate"];
      case 8: return ["description"];
      default: return [];
    }
  };

  const getNextButtonText = () => {
    if (step === STEPS.length) return "Post Job";
    return `Next: ${STEPS[step].title}`;
  };

  if (!checkAuth() || user?.activeRole !== 'homeowner') {
    return null;
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Post a New Job</h1>
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground mt-2">
          Step {step} of {STEPS.length}: {STEPS[step - 1].title}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardContent className="pt-6">
              <CurrentStep form={form} />
            </CardContent>
          </Card>

          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const formData = form.getValues();
                  localStorage.setItem('jobDraft', JSON.stringify({
                    data: formData,
                    savedAt: new Date().toISOString(),
                  }));
                  toast.success("Draft saved successfully!");
                }}
              >
                Save Draft
              </Button>
            </div>
            
            {step === STEPS.length ? (
              <Button 
                type="submit" 
                disabled={isSubmitting || Object.keys(form.formState.errors).length > 0}
              >
                {isSubmitting ? "Posting..." : "Post Job"}
              </Button>
            ) : (
              <Button type="button" onClick={nextStep}>
                {getNextButtonText()}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
