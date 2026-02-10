import { request } from '@/services/api';

export const getFriends = async (tokenOverride = null) => {
  return await request('/friends', {}, tokenOverride);
};

export const getFriendRequests = async (tokenOverride = null) => {
  return await request('/friends/requests', {}, tokenOverride);
};

export const sendFriendRequest = async (username, tokenOverride = null) => {
  return await request(
    `/friends/requests/${username}`,
    { method: 'POST' },
    tokenOverride
  );
};

export const acceptFriendRequest = async (senderId, tokenOverride = null) => {
  return await request(
    `/friends/requests/${senderId}/accept`,
    { method: 'PUT' },
    tokenOverride
  );
};

export const rejectFriendRequest = async (senderId, tokenOverride = null) => {
  return await request(
    `/friends/requests/${senderId}/reject`,
    { method: 'PUT' },
    tokenOverride
  );
};

export const removeFriend = async (friendId, tokenOverride = null) => {
  return await request(
    `/friends/${friendId}`,
    { method: 'DELETE' },
    tokenOverride
  );
};
