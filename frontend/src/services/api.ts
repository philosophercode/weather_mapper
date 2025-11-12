const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface ApiError {
  error: string;
  message?: string;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      error: 'Unknown error',
      message: `HTTP ${response.status}: ${response.statusText}`,
    }));
    throw new Error(error.message || error.error || 'Request failed');
  }
  const data = await response.json();
  return data.data || data;
}

export const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_URL}${endpoint}`);
    return handleResponse<T>(response);
  },

  post: async <T>(endpoint: string, body?: unknown): Promise<T> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },

  patch: async <T>(endpoint: string, body?: unknown): Promise<T> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
    });
    return handleResponse<T>(response);
  },
};

