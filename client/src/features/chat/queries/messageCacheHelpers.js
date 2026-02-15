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
      index === lastPageIndex
        ? { ...page, messages: updateMessages(page.messages ?? []) }
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
