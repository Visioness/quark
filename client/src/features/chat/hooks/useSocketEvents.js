import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { conversationKeys } from '@/features/chat/queries/useConversations';
import {
  addConversationToList,
  addParticipantToConversation,
  appendMessageToLastPage,
  hasMessageInInfiniteData,
  moveConversationToTop,
  removeConversationFromList,
  removeParticipantFromConversation,
} from '@/features/chat/queries/messageCacheHelpers';

export function useSocketEvents(socket, isConnected, activeConversationRef) {
  const queryClient = useQueryClient();

  // Handle incoming messages: update both message cache and conversation list
  useEffect(() => {
    if (!isConnected) return;

    const onMessage = (message) => {
      const convId = message.conversationId;

      // Update the message cache (if conversation is loaded)
      queryClient.setQueryData(conversationKeys.messages(convId), (old) => {
        if (!old) return old;
        if (hasMessageInInfiniteData(old, message.id)) return old;
        return appendMessageToLastPage(old, message);
      });

      // Update conversation list: move to top, update last message & unread
      const isActive = activeConversationRef.current === convId;
      queryClient.setQueryData(conversationKeys.list(), (old) => {
        const existing = old?.find((conv) => conv.id === convId);
        return moveConversationToTop(old, convId, {
          messages: [message],
          unread: isActive ? 0 : (existing?.unread || 0) + 1,
        });
      });

      // Sync with server so unread count persists correctly across refreshes
      if (isActive) {
        socket.emit('conversation:read', convId);
      }
    };

    socket.on('message:receive', onMessage);
    return () => socket.off('message:receive', onMessage);
  }, [socket, isConnected, queryClient, activeConversationRef]);

  // Handle new conversations
  useEffect(() => {
    if (!isConnected) return;

    const onNewConversation = (conversation) => {
      queryClient.setQueryData(conversationKeys.list(), (old) =>
        addConversationToList(old, conversation)
      );
    };

    socket.on('conversation:new', onNewConversation);
    return () => socket.off('conversation:new', onNewConversation);
  }, [socket, isConnected, queryClient]);

  // Handle deleted conversations
  useEffect(() => {
    if (!isConnected) return;

    const onDeleteConversation = (conversationId) => {
      queryClient.setQueryData(conversationKeys.list(), (old) =>
        removeConversationFromList(old, conversationId)
      );

      queryClient.removeQueries({
        queryKey: conversationKeys.detail(conversationId),
      });
    };

    socket.on('conversation:delete', onDeleteConversation);
    return () => socket.off('conversation:delete', onDeleteConversation);
  }, [socket, isConnected, queryClient]);

  // Handle participant joined/left (now with conversationId from server)
  useEffect(() => {
    if (!isConnected) return;

    const onJoin = (conversationId, participant) => {
      // Update conversation list
      queryClient.setQueryData(conversationKeys.list(), (old) =>
        addParticipantToConversation(old, conversationId, participant)
      );

      // Update conversation detail cache (if loaded)
      queryClient.setQueryData(
        conversationKeys.detail(conversationId),
        (old) => {
          if (!old) return old;
          const exists = old.participants?.some(
            (p) => p.userId === participant.userId
          );
          if (exists) return old;
          return {
            ...old,
            participants: [...old.participants, participant],
          };
        }
      );
    };

    const onLeave = (conversationId, participant) => {
      // Update conversation list
      queryClient.setQueryData(conversationKeys.list(), (old) =>
        removeParticipantFromConversation(
          old,
          conversationId,
          participant.userId
        )
      );

      // Update conversation detail cache (if loaded)
      queryClient.setQueryData(
        conversationKeys.detail(conversationId),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            participants: old.participants.filter(
              (p) => p.userId !== participant.userId
            ),
          };
        }
      );
    };

    socket.on('conversation:participant:joined', onJoin);
    socket.on('conversation:participant:left', onLeave);
    return () => {
      socket.off('conversation:participant:joined', onJoin);
      socket.off('conversation:participant:left', onLeave);
    };
  }, [socket, isConnected, queryClient]);
}
