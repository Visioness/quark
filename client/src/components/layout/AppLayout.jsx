import { useState } from 'react';
import { Outlet, useMatch } from 'react-router';
import { Menu, UsersRound } from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Button } from '@/components/ui';

export const AppLayout = () => {
  const isInChat = useMatch('/chat/:conversationId');
  const [showSidebar, setShowSidebar] = useState(false);
  const [showMembers, setShowMembers] = useState(false);

  return (
    <div className='flex h-screen bg-background text-foreground overflow-hidden'>
      <Sidebar isVisible={showSidebar} onClose={() => setShowSidebar(false)} />

      <main className='flex-1 bg-background flex flex-col'>
        <div className='relative sm:hidden p-4 h-14 border-b flex items-center gap-4 bg-sidebar border-border text-sidebar-foreground'>
          <Button
            variant='secondary'
            size='p-2'
            extra='absolute left-4 rounded-xl w-9 h-9'
            onClick={() => setShowSidebar(true)}>
            <Menu className='h-5 w-5' />
          </Button>
          <span className='flex-1 text-center font-bold text-xl text-sidebar-primary'>
            Quark
          </span>
          {isInChat && (
            <Button
              variant='secondary'
              size='p-2'
              extra='absolute right-4 rounded-xl w-9 h-9'
              onClick={() => setShowMembers((prev) => !prev)}>
              <UsersRound className='h-5 w-5' />
            </Button>
          )}
        </div>
        <div className='flex-1 overflow-auto'>
          <Outlet
            context={{
              showMembers,
              onCloseMembers: () => setShowMembers(false),
            }}
          />
        </div>
      </main>
    </div>
  );
};
