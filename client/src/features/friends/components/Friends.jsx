import { useEffect, useState } from 'react';
import { MessageSquare, UserMinus, Users } from 'lucide-react';
import { useAuth } from '@/features/auth/context';
import { getFriends, removeFriend } from '@/services/friend.service';
import { Button, LoadingSpinner } from '@/components/ui';

export const Friends = () => {
  const { accessToken } = useAuth();
  const [friendList, setFriendList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [removingFriend, setRemovingFriend] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true);
      try {
        const result = await getFriends(accessToken);
        if (result.success) {
          setFriendList(result.friends);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFriends();
  }, [accessToken]);

  const handleRemove = async (friendId) => {
    setRemovingFriend(friendId);
    try {
      const result = await removeFriend(friendId, accessToken);
      if (result.success) {
        setFriendList((prev) =>
          prev.filter((friend) => friend.id !== friendId)
        );
      }
    } catch (error) {
      setError(error);
    } finally {
      setRemovingFriend(null);
    }
  };

  return (
    <div className='w-full max-w-xl mx-auto flex flex-col px-4 py-2 space-y-6'>
      <div className='flex-1 flex flex-col items-center w-full'>
        {loading && (
          <div className='py-8'>
            <LoadingSpinner size='md' />
          </div>
        )}

        {error && (
          <div className='w-full p-4 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive text-sm text-center'>
            {error.message || 'Failed to load friends'}
          </div>
        )}

        {!loading && !error && (
          <div className='w-full'>
            {friendList.length > 0 ? (
              <div className='space-y-3'>
                <h4 className='text-sm font-medium text-muted-foreground ml-1 mb-2'>
                  My Friends ({friendList.length})
                </h4>
                <ul className='space-y-2'>
                  {friendList.map((friend) => (
                    <li
                      key={friend.username}
                      className='group flex justify-between items-center p-3 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all duration-200'>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium border border-primary/20'>
                          {friend.username.charAt(0).toUpperCase()}
                        </div>
                        <span className='font-medium text-card-foreground'>
                          {friend.username}
                        </span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Button
                          variant='transparent'
                          size='sm'
                          extra='w-9 h-9 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground border-transparent'>
                          <MessageSquare className='w-4 h-4' />
                        </Button>
                        <Button
                          variant='transparent'
                          size='sm'
                          extra='w-9 h-9 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive border-transparent'
                          loading={removingFriend === friend.id}
                          disabled={removingFriend !== null}
                          onClick={() => handleRemove(friend.id)}>
                          <UserMinus className='w-4 h-4' />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center py-12 text-muted-foreground/50'>
                <div className='w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4'>
                  <Users className='w-8 h-8' strokeWidth={1.5} />
                </div>
                <span className='text-sm font-medium text-muted-foreground'>
                  No friends yet
                </span>
                <p className='text-xs text-muted-foreground/70 mt-1'>
                  Go to Requests to find people
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
