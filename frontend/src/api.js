const API_BASE_URL = 'http://localhost:8080/api/v1';

// Fetch all users
export const getUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/users`);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
};

// Add a new user with name and email
export const addUser = async (user) => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)  // user contains name and email
  });
  if (!response.ok) {
    throw new Error('Failed to add user');
  }
  return response.json();
};

// Update a user by ID with name and email (similar to addUser but using PATCH)
export const updateUser = async (id, user) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)  // user contains name and email
  });
  if (!response.ok) {
    throw new Error('Failed to update user');
  }
  return response.json();
};

// Delete a user by ID
export const deleteUser = async (id) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
};

// Fetch todos for a specific user
export const getTodosByUserId = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/todos?userId=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch todos for user');
  }
  return response.json();
};

// Add a new todo (task) for a user
export const addTodo = async (todo) => {
  const response = await fetch(`${API_BASE_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo)  // todo contains description, completed, and userId
  });
  if (!response.ok) {
    throw new Error('Failed to add todo');
  }
  return response.json();
};

// Fetch all todos
export const getTodos = async () => {
  const response = await fetch(`${API_BASE_URL}/todos`);
  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }
  return response.json();
};

// Delete a todo by ID
export const deleteTodo = async (id) => {
  const response = await fetch(`${API_BASE_URL}/todos/${id}`, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error('Failed to delete todo');
  }
};