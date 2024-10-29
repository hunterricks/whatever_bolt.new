"use client";

import { useChat } from '@/lib/hooks/useChat';
import { useAuth } from '@/lib/auth';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageInput } from '@/components/chat/MessageInput';
import { MessageList } from '@/components/chat/MessageList';

interface MessagingProps {
  jobId: string;
  otherUserId: string;
  otherUserName: string;
}

export default function Messaging({ jobId, otherUserId, otherUserName }: MessagingProps) {
  const { user } = useAuth();
  const chatId = [user?.id, otherUserId].sort().join('_');
  const { messages, isLoading, isTyping, sendMessage, emitTyping } = useChat(
    jobId,
    chatId,
    user?.id || ''
  );

  if (!user) return null;

  return (
    <div className="flex flex-col h-[700px]">
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUserName}`} />
            <AvatarFallback>{otherUserName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{otherUserName}</h3>
            {isTyping && (
              <p className="text-sm text-muted-foreground">typing...</p>
            )}
          </div>
        </div>
      </div>

      <ScrollArea className="flex-grow">
        <MessageList
          messages={messages}
          currentUserId={user.id}
          otherUserName={otherUserName}
        />
      </ScrollArea>

      <MessageInput
        onSend={sendMessage}
        onTyping={emitTyping}
        disabled={isLoading}
      />
    </div>
  );
}