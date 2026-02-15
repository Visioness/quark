import { request } from '@/services/api';

export const getConversation = async (conversationId, tokenOverride = null) => {
  return await request(`/conversations/${conversationId}`, {}, tokenOverride);
};

export const getUserConversations = async (tokenOverride = null) => {
  return await request('/conversations', {}, tokenOverride);
};

export const getMessages = async (
  conversationId,
  params,
  tokenOverride = null
) => {
  return await request(
    `/conversations/${conversationId}/messages?${params}`,
    {},
    tokenOverride
  );
};
