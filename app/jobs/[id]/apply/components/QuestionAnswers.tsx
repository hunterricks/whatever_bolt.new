"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface QuestionAnswersProps {
  questions: string[];
  form: UseFormReturn<any>;
}

export default function QuestionAnswers({ questions, form }: QuestionAnswersProps) {
  if (!questions?.length) return null;

  return (
    <div className="space-y-6">
      <h3 className="font-medium">Screening Questions</h3>
      {questions.map((question, index) => (
        <FormField
          key={index}
          control={form.control}
          name={`answers.${index}`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{question}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Your answer..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  );
}