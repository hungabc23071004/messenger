import React, { useState } from "react";
import Header from "../components/Header";
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

  const filteredFriends = FAKE_FRIENDS;

  const handleAccept = (friend) => {
    alert(`Đã xác nhận kết bạn với ${friend.name}`);
  };

  const handleRemove = (friend) => {
    alert(`Đã xóa ${friend.name} khỏi danh sách bạn bè`);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <FriendSidebar selected={selectedTab} onSelect={setSelectedTab} />
        <main className="flex-1 overflow-y-auto bg-gray-100">
          <div className="px-6 py-5 bg-white border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800">
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
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredFriends.map((f) => (
                <FriendCard
                  key={f.id}
                  friend={f}
                  onAccept={
                    selectedTab === "requests" ? handleAccept : undefined
                  }
                  onRemove={handleRemove}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
