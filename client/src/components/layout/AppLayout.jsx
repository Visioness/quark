import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router';
import { LogOut, Menu, X, UserRound, UsersRound, Plus } from 'lucide-react';
import { ThemeToggler } from '@/features/theme/components';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useSocket } from '@/features/chat/context';
import { createGroup, joinViaInvite } from '@/services/conversation.service';
import { Button } from '@/components/ui';

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const { conversations } = useSocket();
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTab, setDialogTab] = useState('create');
  const [joinError, setJoinError] = useState(null);
  const dialogRef = useRef(null);
  const createFormRef = useRef(null);
  const joinFormRef = useRef(null);

  useEffect(() => {
    if (dialogOpen) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [dialogOpen]);

  const closeDialog = () => {
    setDialogOpen(false);
    setDialogTab('create');
    setJoinError(null);
    createFormRef.current?.reset();
    joinFormRef.current?.reset();
  };

  const handleLogOut = async () => {
    if (confirm('You are logging out. Agreed?')) {
      await logout();
    }
  };

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

  return (
    <div className='flex h-screen bg-background text-foreground overflow-hidden'>
      <aside
        className={`fixed sm:static sm:translate-x-0 sm:w-64 inset-0 z-50 bg-sidebar text-sidebar-foreground border-r border-border flex flex-col transition-transform duration-300 ${
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className='p-4 border-b h-14 flex items-center justify-between font-bold text-xl text-sidebar-primary border-border'>
          <span className='text-sidebar-primary'>Quark</span>
          <Button
            variant='transparent'
            size='sm'
            extra='sm:hidden rounded-xl w-9 h-9'
            onClick={() => setShowSidebar(false)}>
            <X className='h-5 w-5' />
          </Button>
        </div>
        <nav className='flex-1 flex flex-col p-4 space-y-2'>
          <NavLink
            to='/friends'
            onClick={() => setShowSidebar(false)}
            className={({ isActive }) =>
              `p-2 rounded-xl cursor-pointer ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'hover:bg-sidebar-accent/50'
              }`
            }>
            Friends
          </NavLink>
          <NavLink
            to='/profile'
            onClick={() => setShowSidebar(false)}
            className={({ isActive }) =>
              `p-2 rounded-xl cursor-pointer ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'hover:bg-sidebar-accent/50'
              }`
            }>
            Profile
          </NavLink>
          {conversations?.length > 0 && (
            <div className='flex-1 mt-4 pt-4 flex flex-col border-t border-border gap-1'>
              <div className='text-xs font-semibold text-muted-foreground mb-2 px-2'>
                Conversations
              </div>
              <div>
                {conversations.map((conversation) => (
                  <NavLink
                    key={conversation.id}
                    to={`/chat/${conversation.id}`}
                    onClick={() => setShowSidebar(false)}
                    className={({ isActive }) =>
                      `px-2 py-2 w-full rounded-xl cursor-pointer flex items-center gap-4 ${
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                          : 'hover:bg-sidebar-accent/50'
                      }`
                    }>
                    <div className='conversation-avatar relative w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium border border-primary/20'>
                      {conversation.type === 'PRIVATE' ? (
                        <UserRound />
                      ) : (
                        <UsersRound />
                      )}
                      {conversation.unread > 0 && (
                        <span className='absolute bottom-0 -right-3 px-1 min-w-5 flex justify-center items-center bg-destructive text-primary-foreground text-xs font-bold rounded-full'>
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                    <div className='max-w-5/7 flex-1 flex flex-col gap-1'>
                      <span className='text-sm font-semibold'>
                        {conversation.type === 'PRIVATE'
                          ? conversation.participants.filter(
                              (participant) => participant.userId != user.id
                            )[0].user.username
                          : conversation?.name}
                      </span>
                      {conversation?.messages?.length > 0 && (
                        <p
                          className={`text-xs text-muted-foreground truncate ${
                            conversation.unread > 0
                              ? 'text-secondary-foreground'
                              : 'text-muted-foreground'
                          }`}>
                          {conversation.messages[0].content}
                        </p>
                      )}
                    </div>
                  </NavLink>
                ))}
              </div>
              <Button
                variant='secondary'
                size='md'
                onClick={() => setDialogOpen(true)}
                extra='w-full h-9 flex justify-center items-center rounded-xl hover:bg-sidebar-accent/50'>
                <Plus className='text-muted-foreground' />
              </Button>
            </div>
          )}
        </nav>
        <div className='flex justify-center items-center'>
          <ThemeToggler />
        </div>
        <div className='m-4 p-1 flex justify-between items-center rounded-2xl border bg-secondary border-border'>
          <div className='user flex items-center gap-2'>
            <div className='avatar w-9 h-9 flex items-center justify-center rounded-xl text-lg font-bold pointer-events-none select-none border bg-card border-border text-card-foreground'>
              {user.username.charAt(0).toUpperCase()}
            </div>
            <span className='username font-semibold text-sm pointer-events-none select-none text-secondary-foreground'>
              {user.username}
            </span>
          </div>
          <Button
            variant='transparent'
            size='sm'
            extra='w-9 h-9 rounded-xl'
            onClick={handleLogOut}>
            <LogOut className='text-destructive' />
          </Button>
        </div>
      </aside>

      <main className='flex-1 bg-background flex flex-col'>
        <div className='sm:hidden p-4 border-b flex items-center gap-4 bg-sidebar border-border text-sidebar-foreground'>
          <Button
            variant='transparent'
            size='sm'
            extra='rounded-xl w-9 h-9'
            onClick={() => setShowSidebar(true)}>
            <Menu className='h-5 w-5' />
          </Button>
          <span className='font-bold text-xl text-sidebar-primary'>Quark</span>
        </div>
        <div className='flex-1 overflow-auto'>
          <Outlet />
        </div>
      </main>

      <dialog ref={dialogRef}>
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
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
        </div>
      </dialog>
    </div>
  );
};
