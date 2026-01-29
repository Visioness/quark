const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const request = async (url, options = {}, accessToken = null) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    const data = await response.json();

    const isAuthEndpoint = url.startsWith('/auth');

    if (response.status === 401 && !isAuthEndpoint) {
      // If this is already a retry, don't try again - session is dead
      if (options._isRetry) {
        return {
          success: false,
          message: 'Session expired. Please log in again.',
          requiresLogin: true,
        };
      }

      // First 401 - try to refresh
      const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const refreshData = await refreshResponse.json();

      // Refresh successful? Retry original request
      if (refreshData.success && refreshData.accessToken) {
        return request(
          url,
          { ...options, _isRetry: true },
          refreshData.accessToken
        );
      }

      // Refresh failed - session expired
      return {
        success: false,
        message: 'Session expired. Please log in again.',
        requiresLogin: true,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Network error occurred',
    };
  }
};
