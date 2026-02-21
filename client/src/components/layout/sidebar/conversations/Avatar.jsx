import { UserRound, UsersRound } from 'lucide-react';

export const Avatar = ({ type, unread }) => {
  return (
    <div className='conversation-avatar relative w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium border border-primary/20'>
      {type === 'PRIVATE' ? <UserRound /> : <UsersRound />}
      {unread > 0 && (
        <span className='absolute -top-1 -right-3 px-1 min-w-5 flex justify-center items-center bg-destructive text-primary-foreground text-xs font-bold rounded-full'>
          {unread}
        </span>
      )}
    </div>
  );
};
