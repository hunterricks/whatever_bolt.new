"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const isWebContainer = process.env.NEXT_PUBLIC_ENV_MODE === 'webcontainer';

  const handleWebContainerLogin = async (type: 'homeowner' | 'contractor' | 'both') => {
    try {
      setIsLoading(true);
      
      // Map the type to our mock user types
      const userType = type === 'both' ? 'dual' : type;
      
      // Call the mock auth endpoint
      const response = await fetch('/api/auth/mock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userType }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const { user: mockUser } = await response.json();
      login(mockUser);
      
      const returnTo = searchParams.get('returnTo');
      router.push(returnTo || `/dashboard/${mockUser.activeRole}`);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Error during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth0Login = async () => {
    try {
      setIsLoading(true);
      const returnTo = searchParams.get('returnTo');
      window.location.href = `/api/auth/login${returnTo ? `?returnTo=${returnTo}` : ''}`;
    } catch (error) {
      console.error("Auth0 login error:", error);
      toast.error("Error during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="w-full max-w-lg px-4">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              {isWebContainer 
                ? "Choose a test account to continue"
                : "Sign in to your account"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {searchParams.get('error') && (
              <Alert variant="destructive">
                <AlertDescription>
                  {searchParams.get('error_description') || 'An error occurred during login'}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4">
              {isWebContainer ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleWebContainerLogin('homeowner')}
                    disabled={isLoading}
                  >
                    Continue as Homeowner
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleWebContainerLogin('contractor')}
                    disabled={isLoading}
                  >
                    Continue as Contractor
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleWebContainerLogin('both')}
                    disabled={isLoading}
                  >
                    Continue with Both Roles
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleAuth0Login}
                  disabled={isLoading}
                  className="w-full"
                >
                  Continue to Login
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
