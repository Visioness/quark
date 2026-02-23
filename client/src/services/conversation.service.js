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

export const createGroup = async (groupName, tokenOverride = null) => {
  return await request(
    '/groups',
    { method: 'POST', body: JSON.stringify({ groupName }) },
    tokenOverride
  );
};

export const deleteGroup = async (conversationId, tokenOverride = null) => {
  return await request(
    `/groups/${conversationId}`,
    { method: 'DELETE' },
    tokenOverride
  );
};

export const getInvites = async (groupId, tokenOverride = null) => {
  return await request(`/groups/${groupId}/invites`, {}, tokenOverride);
};

export const createInvite = async (groupId, duration, tokenOverride = null) => {
  return await request(
    `/groups/${groupId}/invites`,
    { method: 'POST', body: JSON.stringify(duration ? { duration } : {}) },
    tokenOverride
  );
};

export const deleteInvite = async (inviteCode, tokenOverride = null) => {
  return await request(
    `/groups/invites/${inviteCode}`,
    { method: 'DELETE' },
    tokenOverride
  );
};

export const leaveGroup = async (groupId, tokenOverride = null) => {
  return await request(
    `/groups/${groupId}/leave`,
    { method: 'DELETE' },
    tokenOverride
  );
};

export const joinViaInvite = async (inviteCode, tokenOverride = null) => {
  return await request(
    `/groups/invites/${inviteCode}`,
    { method: 'POST' },
    tokenOverride
  );
};
