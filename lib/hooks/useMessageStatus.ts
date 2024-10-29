import { useEffect } from 'react';
import { ref, update } from 'firebase/database';
import { database } from '@/lib/firebase';
import { useSocket } from '@/lib/socket';
import type { Message } from '@/lib/types/chat';

export function useMessageStatus(jobId: string, chatId: string, userId: string) {
  const socket = useSocket();

  useEffect(() => {
    if (!userId || !chatId) return;

    const markAsDelivered = async (messageId: string) => {
      const messageRef = ref(database, `messages/${jobId}/${chatId}/${messageId}`);
      await update(messageRef, { status: 'delivered' });
    };

    const markAsRead = async (messageId: string) => {
      const messageRef = ref(database, `messages/${jobId}/${chatId}/${messageId}`);
      await update(messageRef, { status: 'read' });
      socket?.emit('message-read', { chatId, messageId });
    };

    // Listen for new messages to mark as delivered
    socket?.on('new-message', async (message: Message) => {
      if (message.sender !== userId) {
        await markAsDelivered(message.id);
      }
    });

    // Mark messages as read when they become visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageId = entry.target.getAttribute('data-message-id');
            if (messageId) {
              markAsRead(messageId);
            }
          }
        });
      },
      { threshold: 1.0 }
    );

    // Observe message elements
    document.querySelectorAll('[data-message-id]').forEach((element) => {
      observer.observe(element);
    });

    return () => {
      socket?.off('new-message');
      observer.disconnect();
    };
  }, [jobId, chatId, userId, socket]);

  return {
    markMessageAsRead: async (messageId: string) => {
      const messageRef = ref(database, `messages/${jobId}/${chatId}/${messageId}`);
      await update(messageRef, { status: 'read' });
      socket?.emit('message-read', { chatId, messageId });
    },
  };
}