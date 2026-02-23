import { LogOut, X } from 'lucide-react';
import { ThemeToggler } from '@/features/theme/components';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Conversations } from '@/components/layout/sidebar/conversations';
import { Button, PageLink } from '@/components/ui';

export const Sidebar = ({ isVisible, onClose }) => {
  const { user, logout } = useAuth();

  const handleLogOut = async () => {
    if (confirm('You are logging out. Agreed?')) {
      await logout();
    }
  };

  return (
    <>
      <aside
        className={`fixed sm:static sm:translate-x-0 sm:w-48 lg:w-64 h-screen w-screen z-60 bg-sidebar text-sidebar-foreground border-r border-border flex flex-col transition-transform duration-400 ease-[cubic-bezier(.56,0,.42,1)] ${
          isVisible ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className='p-4 border-b h-14 flex items-center justify-between font-bold text-xl text-sidebar-primary border-border'>
          <span className='text-sidebar-primary'>Quark</span>
          <Button
            variant='secondary'
            size='sm'
            extra='sm:hidden rounded-xl w-9 h-9'
            onClick={onClose}>
            <X className='h-5 w-5' />
          </Button>
        </div>

        <nav className='flex flex-col p-4 space-y-2'>
          <PageLink to='/friends' onClick={onClose}>
            Friends
          </PageLink>
          <PageLink to='/profile' onClick={onClose}>
            Profile
          </PageLink>
        </nav>

        <Conversations closeSidebar={onClose} />

        <div className='flex justify-center items-center'>
          <ThemeToggler />
        </div>
        <div className='m-4 p-1 flex justify-between items-center rounded-2xl border bg-secondary border-border'>
          <div className='user flex items-center gap-2'>
            <div className='avatar w-9 h-9 flex items-center justify-center rounded-xl text-lg font-bold pointer-events-none select-none border bg-card border-border text-card-foreground'>
              {user.username.charAt(0).toUpperCase()}
            </div>
            <span className='sm:max-w-16 md:max-w-32 username font-semibold text-sm pointer-events-none select-none text-secondary-foreground truncate'>
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
    </>
  );
};
