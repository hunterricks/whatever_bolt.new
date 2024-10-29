export interface Message {
  id: string;
  sender: string;
  senderName: string;
  content: string;
  timestamp: number;
  status: 'sent' | 'delivered' | 'read';
  attachments?: string[];
}

export interface UserPresence {
  userId: string;
  status: 'online' | 'offline';
  lastSeen?: number;
}

export interface TypingStatus {
  chatId: string;
  userId: string;
  isTyping: boolean;
}