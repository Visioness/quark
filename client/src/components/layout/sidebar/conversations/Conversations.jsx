import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '@/features/auth/context';
import { useConversationList } from '@/features/chat/queries/useConversations';
import {
  Avatar,
  ConversationLink,
  ConversationName,
  LastMessage,
  NewGroupDialog,
} from '@/components/layout/sidebar/conversations';
import { Button } from '@/components/ui';

export const Conversations = ({ closeSidebar }) => {
  const { user } = useAuth();
  const { data: conversations = [] } = useConversationList();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className='min-h-0 flex-1 p-4 flex flex-col border-t border-border gap-1'>
        <div className='text-xs font-semibold text-muted-foreground mb-2 px-2'>
          Conversations
        </div>
        <nav className='flex-1 flex flex-col space-y-2 overflow-y-auto scroll'>
          {conversations.length > 0 &&
            conversations.map((conversation) => (
              <ConversationLink
                key={conversation.id}
                to={`/chat/${conversation.id}`}
                onClick={closeSidebar}>
                <Avatar type={conversation.type} unread={conversation.unread} />

                <div className='max-w-5/7 flex-1 flex flex-col gap-1'>
                  <ConversationName
                    user={user}
                    type={conversation.type}
                    groupName={conversation.name}
                    participants={conversation.participants}
                  />
                  <LastMessage
                    messages={conversation.messages || []}
                    unread={conversation.unread}
                  />
                </div>
              </ConversationLink>
            ))}
        </nav>
        <Button
          variant='secondary'
          size='md'
          onClick={() => setDialogOpen(true)}
          extra='w-full h-9 flex justify-center items-center rounded-xl hover:bg-sidebar-accent/50'>
          <Plus className='text-muted-foreground' />
        </Button>
      </div>

      <NewGroupDialog
        isVisible={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
};
