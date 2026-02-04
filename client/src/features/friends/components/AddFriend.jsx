import { useState } from 'react';
import { UserPlus, Search } from 'lucide-react';
import { useAuth } from '@/features/auth/context';
import { sendFriendRequest } from '@/services/friend.service';
import { Button } from '@/components/ui';

export const AddFriend = () => {
  const { accessToken } = useAuth();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setMessage({ type: 'error', text: 'Please enter a username' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await sendFriendRequest(username.trim(), accessToken);

      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setUsername('');
      } else {
        setMessage({
          type: 'error',
          text: result.message || 'Failed to send friend request',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setUsername(e.target.value);
    if (message) {
      setMessage(null);
    }
  };

  return (
    <div className='w-full max-w-sm mx-auto mb-6'>
      <form onSubmit={handleSubmit} className='relative'>
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
              disabled={loading}
              className='w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card/50 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm'
            />
          </div>
          <Button
            type='submit'
            variant='primary'
            size='md'
            loading={loading}
            disabled={loading || !username.trim()}
            extra='rounded-xl shadow-sm px-4 h-[42px] aspect-square flex items-center justify-center'>
            <UserPlus className='w-5 h-5' />
          </Button>
        </div>

        {message && (
          <div
            className={`absolute -bottom-8 left-0 right-0 text-center text-xs font-medium animate-in fade-in slide-in-from-top-1 ${
              message.type === 'success'
                ? 'text-emerald-500'
                : 'text-destructive'
            }`}>
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
};
