import axios from "axios";

const API_URL = "http://localhost:8080/messenger/auth";

export const login = async (data) => {
  const res = await axios.post(`${API_URL}/authentication`, data);
  return res.data;
};

export const register = async (data) => {
  const res = await axios.post(`${API_URL}/register`, data);
  return res.data;
};

export const verifyAccount = async (token) => {
  const res = await axios.get(`${API_URL}/verification?token=${token}`);
  return res.data;
};

export const requestOtp = async (data) => {
  const res = await axios.post(`${API_URL}/request-otp`, data);
  return res.data;
};

export const changePassword = async (data) => {
  const res = await axios.post(`${API_URL}/change-password`, data);
  return res.data;
};

export const refreshToken = async (data) => {
  const res = await axios.post(`${API_URL}/refresh-token`, data);
  return res.data;
};

export const logout = async (data) => {
  const res = await axios.post(`${API_URL}/logout`, data);
  return res.data;
};
