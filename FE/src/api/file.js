import axios from "axios";

const API_URL = "http://localhost:8080/messenger";

// Upload one or more files to the server, return array of URLs
export const uploadFiles = async (files, token) => {
  const formData = new FormData();
  formData.append("file", files[0]); // chỉ 1 file
  const res = await axios.post(`${API_URL}/file/upload`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data.result; // string (URL)
};
