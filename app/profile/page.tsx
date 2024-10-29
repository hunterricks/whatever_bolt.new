"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { StarIcon } from "lucide-react";
import { useUser } from '@auth0/nextjs-auth0/client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/auth";

const isWebContainer = process.env.NEXT_PUBLIC_ENV_MODE === 'webcontainer';

export default function Profile() {
  const router = useRouter();
  const { user: auth0User, error: auth0Error, isLoading: auth0Loading } = useUser();
  const { user: mockUser, checkAuth } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(isWebContainer ? mockUser : auth0User);
  const [reviews, setReviews] = useState([
    { id: 1, rating: 5, reviewer: { name: "John Doe" }, comment: "Great work!" },
    { id: 2, rating: 4, reviewer: { name: "Jane Smith" }, comment: "Very professional" }
  ]);

  useEffect(() => {
    if (!checkAuth()) {
      router.push('/login');
      return;
    }
    setProfile(isWebContainer ? mockUser : auth0User);
  }, [mockUser, auth0User, router, checkAuth]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!isWebContainer) {
        // Make API call to update Auth0 user metadata
        const response = await fetch('/api/auth/update-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profile),
        });

        if (!response.ok) throw new Error('Failed to update profile');
      }

      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error("Failed to update profile");
    }
  };

  if (auth0Loading && !isWebContainer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (auth0Error && !isWebContainer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>
            Error loading profile: {auth0Error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      {isWebContainer && (
        <Alert variant="warning" className="mb-8">
          <AlertDescription>
            Web Container Mode: Using mock profile data
          </AlertDescription>
        </Alert>
      )}

      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage 
              src={profile.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`} 
              alt={profile.name} 
            />
            <AvatarFallback>{profile.name?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{profile.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                <Input
                  type="text"
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev!, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  id="email"
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev!, email: e.target.value }))}
                  required
                  disabled={!isWebContainer} // Only allow email editing in web container mode
                />
              </div>
              <div className="flex space-x-4">
                <Button type="submit">Save Changes</Button>
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Role:</strong> {isWebContainer ? mockUser?.roles.join(', ') : profile['https://myapp.org/roles']?.join(', ')}</p>
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.map((review) => (
            <div key={review.id} className="mb-4 p-4 border rounded">
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-5 w-5 ${
                      i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="font-semibold">{review.reviewer.name}</p>
              <p>{review.comment}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}