import React from "react";

export default function FriendSidebar({ selected, onSelect }) {
  const MENU = [
    { key: "home", label: "Trang chủ", icon: "🏠" },
    { key: "requests", label: "Lời mời kết bạn", icon: "👥" },
    { key: "suggest", label: "Gợi ý", icon: "💡" },
    { key: "all", label: "Tất cả bạn bè", icon: "📒" },
    { key: "birthday", label: "Sinh nhật", icon: "🎂" },
    { key: "custom", label: "Danh sách tùy chỉnh", icon: "📋" },
  ];
  return (
    <aside className="w-72 bg-white border-r flex flex-col py-4 px-2 min-h-screen">
      <h2 className="text-2xl font-bold px-4 mb-4">Bạn bè</h2>
      <nav className="flex flex-col gap-1">
        {MENU.map((item) => (
          <button
            key={item.key}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium transition-all ${
              selected === item.key
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-100 text-gray-800"
            }`}
            onClick={() => onSelect(item.key)}
          >
            <span className="text-xl">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
