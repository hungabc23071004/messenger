import axios from "axios";

const API_URL = "http://localhost:8080/messenger/posts";

// Lấy news feed (có phân trang)
export const getNewsFeed = (page = 0, size = 10, token) => {
  return axios.get(`${API_URL}?page=${page}&size=${size}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Lấy 1 post theo id
export const getPostById = (id, token) => {
  return axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Tạo post mới (multipart/form-data)
export const createPost = (formData, token) => {
  return axios.post(API_URL, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

// Like hoặc bỏ like post
export const toggleLike = (id, token) => {
  return axios.post(`${API_URL}/${id}/like`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Thêm comment vào post
export const addComment = (data, token) => {
  return axios.post(`${API_URL}/comment`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
