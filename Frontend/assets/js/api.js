// API helper for book-related requests
const API_BASE = '/api';

export async function getBooks({ page = 1, limit = 20 } = {}) {
  const url = `${API_BASE}/books?page=${page}&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Không thể lấy danh sách sách');
  return res.json();
}

export async function getBookById(id) {
  const url = `${API_BASE}/books/${id}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Không tìm thấy sách');
  return res.json();
}

// Example: getBooks().then(data => console.log(data));
