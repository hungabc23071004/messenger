import { jwtDecode } from "jwt-decode";

/**
 * Lấy userId của người dùng hiện tại từ JWT token
 * @returns {string|null} userId hoặc null nếu không có token hoặc token không hợp lệ
 */
export function getCurrentUserId() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    return jwtDecode(token).sub;
  } catch {
    return null;
  }
}

/**
 * Lấy toàn bộ thông tin decoded từ JWT token
 * @returns {object|null} decoded token hoặc null nếu không hợp lệ
 */
export function getDecodedToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}
