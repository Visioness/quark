import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Link, LogOut, Trash2, UserRound, UsersRound } from 'lucide-react';
import { deleteGroup, leaveGroup } from '@/services/conversation.service';
import { Button } from '@/components/ui';

export const ChatHeader = ({ conversation, currentUserId, onOpenInvites }) => {
  const navigate = useNavigate();
  const otherParticipants = useMemo(
    () =>
      conversation.participants.filter(
        (participant) => participant.userId !== currentUserId
      ),
    [conversation.participants, currentUserId]
  );

  const onDelete = async () => {
    if (confirm('You are deleting this group. Agreed?')) {
      try {
        await deleteGroup(conversation.id);
        navigate('/');
      } catch (error) {
        return;
      }
    }
  };

  const onLeave = async () => {
    if (confirm('You are leaving this group. Agreed?')) {
      try {
        await leaveGroup(conversation.id);
        navigate('/');
      } catch (error) {
        return;
      }
    }
  };

  return (
    <header className='bg-card p-2 border-b h-14 border-border flex justify-between items-center'>
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium border border-primary/20'>
          {conversation.type === 'PRIVATE' ? <UserRound /> : <UsersRound />}
        </div>
        <span className='font-medium text-card-foreground'>
          {conversation.type === 'PRIVATE'
            ? otherParticipants
                .map((participant) => participant.user.username)
                .join(', ')
            : conversation?.name}
        </span>
      </div>
      <div className='flex items-center gap-2'>
        {onOpenInvites && (
          <Button
            variant='secondary'
            size='sm'
            extra='rounded-lg w-9 h-9'
            onClick={onOpenInvites}>
            <Link className='text-muted-foreground' />
          </Button>
        )}
        {conversation.type === 'GROUP' &&
          conversation.ownerId !== currentUserId && (
            <Button
              variant='secondary'
              onClick={onLeave}
              size='sm'
              extra='rounded-lg w-9 h-9'>
              <LogOut className='text-muted-foreground' />
            </Button>
          )}
        {conversation.type === 'GROUP' &&
          conversation.ownerId === currentUserId && (
            <Button
              variant='secondary'
              onClick={onDelete}
              size='sm'
              extra='rounded-lg w-9 h-9'>
              <Trash2 className='text-muted-foreground' />
            </Button>
          )}
      </div>
    </header>
  );
};
