import axios from "axios";

const API_URL = "http://localhost:8080/messenger";

export const fetchConversations = async (token) => {
  const res = await axios.get(`${API_URL}/conversation`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.result;
};

// Lấy chi tiết 1 hội thoại
export const fetchConversationDetail = async (conversationId, token) => {
  const res = await axios.get(`${API_URL}/conversation/${conversationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.result;
};

// Tạo hội thoại mới (1-1 hoặc group)
export const createConversation = async (data, token) => {
  const res = await axios.post(`${API_URL}/conversation`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.result;
};

// Lấy lịch sử tin nhắn của hội thoại (có phân trang)
export const fetchMessages = async (
  conversationId,
  token,
  page = 0,
  size = 20
) => {
  const res = await axios.get(
    `${API_URL}/conversation/${conversationId}/messages`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { page, size },
    }
  );
  return res.data.result;
};
