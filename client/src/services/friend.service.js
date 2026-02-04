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

export const acceptFriendRequest = async (username, accessToken) => {
  return await request(
    `/friends/requests/${username}/accept`,
    { method: 'PUT' },
    accessToken
  );
};

export const rejectFriendRequest = async (username, accessToken) => {
  return await request(
    `/friends/requests/${username}/reject`,
    { method: 'PUT' },
    accessToken
  );
};

export const removeFriend = async (username, accessToken) => {
  return await request(
    `/friends/${username}`,
    { method: 'DELETE' },
    accessToken
  );
};
