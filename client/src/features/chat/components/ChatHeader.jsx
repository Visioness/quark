import { useMemo } from 'react';
import { UserRound, UsersRound } from 'lucide-react';

export const ChatHeader = ({ conversation, currentUserId }) => {
  const otherParticipants = useMemo(
    () =>
      conversation.participants.filter(
        (participant) => participant.userId !== currentUserId
      ),
    [conversation.participants, currentUserId]
  );

  return (
    <header className='bg-card p-2 border-b h-14 border-border'>
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium border border-primary/20'>
          {conversation.type === 'PRIVATE' ? <UserRound /> : <UsersRound />}
        </div>
        <span className='font-medium text-card-foreground'>
          {otherParticipants
            .map((participant) => participant.user.username)
            .join(', ')}
        </span>
      </div>
    </header>
  );
};
