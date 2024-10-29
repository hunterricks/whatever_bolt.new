"use client";

import { useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageStatus } from './MessageStatus';
import { cn } from '@/lib/utils';
import type { Message } from '@/lib/types/chat';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  otherUserName: string;
  onMessageVisible?: (messageId: string) => void;
}

export function MessageList({ 
  messages, 
  currentUserId, 
  otherUserName,
  onMessageVisible 
}: MessageListProps) {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });

    // Set up intersection observer for message visibility
    if (onMessageVisible) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const messageId = entry.target.getAttribute('data-message-id');
              if (messageId) {
                onMessageVisible(messageId);
              }
            }
          });
        },
        { threshold: 1.0 }
      );

      // Observe message elements
      document.querySelectorAll('[data-message-id]').forEach((element) => {
        observerRef.current?.observe(element);
      });
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [messages, onMessageVisible]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            data-message-id={message.id}
            className={cn(
              'flex',
              message.sender === currentUserId ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                'flex items-start space-x-2 max-w-[70%]',
                message.sender === currentUserId ? 'flex-row-reverse space-x-reverse' : ''
              )}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${
                    message.sender === currentUserId ? currentUserId : otherUserName
                  }`}
                />
                <AvatarFallback>
                  {(message.sender === currentUserId ? currentUserId : otherUserName)[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <div
                  className={cn(
                    'rounded-lg px-4 py-2',
                    message.sender === currentUserId
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  <p className="break-words">{message.content}</p>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                  </span>
                  {message.sender === currentUserId && (
                    <MessageStatus status={message.status} />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={endOfMessagesRef} />
      </div>
    </div>
  );
}