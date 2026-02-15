import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/context';
import { useSocket } from '@/features/chat/context';
import {
  conversationKeys,
  useFetchConversation,
  useSendMessage,
} from '@/features/chat/queries/useConversations';
import {
  appendMessageToLastPage,
  hasMessageInInfiniteData,
} from '@/features/chat/queries/messageCacheHelpers';
import { LoadingSpinner } from '@/components/ui';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { TypingIndicator } from './TypingIndicator';

export const Chat = () => {
  const { conversationId } = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const {
    isConnected,
    socket,
    changeConversation,
    updateConversationOnMessage,
  } = useSocket();

  const {
    isPending,
    isError,
    data: conversation,
    error,
  } = useFetchConversation(conversationId);

  const sendMessageMutation = useSendMessage({
    socket,
    userId: user.id,
    updateConversationOnMessage,
  });

  const [typingUsers, setTypingUsers] = useState([]);

  const loadedConversationId = conversation?.id ?? null;

  useEffect(() => {
    if (!isConnected) return;

    const onTypingStart = (userId) => {
      setTypingUsers((prev) => {
        if (!prev.includes(userId)) {
          return [...prev, userId];
        }
        return prev;
      });
    };
    socket.on('conversation:typing:start', onTypingStart);

    const onTypingStop = (userId) => {
      setTypingUsers((prev) => prev.filter((id) => id !== userId));
    };
    socket.on('conversation:typing:stop', onTypingStop);

    return () => {
      socket.off('conversation:typing:start', onTypingStart);
      socket.off('conversation:typing:stop', onTypingStop);
    };
  }, [socket, isConnected]);

  // Update cache with received message
  useEffect(() => {
    if (!isConnected) return;

    const onMessage = (message) => {
      if (message.conversationId !== conversationId) return;

      queryClient.setQueryData(
        conversationKeys.messages(conversationId),
        (old) => {
          if (!old) return old;
          if (hasMessageInInfiniteData(old, message.id)) return old;
          return appendMessageToLastPage(old, message);
        }
      );
    };

    socket.on('message:receive', onMessage);
    return () => socket.off('message:receive', onMessage);
  }, [socket, isConnected, conversationId, queryClient]);

  // Mark as read on conversation load
  useEffect(() => {
    if (!loadedConversationId) return;

    changeConversation(loadedConversationId);

    if (isConnected) {
      socket.emit('conversation:read', loadedConversationId);
    }

    return () => changeConversation(null);
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
      <ChatHeader conversation={conversation} currentUserId={user.id} />
      <MessageList conversationId={conversationId} currentUserId={user.id} />
      <TypingIndicator
        typingUsers={typingUsers}
        conversation={conversation}
        currentUserId={user.id}
      />
      <MessageInput
        onSend={handleSend}
        onTypingStart={handleTypingStart}
        onTypingStop={handleTypingStop}
      />
    </div>
  );
};
