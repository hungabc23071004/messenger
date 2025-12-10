import axios from "axios";
const API_URL = "http://localhost:8080/messenger";
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// Lấy thông tin người dùng hiện tại
export const getMyInfor = async () => {
  const res = await axios.get(`${API_URL}/user/information`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

// Cập nhật thông tin người dùng hiện tại
export const updateMyInfor = async (data) => {
  const res = await axios.put(`${API_URL}/user`, data, {
    headers: getAuthHeader(),
  });
  return res.data;
};

// Upload avatar (multipart/form-data)
export const uploadAvatar = async (formData) => {
  const res = await axios.post(`${API_URL}/user/avatar`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...getAuthHeader(),
    },
  });
  return res.data;
};

// Lấy thông tin người dùng theo id
export const getUserInfor = async (id) => {
  const res = await axios.get(`${API_URL}/user/${id}`);
  return res.data;
};
