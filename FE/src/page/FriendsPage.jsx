import React, { useState } from "react";
import FriendSidebar from "../components/FriendSidebar";
import FriendCard from "../components/FriendCard";

// Fake friend data (move to a shared location if needed)
const FAKE_FRIENDS = [
  {
    id: 1,
    name: "Lê Gia Huy",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    mutual: 15,
  },
  {
    id: 2,
    name: "Hoàng Thu Hà",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    mutual: 8,
  },
  {
    id: 3,
    name: "Linh Linh",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    mutual: 3,
  },
  {
    id: 4,
    name: "Bim Pun",
    avatar: "https://randomuser.me/api/portraits/men/76.jpg",
    mutual: 12,
  },
  {
    id: 5,
    name: "Hiền Lê",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    mutual: 17,
  },
  {
    id: 6,
    name: "Đỗ Thu Chang",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    mutual: 7,
  },
  {
    id: 7,
    name: "Hoàng.T Thục Linh",
    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    mutual: 35,
  },
  {
    id: 8,
    name: "Thu Hoài",
    avatar: "https://randomuser.me/api/portraits/women/41.jpg",
    mutual: 29,
  },
  {
    id: 9,
    name: "Hoàng Thị Giang",
    avatar: "https://randomuser.me/api/portraits/women/55.jpg",
    mutual: 49,
  },
  {
    id: 10,
    name: "Phương Anh",
    avatar: "https://randomuser.me/api/portraits/women/66.jpg",
    mutual: 33,
  },
  {
    id: 11,
    name: "Hương Giang",
    avatar: "https://randomuser.me/api/portraits/women/77.jpg",
    mutual: 1,
  },
  {
    id: 12,
    name: "Mai Anh",
    avatar: "https://randomuser.me/api/portraits/women/88.jpg",
    mutual: 4,
  },
];

export default function FriendsPage() {
  const [selectedTab, setSelectedTab] = useState("all");

  // Filter friends based on selected tab (for demo, all tabs show all friends)
  // You can implement real filtering logic here
  const filteredFriends = FAKE_FRIENDS;

  // Demo handlers
  const handleAccept = (friend) => {
    alert(`Đã xác nhận kết bạn với ${friend.name}`);
  };
  const handleRemove = (friend) => {
    alert(`Đã xóa ${friend.name} khỏi danh sách bạn bè`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <FriendSidebar selected={selectedTab} onSelect={setSelectedTab} />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">
            {selectedTab === "all" && "Tất cả bạn bè"}
            {selectedTab === "requests" && "Lời mời kết bạn"}
            {selectedTab === "suggest" && "Gợi ý"}
            {selectedTab === "birthday" && "Sinh nhật"}
            {selectedTab === "custom" && "Danh sách tuỳ chỉnh"}
            {selectedTab === "home" && "Trang chủ bạn bè"}
          </h3>
          <button className="text-blue-600 font-medium hover:underline">
            Xem tất cả
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredFriends.map((f) => (
            <FriendCard
              key={f.id}
              friend={f}
              onAccept={selectedTab === "requests" ? handleAccept : undefined}
              onRemove={handleRemove}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
