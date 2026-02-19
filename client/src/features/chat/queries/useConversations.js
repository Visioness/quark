import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { getConversation, getMessages } from '@/services/conversation.service';
import {
  appendMessageToLastPage,
  replaceMessageInLastPage,
} from './messageCacheHelpers';

export const conversationKeys = {
  all: () => ['conversations'],
  detail: (id) => [...conversationKeys.all(), id],
  messages: (id) => [...conversationKeys.detail(id), 'messages'],
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

export const useFetchMessages = (conversationId) => {
  return useInfiniteQuery({
    enabled: Boolean(conversationId),
    queryKey: conversationKeys.messages(conversationId),
    refetchOnWindowFocus: false,
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      if (pageParam) params.set('cursor', pageParam);

      return await getMessages(conversationId, params);
    },
    getPreviousPageParam: (firstPage) => firstPage.nextCursor ?? undefined,
    getNextPageParam: () => undefined,
  });
};

export const useSendMessage = ({
  socket,
  user,
  updateConversationOnMessage,
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, content }) =>
      emitMessageWithAck({ socket, conversationId, content }),

    onMutate: async ({ conversationId, content }) => {
      await queryClient.cancelQueries({
        queryKey: conversationKeys.messages(conversationId),
      });
      const previousMessages = queryClient.getQueryData(
        conversationKeys.messages(conversationId)
      );

      const tempId = `temp-${Date.now()}`;
      const optimisticMessage = {
        id: tempId,
        conversationId,
        content,
        senderId: user.id,
        createdAt: new Date().toISOString(),
        sender: {
          username: user.username,
        },
        _status: 'sending',
      };

      queryClient.setQueryData(
        conversationKeys.messages(conversationId),
        (old) => appendMessageToLastPage(old, optimisticMessage)
      );

      return { previousMessages, tempId, conversationId };
    },

    onError: (_error, _vars, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          conversationKeys.messages(context.conversationId),
          context.previousMessages
        );
      }
    },

    onSuccess: (serverMessage, _vars, context) => {
      queryClient.setQueryData(
        conversationKeys.messages(context.conversationId),
        (old) => replaceMessageInLastPage(old, context.tempId, serverMessage)
      );

      updateConversationOnMessage(serverMessage);
    },
  });
};
