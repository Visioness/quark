import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { createGroup, joinViaInvite } from '@/services/conversation.service';
import { Dialog, Button } from '@/components/ui';

export const NewGroupDialog = ({ isVisible, onClose }) => {
  const navigate = useNavigate();
  const [dialogTab, setDialogTab] = useState('create');
  const [joinError, setJoinError] = useState(null);
  const createFormRef = useRef(null);
  const joinFormRef = useRef(null);

  const onCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await createGroup(e.target.groupName.value);
    } catch (error) {
      return;
    }
    closeDialog();
  };

  const onJoinGroup = async (e) => {
    e.preventDefault();
    setJoinError(null);
    try {
      const result = await joinViaInvite(e.target.inviteCode.value.trim());
      closeDialog();
      navigate(`/chat/${result.conversationId}`);
    } catch (error) {
      setJoinError(error.message);
    }
  };

  const closeDialog = () => {
    onClose();
    setDialogTab('create');
    setJoinError(null);
    createFormRef.current?.reset();
    joinFormRef.current?.reset();
  };

  return (
    <Dialog isVisible={isVisible}>
      <div className='bg-card border border-border rounded-2xl p-6 w-full max-w-md mx-4 shadow-lg'>
        <div className='flex gap-2 mb-4'>
          <Button
            variant={dialogTab === 'create' ? 'primary' : 'secondary'}
            size='sm'
            extra='rounded-xl flex-1'
            onClick={() => {
              setDialogTab('create');
              setJoinError(null);
            }}>
            Create Group
          </Button>
          <Button
            variant={dialogTab === 'join' ? 'primary' : 'secondary'}
            size='sm'
            extra='rounded-xl flex-1'
            onClick={() => {
              setDialogTab('join');
              setJoinError(null);
            }}>
            Join Group
          </Button>
        </div>

        {dialogTab === 'create' ? (
          <form ref={createFormRef} onSubmit={onCreateGroup}>
            <div className='mb-4'>
              <label
                htmlFor='groupName'
                className='block text-sm font-medium text-card-foreground mb-2'>
                Group Name
              </label>
              <input
                type='text'
                id='groupName'
                name='groupName'
                minLength={3}
                maxLength={20}
                required
                placeholder='Enter group name (3-20 characters)'
                className='w-full px-4 py-2 rounded-xl border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50'
              />
            </div>
            <div className='flex gap-3 justify-end'>
              <Button
                type='button'
                variant='secondary'
                size='md'
                extra='rounded-xl'
                onClick={closeDialog}>
                Cancel
              </Button>
              <Button
                type='submit'
                variant='primary'
                size='md'
                extra='rounded-xl'>
                Create
              </Button>
            </div>
          </form>
        ) : (
          <form ref={joinFormRef} onSubmit={onJoinGroup}>
            <div className='mb-4'>
              <label
                htmlFor='inviteCode'
                className='block text-sm font-medium text-card-foreground mb-2'>
                Invite Code
              </label>
              <input
                type='text'
                id='inviteCode'
                name='inviteCode'
                required
                placeholder='Paste invite code'
                className='w-full px-4 py-2 rounded-xl border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50'
              />
              {joinError && (
                <p className='text-sm text-destructive mt-2'>{joinError}</p>
              )}
            </div>
            <div className='flex gap-3 justify-end'>
              <Button
                type='button'
                variant='secondary'
                size='md'
                extra='rounded-xl'
                onClick={closeDialog}>
                Cancel
              </Button>
              <Button
                type='submit'
                variant='primary'
                size='md'
                extra='rounded-xl'>
                Join
              </Button>
            </div>
          </form>
        )}
      </div>
    </Dialog>
  );
};
