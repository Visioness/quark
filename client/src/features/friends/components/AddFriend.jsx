import { useState } from 'react';
import { UserPlus, Search } from 'lucide-react';
import { Button } from '@/components/ui';
import { useSendFriendRequest } from '../queries/useFriends';

export const AddFriend = () => {
  const [username, setUsername] = useState('');
  const sendMutation = useSendFriendRequest();

  const handleInputChange = (e) => {
    setUsername(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    sendMutation.mutate(username, {
      onSuccess: () => setUsername(''),
    });
  };

  return (
    <div className='w-full max-w-sm mx-auto mb-6'>
      <form onSubmit={onSubmit} className='relative'>
        <div className='flex gap-2 items-center'>
          <div className='relative flex-1 group'>
            <div className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors'>
              <Search className='w-4 h-4' />
            </div>
            <input
              id='username'
              type='text'
              autoComplete='off'
              value={username}
              onChange={handleInputChange}
              placeholder='Find friends by username...'
              disabled={sendMutation.isPending}
              className='w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card/50 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm'
            />
          </div>
          <Button
            type='submit'
            variant='primary'
            size='md'
            loading={sendMutation.isPending}
            disabled={!username.trim() || sendMutation.isPending}
            extra='rounded-xl shadow-sm px-4 h-[42px] aspect-square flex items-center justify-center'>
            <UserPlus className='w-5 h-5' />
          </Button>
        </div>

        {(sendMutation.isSuccess || sendMutation.isError) && (
          <div
            className={`absolute -bottom-8 left-0 right-0 text-center text-xs font-medium animate-in fade-in slide-in-from-top-1 ${
              sendMutation.isSuccess ? 'text-emerald-500' : 'text-destructive'
            }`}>
            {sendMutation.isSuccess
              ? sendMutation.data.message
              : sendMutation.error.message}
          </div>
        )}
      </form>
    </div>
  );
};
