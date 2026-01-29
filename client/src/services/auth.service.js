import { request } from '@/services/api';

export const signUp = async (formData) => {
  return await request('/auth/sign-up', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
};

export const logIn = async (formData) => {
  return await request('/auth/log-in', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
};

export const logOut = async (accessToken) => {
  return await request(
    '/auth/log-out',
    {
      method: 'POST',
    },
    accessToken
  );
};

export const logOutAllSessions = async (accessToken) => {
  return await request(
    '/auth/log-out-all',
    {
      method: 'POST',
    },
    accessToken
  );
};

export const refreshToken = async () => {
  return await request('/auth/refresh', {
    method: 'POST',
  });
};
