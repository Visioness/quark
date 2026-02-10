import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getConversation } from '@/services/conversation.service';

export const conversationKeys = {
  all: () => ['conversations'],
  detail: (conversationId) => [...conversationKeys.all(), conversationId],
};

const emitMessageWithAck = ({ socket, conversationId, content }) =>
  new Promise((resolve, reject) => {
    if (!socket) return reject(new Error('Socket unavailable'));

    socket.emit('message:send', conversationId, content, (response) => {
      if (response?.success && response?.message) {
        resolve(response.message);
      } else {
        reject(new Error(response?.message || 'Failed to send message'));
      }
    });
  });

export const useFetchConversation = (conversationId) => {
  return useQuery({
    queryKey: conversationKeys.detail(conversationId),
    enabled: Boolean(conversationId),
    queryFn: async () => {
      const result = await getConversation(conversationId);
      if (!result?.success) {
        throw new Error(result?.message || 'Failed to load conversation');
      }
      return result.conversation;
    },
  });
};

export const useSendMessage = ({
  socket,
  userId,
  updateConversationOnMessage,
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, content }) =>
      emitMessageWithAck({ socket, conversationId, content }),

    onMutate: async ({ conversationId, content }) => {
      await queryClient.cancelQueries({
        queryKey: conversationKeys.detail(conversationId),
      });

      const previousConversation = queryClient.getQueryData(
        conversationKeys.detail(conversationId)
      );

      const tempId = `temp-${Date.now()}`;
      const optimisticMessage = {
        id: tempId,
        conversationId,
        content,
        senderId: userId,
        createdAt: new Date().toISOString(),
        _status: 'sending',
      };

      queryClient.setQueryData(
        conversationKeys.detail(conversationId),
        (old) => {
          if (!old) return old;
          return { ...old, messages: [...old.messages, optimisticMessage] };
        }
      );

      return { previousConversation, tempId, conversationId };
    },

    onError: (_error, _vars, context) => {
      if (context?.previousConversation) {
        queryClient.setQueryData(
          conversationKeys.detail(context.conversationId),
          context.previousConversation
        );
      }
    },

    onSuccess: (serverMessage, _vars, context) => {
      queryClient.setQueryData(
        conversationKeys.detail(context.conversationId),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            messages: old.messages.map((msg) =>
              msg.id === context.tempId ? serverMessage : msg
            ),
          };
        }
      );

      updateConversationOnMessage(serverMessage);
    },
  });
};
