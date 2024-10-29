import * as z from "zod";

export const formSchema = z.object({
  coverLetter: z.string().min(100, {
    message: "Cover letter must be at least 100 characters.",
  }).max(2000, {
    message: "Cover letter cannot exceed 2000 characters."
  }),
  proposedRate: z.coerce.number().min(1, {
    message: "Please enter a valid rate.",
  }),
  estimatedDuration: z.string().min(1, {
    message: "Please specify an estimated duration.",
  }),
  availability: z.string().min(1, {
    message: "Please specify your availability.",
  }),
  answers: z.array(z.string()).optional(),
  portfolio: z.array(z.object({
    title: z.string(),
    description: z.string(),
    url: z.string().url().optional(),
  })).optional(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms to submit an application.",
  }),
});