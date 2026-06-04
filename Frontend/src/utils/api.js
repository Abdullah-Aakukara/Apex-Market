const API_BASE_URL = 'http://localhost:3000';

/**
 * Helper to handle fetch responses and extract JSON or error messages.
 */
async function handleResponse(response) {
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    // If backend returns an error message, use that, otherwise default
    const error = (data && data.message) || data?.error || `Request failed with status ${response.status}`;
    return Promise.reject(new Error(error));
  }

  return data;
}

/**
 * Register a new user (customer or vendor)
 * @param {Object} userData - { name, email, password, role }
 */
export async function registerUser(userData) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
}

/**
 * Log in an existing user
 * @param {Object} credentials - { email, password }
 */
export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
}
