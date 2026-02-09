import { request } from '@/services/api';

export const getConversation = async (conversationId, accessToken) => {
  return await request(`/conversations/${conversationId}`, {}, accessToken);
};

export const getUserConversations = async (accessToken) => {
  return await request('/conversations', {}, accessToken);
};
