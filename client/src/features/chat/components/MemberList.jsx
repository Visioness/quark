import { useMemo } from 'react';
import { X } from 'lucide-react';
import { useSocket } from '@/features/chat/context';
import { MemberCard } from '@/features/chat/components';
import { Button } from '@/components/ui';

const ROLE_ORDERS = {
  owner: 1,
  admin: 2,
  member: 3,
};

export const MemberList = ({ isVisible, onClose, participants, userId }) => {
  const { onlineUsers } = useSocket();

  const participantsWithStatus = useMemo(() => {
    const sortedParticipants = participants.toSorted((prev, next) => {
      const roleOrder = ROLE_ORDERS[next.role] - ROLE_ORDERS[prev.role];
      const nameOrder = prev.user.username.localeCompare(next.user.username);
      return roleOrder || nameOrder;
    });

    return sortedParticipants.map((p) => {
      const isOnline = userId === p.userId || onlineUsers.has(p.userId);
      if (isOnline) {
        return { online: true, ...p };
      }
      return { online: false, ...p };
    });
  }, [onlineUsers, participants, userId]);

  return (
    <div
      className={`absolute right-0 sm:static sm:translate-x-0 z-50 h-full w-full sm:w-48 lg:w-64 p-4 flex flex-col items-center space-y-2 border-l border-border bg-sidebar text-sidebar-foreground transition-transform duration-400 ease-[cubic-bezier(.56,0,.42,1)] ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}>
      <Button
        variant='secondary'
        size='sm'
        extra='sm:hidden rounded-xl w-9 h-9'
        onClick={onClose}>
        <X className='h-5 w-5' />
      </Button>
      <ul className='min-h-0 flex-1 w-full space-y-2 overflow-y-auto scroll'>
        {participantsWithStatus.map((participant) => (
          <MemberCard key={participant.userId} participant={participant} />
        ))}
      </ul>
    </div>
  );
};
