import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { messaging, getToken, onMessage } from '@/lib/firebase';
import { toast } from 'sonner';

const useNotifications = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (!messaging || !session?.user?.email) return;

    const requestPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const token = messaging ? await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          }) : null;
          if (token) {
            setFcmToken(token);
            // Send this token to your server to associate it with the user
            await fetch('/api/notifications/register-token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token }),
            });
          }
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    };

    requestPermission();

    const unsubscribe = messaging ? onMessage(messaging, (payload) => {
      toast.info(payload.notification?.title, {
        description: payload.notification?.body,
      });
    }) : () => {};

    return () => unsubscribe();
  }, [session?.user?.email]);

  return { fcmToken };
};

export default useNotifications;
