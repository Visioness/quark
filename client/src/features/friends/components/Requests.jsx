import { useEffect, useState } from 'react';
import { Check, X, User, Inbox } from 'lucide-react';
import { useAuth } from '@/features/auth/context';
import {
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
} from '@/services/friend.service';
import { Button, LoadingSpinner } from '@/components/ui';
import { AddFriend } from './AddFriend';
import {
  useAcceptFriendRequest,
  useFriendRequests,
  useRejectFriendRequest,
} from '../queries/useFriends';

export const Requests = () => {
  const { isPending, isError, data, error } = useFriendRequests();
  const acceptMutation = useAcceptFriendRequest();
  const rejectMutation = useRejectFriendRequest();

  const friendRequests = data?.friendRequests;

  return (
    <div className='w-full max-w-xl mx-auto flex flex-col px-4 py-2 space-y-6'>
      <AddFriend />

      <div className='flex-1 flex flex-col items-center w-full'>
        {isPending && (
          <div className='py-8'>
            <LoadingSpinner size='md' />
          </div>
        )}

        {isError && (
          <div className='w-full p-4 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive text-sm text-center'>
            {error.message || 'Failed to load friend requests'}
          </div>
        )}

        {friendRequests && (
          <div className='w-full'>
            {friendRequests.length > 0 ? (
              <div className='space-y-3'>
                <h4 className='text-sm font-medium text-muted-foreground ml-1 mb-2'>
                  Pending Requests ({friendRequests.length})
                </h4>
                <ul className='space-y-2'>
                  {friendRequests.map((request) => (
                    <li
                      key={request.senderId}
                      className='group flex justify-between items-center p-3 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all duration-200'>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-full bg-secondary/80 flex items-center justify-center border border-border/50 text-secondary-foreground'>
                          <User className='w-5 h-5 opacity-70' />
                        </div>
                        <div className='flex flex-col'>
                          <span className='font-medium text-card-foreground'>
                            {request.sender.username}
                          </span>
                          <span className='text-xs text-muted-foreground'>
                            sent you a friend request
                          </span>
                        </div>
                      </div>

                      <div className='flex items-center gap-2'>
                        <Button
                          variant='transparent'
                          size='sm'
                          extra='w-9 h-9 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20'
                          onClick={() =>
                            acceptMutation.mutate(request.senderId)
                          }>
                          <Check
                            className='w-4 h-4 text-emerald-500/80'
                            strokeWidth={2.5}
                          />
                        </Button>
                        <Button
                          variant='transparent'
                          size='sm'
                          extra='w-9 h-9 rounded-full bg-destructive/10 hover:bg-destructive/20 border-destructive/20'
                          onClick={() =>
                            rejectMutation.mutate(request.senderId)
                          }>
                          <X
                            className='w-4 h-4 text-destructive/80'
                            strokeWidth={2.5}
                          />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center py-12 text-muted-foreground/50'>
                <div className='w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4'>
                  <Inbox className='w-8 h-8' strokeWidth={1.5} />
                </div>
                <span className='text-sm font-medium text-muted-foreground'>
                  No pending requests
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
