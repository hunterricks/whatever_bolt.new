import { useEffect, useState } from 'react';
import { ref, onValue, set, serverTimestamp } from 'firebase/database';
import { database } from '@/lib/firebase';
import { useSocket } from '@/lib/socket';
import type { UserPresence } from '@/lib/types/chat';

export function usePresence(userId: string) {
  const [onlineUsers, setOnlineUsers] = useState<Record<string, UserPresence>>({});
  const socket = useSocket();

  useEffect(() => {
    if (!userId) return;

    // Set up presence in Firebase
    const userStatusRef = ref(database, `status/${userId}`);
    const connectedRef = ref(database, '.info/connected');

    const setPresence = async (isOnline: boolean) => {
      await set(userStatusRef, {
        status: isOnline ? 'online' : 'offline',
        lastSeen: serverTimestamp(),
      });
    };

    // Listen for connection state
    const unsubscribe = onValue(connectedRef, async (snapshot) => {
      if (snapshot.val() === true) {
        await setPresence(true);
        
        // Set offline status on disconnect
        await set(ref(database, `.info/disconnectmembership/${userId}`), {
          status: 'offline',
          lastSeen: serverTimestamp(),
        });
      }
    });

    // Listen for presence changes
    const presenceRef = ref(database, 'status');
    const presenceUnsubscribe = onValue(presenceRef, (snapshot) => {
      const presenceData = snapshot.val() || {};
      setOnlineUsers(presenceData);
    });

    // Emit presence via Socket.IO for real-time updates
    socket?.emit('presence', { userId, status: 'online' });

    // Listen for presence updates from other users
    socket?.on('presence-update', (presence: UserPresence) => {
      setOnlineUsers((prev) => ({
        ...prev,
        [presence.userId]: presence,
      }));
    });

    return () => {
      unsubscribe();
      presenceUnsubscribe();
      setPresence(false);
      socket?.off('presence-update');
    };
  }, [userId, socket]);

  return onlineUsers;
}