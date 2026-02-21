import { useState } from 'react';
import { Outlet } from 'react-router';
import { Menu } from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Button } from '@/components/ui';

export const AppLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className='flex h-screen bg-background text-foreground overflow-hidden'>
      <Sidebar isVisible={showSidebar} onClose={() => setShowSidebar(false)} />

      <main className='flex-1 bg-background flex flex-col'>
        <div className='sm:hidden p-4 h-14 border-b flex items-center gap-4 bg-sidebar border-border text-sidebar-foreground'>
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
    </div>
  );
};
