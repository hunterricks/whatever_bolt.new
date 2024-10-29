"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

export default function SaveDraftButton() {
  const [isSaving, setIsSaving] = useState(false);
  const form = useFormContext();

  const saveDraft = async () => {
    setIsSaving(true);
    try {
      const formData = form.getValues();
      
      // Save to local storage for now
      localStorage.setItem('jobDraft', JSON.stringify({
        data: formData,
        savedAt: new Date().toISOString(),
      }));

      // In a real app, you'd save to the backend
      // await fetch('/api/jobs/draft', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      toast.success("Draft saved successfully!");
    } catch (error) {
      toast.error("Error saving draft");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={saveDraft}
      disabled={isSaving}
    >
      <Save className="h-4 w-4 mr-2" />
      {isSaving ? "Saving..." : "Save Draft"}
    </Button>
  );
}