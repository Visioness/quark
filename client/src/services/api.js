const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
let refreshPromise = null;

export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const performTokenRefresh = async () => {
  const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  const refreshData = await refreshResponse.json();

  if (refreshData.success && refreshData.accessToken) {
    return refreshData.accessToken;
  }

  throw new Error('Refresh failed');
};

export const request = async (url, options = {}, accessToken = null) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
      credentials: 'include',
    });
  } catch (error) {
    throw new ApiError('Network error occurred', 0, null);
  }

  const data = await response.json();
  const isAuthEndpoint = url.startsWith('/auth');

  if (response.status === 401 && !isAuthEndpoint) {
    // If this is already a retry, don't try again - session is dead
    if (options._isRetry) {
      throw new ApiError('Session expired. Please log in again.', 401);
    }

    try {
      // All concurrent 401s share ONE refresh call
      if (!refreshPromise) {
        refreshPromise = performTokenRefresh();
      }
      const newToken = await refreshPromise;

      return await request(url, { ...options, _isRetry: true }, newToken);
    } catch {
      throw new ApiError('Session expired. Please log in again.', 401);
    } finally {
      refreshPromise = null;
    }
  }

  if (!response.ok) {
    throw new ApiError(
      data.message || 'Request failed',
      response.status,
      response.data
    );
  }

  return data;
};
