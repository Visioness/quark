import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useAuth } from '@/features/auth/context';
import { useSocket } from '@/features/chat/context';
import { useFetchConversation } from '@/features/chat/hooks/useFetchConversation';
import { LoadingSpinner } from '@/components/ui';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

export const Chat = () => {
  const { conversationId } = useParams();
  const { user } = useAuth();
  const {
    isConnected,
    socket,
    changeConversation,
    updateConversationOnMessage,
  } = useSocket();
  const { conversation, setConversation, loading, error } =
    useFetchConversation(conversationId);

  const loadedConversationId = conversation?.id ?? null;

  useEffect(() => {
    if (!loadedConversationId) return;

    changeConversation(loadedConversationId);

    if (isConnected) {
      socket.emit('conversation:read', loadedConversationId);
    }

    return () => changeConversation(null);
  }, [loadedConversationId, isConnected, socket, changeConversation]);

  useEffect(() => {
    if (!isConnected) return;

    const onMessage = (message) => {
      if (message.conversationId === conversationId) {
        setConversation((prev) => {
          if (!prev) return prev;
          return { ...prev, messages: [...prev.messages, message] };
        });
      }
    };

    socket.on('message:receive', onMessage);
    return () => socket.off('message:receive', onMessage);
  }, [isConnected, conversationId, socket, setConversation]);

  const handleSend = (content) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      id: tempId,
      conversationId: conversation.id,
      content,
      senderId: user.id,
      createdAt: new Date().toISOString(),
      _status: 'sending',
    };

    // Show message immediately
    setConversation((prev) => ({
      ...prev,
      messages: [...prev.messages, optimisticMessage],
    }));

    // Emit with acknowledgment callback
    socket.emit('message:send', conversation.id, content, (response) => {
      if (response?.success) {
        // Replace temp message with the real server message
        setConversation((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: prev.messages.map((msg) =>
              msg.id === tempId ? response.message : msg
            ),
          };
        });

        // Update sidebar (sender doesn't receive the broadcast)
        updateConversationOnMessage(response.message);
      } else {
        // Mark message as failed
        setConversation((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: prev.messages.map((msg) =>
              msg.id === tempId ? { ...msg, _status: 'failed' } : msg
            ),
          };
        });
      }
    });
  };

  if (loading) {
    return (
      <div className='h-full flex items-center justify-center'>
        <LoadingSpinner size='md' />
      </div>
    );
  }

  if (error) {
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
    <div className='chat h-full flex flex-col gap-2 overflow-hidden'>
      <ChatHeader conversation={conversation} currentUserId={user.id} />
      <MessageList messages={conversation.messages} currentUserId={user.id} />
      <MessageInput onSend={handleSend} />
    </div>
  );
};
