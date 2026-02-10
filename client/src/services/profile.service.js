import { request } from '@/services/api';

export const getProfile = async (username, tokenOverride = null) => {
  return await request(`/profile/${username}`, {}, tokenOverride);
};
