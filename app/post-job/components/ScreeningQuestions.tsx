"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function ScreeningQuestions() {
  const form = useFormContext();
  const [questions, setQuestions] = useState<string[]>([""]);

  const addQuestion = () => {
    if (questions.length < 5) {
      setQuestions([...questions, ""]);
      form.setValue('screeningQuestions', [...questions, ""]);
    }
  };

  const removeQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
    form.setValue('screeningQuestions', newQuestions);
  };

  const updateQuestion = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
    form.setValue('screeningQuestions', newQuestions);
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="screeningQuestions"
        render={() => (
          <FormItem>
            <FormLabel>Screening Questions (Optional)</FormLabel>
            <FormControl>
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={question}
                      onChange={(e) => updateQuestion(index, e.target.value)}
                      placeholder="e.g., How many years of experience do you have with similar projects?"
                    />
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeQuestion(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {questions.length < 5 && (
        <Button
          type="button"
          variant="outline"
          onClick={addQuestion}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      )}
    </div>
  );
}