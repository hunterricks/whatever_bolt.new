import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import type { UserPresence as UserPresenceType } from '@/lib/types/chat';

interface UserPresenceProps {
  presence: UserPresenceType;
  className?: string;
}

export function UserPresence({ presence, className }: UserPresenceProps) {
  return (
    <div className={cn('flex items-center gap-2 text-sm', className)}>
      <span
        className={cn(
          'h-2 w-2 rounded-full',
          presence.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
        )}
      />
      <span className="text-muted-foreground">
        {presence.status === 'online'
          ? 'Online'
          : presence.lastSeen
          ? `Last seen ${formatDistanceToNow(presence.lastSeen, { addSuffix: true })}`
          : 'Offline'}
      </span>
    </div>
  );
}