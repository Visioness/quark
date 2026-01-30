import { request } from '@/services/api';

export const getProfile = async (username, accessToken) => {
  return await request(`/profile/${username}`, {}, accessToken);
};
