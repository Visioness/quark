export const getMessagesFromInfiniteData = (data) => {
  if (!Array.isArray(data?.pages)) return [];
  return data.pages.flatMap((page) => page?.messages ?? []);
};

const updateLastPageMessages = (oldData, updateMessages) => {
  if (!oldData?.pages?.length) return oldData;

  const lastPageIndex = oldData.pages.length - 1;

  return {
    ...oldData,
    pages: oldData.pages.map((page, index) =>
      index === lastPageIndex ?
        { ...page, messages: updateMessages(page.messages ?? []) }
      : page
    ),
  };
};

export const appendMessageToLastPage = (oldData, message) => {
  return updateLastPageMessages(oldData, (messages) => [...messages, message]);
};

export const replaceMessageInLastPage = (
  oldData,
  targetMessageId,
  serverMessage
) => {
  return updateLastPageMessages(oldData, (messages) =>
    messages.map((msg) => (msg.id === targetMessageId ? serverMessage : msg))
  );
};

export const hasMessageInInfiniteData = (data, messageId) => {
  return getMessagesFromInfiniteData(data).some((msg) => msg.id === messageId);
};

// ── Conversation list cache helpers ──
export const moveConversationToTop = (oldList, conversationId, updates) => {
  if (!Array.isArray(oldList)) return oldList;

  const existing = oldList.find((conv) => conv.id === conversationId);
  if (!existing) return oldList;

  const rest = oldList.filter((conv) => conv.id !== conversationId);
  return [{ ...existing, ...updates }, ...rest];
};

export const addConversationToList = (oldList, conversation) => {
  if (!Array.isArray(oldList)) return [conversation];
  if (oldList.some((c) => c.id === conversation.id)) return oldList;
  return [{ ...conversation, unread: 0 }, ...oldList];
};

export const removeConversationFromList = (oldList, conversationId) => {
  if (!Array.isArray(oldList)) return oldList;
  return oldList.filter((conv) => conv.id !== conversationId);
};

export const addParticipantToConversation = (
  oldList,
  conversationId,
  participant
) => {
  if (!Array.isArray(oldList)) return oldList;
  return oldList.map((conv) => {
    if (conv.id !== conversationId) return conv;
    const exists = conv.participants?.some(
      (p) => p.userId === participant.userId
    );
    if (exists) return conv;
    return {
      ...conv,
      participants: [...(conv.participants || []), participant],
    };
  });
};

export const removeParticipantFromConversation = (
  oldList,
  conversationId,
  participantUserId
) => {
  if (!Array.isArray(oldList)) return oldList;
  return oldList.map((conv) => {
    if (conv.id !== conversationId) return conv;
    return {
      ...conv,
      participants: (conv.participants || []).filter(
        (p) => p.userId !== participantUserId
      ),
    };
  });
};
