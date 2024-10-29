"use client";

import { useState } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { formSchema } from '../formSchema';

// Mock skills data - in a real app, this would come from an API
const popularSkills = [
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Painting",
  "Tiling",
  "Flooring",
  "HVAC",
  "Landscaping",
  "Masonry",
  "Roofing",
];

const SkillsStep: React.FC<{ form: UseFormReturn<z.infer<typeof formSchema>> }> = ({ form }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { control, setValue } = form;
  
  const selectedSkills = form.watch("skills") || [];

  const filteredSkills = popularSkills.filter(
    (skill) =>
      skill.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedSkills.includes(skill)
  );

  const addSkill = (skill: string) => {
    if (selectedSkills.length < 10) {
      setValue("skills", [...selectedSkills, skill]);
      setSearchTerm("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setValue(
      "skills",
      selectedSkills.filter((skill: string) => skill !== skillToRemove)
    );
  };

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="skills"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Required Skills</FormLabel>
            <FormControl>
              <div className="space-y-4">
                <Input
                  placeholder="Type to search skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && filteredSkills.length > 0 && (
                  <div className="border rounded-md p-2">
                    {filteredSkills.map((skill) => (
                      <div
                        key={skill}
                        className="p-2 hover:bg-muted cursor-pointer"
                        onClick={() => addSkill(skill)}
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {selectedSkills.map((skill: string) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="pl-2 pr-1 py-1"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1 hover:bg-muted rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </FormControl>
            <FormDescription>
              Select up to 10 skills required for this job
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {selectedSkills.length === 0 && (
        <div className="text-sm text-muted-foreground">
          <p className="font-medium mb-2">Popular Skills:</p>
          <div className="flex flex-wrap gap-2">
            {popularSkills.slice(0, 6).map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => addSkill(skill)}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsStep;
