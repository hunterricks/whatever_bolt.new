"use client";

import { useEffect, useState } from "react";
import { AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = 'webcontainer-alert-dismissed';

export function WebContainerIndicator() {
  const [isDismissed, setIsDismissed] = useState(true);
  const [isWebContainer, setIsWebContainer] = useState(false);

  useEffect(() => {
    // Check environment mode
    const envMode = process.env.NEXT_PUBLIC_ENV_MODE;
    setIsWebContainer(envMode === 'webcontainer');
    
    // Check if previously dismissed
    const dismissed = localStorage.getItem(STORAGE_KEY);
    setIsDismissed(!!dismissed);
  }, []);

  if (!isWebContainer || isDismissed) return null;

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsDismissed(true);
  };

  return (
    <Alert 
      variant="warning" 
      className="fixed bottom-4 right-4 w-auto max-w-md shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300 z-50"
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Running in Web Container Mode - Both roles enabled
          </AlertDescription>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0 hover:bg-yellow-500/20" 
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </Button>
      </div>
    </Alert>
  );
}