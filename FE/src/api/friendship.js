import axios from "axios";

const API_URL = "http://localhost:8080/messenger/friendships";

// Gửi lời mời kết bạn
export const sendFriendRequest = (friendId, token) => {
  return axios.post(
    `${API_URL}/invite`,
    { friendId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

// Chấp nhận lời mời kết bạn
export const acceptFriendRequest = (friendShipId, token) => {
  return axios.post(
    `${API_URL}/accept`,
    { friendShipId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

// Từ chối/Hủy lời mời kết bạn
export const declineFriendRequest = (friendShipId, token) => {
  return axios.delete(`${API_URL}/decline`, {
    data: { friendShipId },
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Xóa bạn bè (unfriend)
export const unfriend = (friendId, token) => {
  return axios.delete(`${API_URL}/unfriend/${friendId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Block bạn bè
export const blockFriend = (friendShipId, token) => {
  return axios.post(
    `${API_URL}/block`,
    { friendShipId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

// Lấy danh sách bạn bè
export const getFriends = (token) => {
  return axios.get(`${API_URL}/friends`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Lấy danh sách bạn bè online
export const getOnlineFriends = (token) => {
  return axios.get(`${API_URL}/online_friends`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Lấy danh sách lời mời kết bạn (có phân trang)
export const getFriendRequests = (page = 0, size = 10, token) => {
  return axios.get(`${API_URL}/requests`, {
    params: { page, size },
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Lấy danh sách bạn bè có sinh nhật hôm nay
export const getFriendsWithBirthdayToday = (token) => {
  return axios.get(`${API_URL}/birthdays`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
