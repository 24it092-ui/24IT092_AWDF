const BASE_URL = 'http://localhost:5001';

const getAuthHeaders = () => {
  const token = localStorage.getItem('awdf_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const registerUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  if (data.token) localStorage.setItem('awdf_token', data.token);
  return data;
};

export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  if (data.token) localStorage.setItem('awdf_token', data.token);
  return data;
};

export const getMe = async () => {
  const res = await fetch(`${BASE_URL}/me`, {
    headers: getAuthHeaders(),
  });
  if (res.status === 401) {
    localStorage.removeItem('awdf_token');
    throw new Error('UNAUTHORIZED_EXPIRED');
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch user');
  return data;
};

export const logoutUser = () => {
  localStorage.removeItem('awdf_token');
};

export const getTasks = async () => {
  const res = await fetch(`${BASE_URL}/tasks`, {
    headers: getAuthHeaders(),
  });
  if (res.status === 401) {
    localStorage.removeItem('awdf_token');
    throw new Error('UNAUTHORIZED_EXPIRED');
  }
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
};

export const createTask = async (taskData) => {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(taskData),
  });
  if (res.status === 401) {
    localStorage.removeItem('awdf_token');
    throw new Error('UNAUTHORIZED_EXPIRED');
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.details ? data.details.join(', ') : data.error || 'Failed to create task');
  return data;
};

export const updateTask = async (id, updates) => {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });
  if (res.status === 401) {
    localStorage.removeItem('awdf_token');
    throw new Error('UNAUTHORIZED_EXPIRED');
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.details ? data.details.join(', ') : data.error || 'Failed to update task');
  return data;
};

export const deleteTask = async (id) => {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (res.status === 401) {
    localStorage.removeItem('awdf_token');
    throw new Error('UNAUTHORIZED_EXPIRED');
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete task');
  return data;
};
