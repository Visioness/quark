import { request } from '@/services/api';

export const getFriends = async (accessToken) => {
  return await request(`/friends`, {}, accessToken);
};

export const getFriendRequests = async (accessToken) => {
  return await request('/friends/requests', {}, accessToken);
};

export const sendFriendRequest = async (username, accessToken) => {
  return await request(
    `/friends/requests/${username}`,
    { method: 'POST' },
    accessToken
  );
};

export const acceptFriendRequest = async (senderId, accessToken) => {
  return await request(
    `/friends/requests/${senderId}/accept`,
    { method: 'PUT' },
    accessToken
  );
};

export const rejectFriendRequest = async (senderId, accessToken) => {
  return await request(
    `/friends/requests/${senderId}/reject`,
    { method: 'PUT' },
    accessToken
  );
};

export const removeFriend = async (friendId, accessToken) => {
  return await request(
    `/friends/${friendId}`,
    { method: 'DELETE' },
    accessToken
  );
};
