import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useAuth } from '@/features/auth/context';
import { useSocket } from '@/features/chat/context';
import {
  useFetchConversation,
  useSendMessage,
} from '@/features/chat/queries/useConversations';
import { LoadingSpinner } from '@/components/ui';
import { ChatHeader } from '@/features/chat/components';
import { MessageList } from '@/features/chat/components';
import { MessageInput } from '@/features/chat/components';
import { TypingIndicator } from '@/features/chat/components';
import { Invites } from '@/features/chat/components';

export const Chat = () => {
  const { conversationId } = useParams();
  const { user } = useAuth();
  const { isConnected, socket, changeConversation } = useSocket();

  const {
    isPending,
    isError,
    data: conversation,
    error,
  } = useFetchConversation(conversationId);

  const sendMessageMutation = useSendMessage({ socket, user });

  const [typingUsers, setTypingUsers] = useState([]);
  const [invitesOpen, setInvitesOpen] = useState(false);

  const loadedConversationId = conversation?.id ?? null;

  const canManageInvites = useMemo(() => {
    if (conversation?.type !== 'GROUP') return false;
    const role = conversation.participants.find(
      (p) => p.userId === user.id
    )?.role;
    return role === 'OWNER' || role === 'ADMIN';
  }, [conversation, user.id]);

  useEffect(() => {
    setInvitesOpen(false);
    setTypingUsers([]);
  }, [conversationId]);

  // Typing indicators
  useEffect(() => {
    if (!isConnected) return;

    const onTypingStart = (convId, userId) => {
      if (convId !== conversationId) return;
      setTypingUsers((prev) => {
        if (prev.includes(userId)) {
          return prev;
        }
        return [...prev, userId];
      });
    };
    socket.on('conversation:typing:start', onTypingStart);

    const onTypingStop = (convId, userId) => {
      if (convId !== conversationId) return;
      setTypingUsers((prev) => prev.filter((id) => id !== userId));
    };

    socket.on('conversation:typing:stop', onTypingStop);
    return () => {
      socket.off('conversation:typing:start', onTypingStart);
      socket.off('conversation:typing:stop', onTypingStop);
    };
  }, [conversationId, socket, isConnected]);

  // Mark as read on conversation load
  useEffect(() => {
    if (!loadedConversationId) return;

    changeConversation(loadedConversationId);

    if (isConnected) {
      socket.emit('conversation:read', loadedConversationId);
    }

    return () => {
      changeConversation(null);
      if (isConnected) {
        socket.emit('conversation:typing:stop', loadedConversationId);
      }
    };
  }, [socket, isConnected, changeConversation, loadedConversationId]);

  // Optimistic update with mutation
  const handleSend = (content) => {
    if (!conversation?.id) return;
    sendMessageMutation.mutate({ conversationId: conversation.id, content });
  };
  const handleTypingStart = () =>
    socket.emit('conversation:typing:start', conversationId);
  const handleTypingStop = () =>
    socket.emit('conversation:typing:stop', conversationId);

  if (isPending) {
    return (
      <div className='h-full flex items-center justify-center'>
        <LoadingSpinner size='md' />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='h-full flex items-center justify-center'>
        <div className='text-center space-y-2'>
          <p className='text-destructive font-medium'>
            Failed to load conversation
          </p>
          <p className='text-sm text-muted-foreground'>{error.message}</p>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className='h-full flex items-center justify-center'>
        <p className='text-muted-foreground'>No conversation found</p>
      </div>
    );
  }

  return (
    <div className='chat h-full flex flex-col gap-1 overflow-hidden'>
      <ChatHeader
        conversation={conversation}
        currentUserId={user.id}
        onOpenInvites={canManageInvites ? () => setInvitesOpen(true) : null}
      />
      <MessageList
        conversationId={conversationId}
        currentUserId={user.id}
        isGroup={conversation.type === 'GROUP'}
      />
      <TypingIndicator
        typingUsers={typingUsers}
        conversation={conversation}
        currentUserId={user.id}
      />
      <MessageInput
        key={conversationId}
        onSend={handleSend}
        onTypingStart={handleTypingStart}
        onTypingStop={handleTypingStop}
      />
      {canManageInvites && (
        <Invites
          conversationId={conversation.id}
          open={invitesOpen}
          onClose={() => setInvitesOpen(false)}
        />
      )}
    </div>
  );
};
