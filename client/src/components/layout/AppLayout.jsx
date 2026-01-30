import { useState } from 'react';
import { NavLink, Outlet } from 'react-router';
import { LogOut, Menu, X } from 'lucide-react';
import { ThemeToggler } from '@/features/theme/components';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Button } from '@/components/ui';

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);

  const handleLogOut = async () => {
    if (confirm('You are logging out. Agreed?')) {
      await logout();
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
            to='/'
            onClick={() => setShowSidebar(false)}
            className={({ isActive }) =>
              `p-2 rounded-xl cursor-pointer ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'hover:bg-sidebar-accent/50'
              }`
            }>
            Recent Chats
          </NavLink>
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
        <div className='flex-1 overflow-auto p-4'>
          <Outlet />
        </div>
      </main>
    </div>
  );
};
