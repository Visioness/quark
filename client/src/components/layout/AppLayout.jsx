import { Outlet } from 'react-router';
import { ThemeToggler } from '@/features/theme/components';

export const AppLayout = () => {
  return (
    <div className='flex h-screen bg-background text-foreground overflow-hidden'>
      {/* Sidebar Placeholder */}
      <aside className='w-64 border-r bg-sidebar text-sidebar-foreground flex flex-col'>
        <div className='p-4 border-b h-14 flex items-center font-bold text-xl text-sidebar-primary'>
          Quark
        </div>
        <nav className='flex-1 p-4 space-y-2'>
          <div className='p-2 rounded bg-sidebar-accent text-sidebar-accent-foreground cursor-pointer'>
            Chats
          </div>
          <div className='p-2 rounded hover:bg-sidebar-accent/50 cursor-pointer'>
            Friends
          </div>
          <div className='p-2 rounded hover:bg-sidebar-accent/50 cursor-pointer'>
            Profile
          </div>
        </nav>
        <div className='p-4 flex justify-center items-center border-t'>
          <ThemeToggler />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className='flex-1 flex flex-col bg-background'>
        <header className='h-14 border-b flex items-center px-6 bg-card'>
          <h2 className='font-semibold'>Dashboard</h2>
        </header>
        <div className='flex-1 p-6 overflow-auto'>
          <Outlet />
        </div>
      </main>
    </div>
  );
};
