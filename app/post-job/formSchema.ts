import * as z from "zod";

export const formSchema = z.object({
  title: z.string().min(10, {
    message: "Title must be at least 10 characters.",
  }),
  category: z.string(),
  location: z.string(),
  skills: z.array(z.string()).default([]),
  scope: z.enum(['small', 'medium', 'large']),
  duration: z.string(),
  experienceLevel: z.enum(['entry', 'intermediate', 'expert']),
  budgetType: z.enum(['fixed', 'hourly']),
  budget: z.number().optional(),
  minHourlyRate: z.number().optional(),
  maxHourlyRate: z.number().optional(),
  estimatedHours: z.number().optional(),
  useMilestones: z.boolean(),
  milestones: z.array(z.object({
    name: z.string(),
    budget: z.number()
  })).optional(),
  description: z.string(),
  screeningQuestions: z.array(z.string()).optional(),
  visibility: z.enum(['public', 'invite-only']).default('public'),
  preferredLanguages: z.array(z.string()).optional(),
  projectType: z.enum(['one-time', 'ongoing']).default('one-time'),
});