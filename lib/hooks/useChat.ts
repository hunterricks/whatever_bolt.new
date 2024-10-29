import { useState, useEffect } from 'react';
import { ref, push, onValue, off } from 'firebase/database';
import { database } from '@/lib/firebase';
import { useSocket } from '@/lib/socket';
import { debounce } from '@/lib/utils';

export interface Message {
  id: string;
  sender: string;
  senderName: string;
  content: string;
  timestamp: number;
  status: 'sent' | 'delivered' | 'read';
}

export function useChat(jobId: string, chatId: string, userId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const socket = useSocket();

  useEffect(() => {
    if (!userId) return;

    const messagesRef = ref(database, `messages/${jobId}/${chatId}`);

    // Join chat room
    socket?.emit('join-chat', chatId);

    // Listen for typing events
    socket?.on('user-typing', (typing: boolean) => {
      setIsTyping(typing);
    });

    // Listen for message status updates
    socket?.on('message-status-update', ({ messageId, status }) => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, status } : msg
        )
      );
    });

    setIsLoading(true);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key,
          ...value,
        }));
        setMessages(messageList);
      }
      setIsLoading(false);
    });

    return () => {
      off(messagesRef);
      socket?.off('user-typing');
      socket?.off('message-status-update');
      unsubscribe();
    };
  }, [jobId, chatId, userId, socket]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || !userId || isLoading) return;

    try {
      const newMessage = await push(ref(database, `messages/${jobId}/${chatId}`), {
        sender: userId,
        content,
        timestamp: Date.now(),
        status: 'sent',
      });

      socket?.emit('message-status', {
        chatId,
        messageId: newMessage.key,
        status: 'delivered',
      });

      return newMessage.key;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const emitTyping = debounce((isTyping: boolean) => {
    socket?.emit('typing', { chatId, isTyping });
  }, 500);

  return {
    messages,
    isLoading,
    isTyping,
    sendMessage,
    emitTyping,
  };
}