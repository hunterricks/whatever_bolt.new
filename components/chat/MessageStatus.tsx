import { Check, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageStatusProps {
  status: 'sent' | 'delivered' | 'read';
  className?: string;
}

export function MessageStatus({ status, className }: MessageStatusProps) {
  return (
    <span className={cn('inline-flex ml-2', className)}>
      {status === 'sent' && <Check className="h-4 w-4 text-muted-foreground" />}
      {status === 'delivered' && <CheckCheck className="h-4 w-4 text-muted-foreground" />}
      {status === 'read' && <CheckCheck className="h-4 w-4 text-primary" />}
    </span>
  );
}