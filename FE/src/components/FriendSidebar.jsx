import React from "react";
import { FaUserFriends, FaLightbulb, FaBirthdayCake } from "react-icons/fa";
import { IoMdPeople } from "react-icons/io";
import { MdListAlt } from "react-icons/md";

export default function FriendSidebar({ selected, onSelect }) {
  const MENU = [
    { key: "requests", label: "Lời mời kết bạn", icon: IoMdPeople },
    { key: "suggest", label: "Gợi ý", icon: FaLightbulb },
    { key: "all", label: "Tất cả bạn bè", icon: FaUserFriends },
    { key: "birthday", label: "Sinh nhật", icon: FaBirthdayCake },
    { key: "custom", label: "Danh sách tùy chỉnh", icon: MdListAlt },
  ];
  return (
    <aside className="w-72 bg-white border-r flex flex-col py-4 px-2">
      <h2 className="text-2xl font-bold px-4 mb-4">Bạn bè</h2>
      <nav className="flex flex-col gap-1">
        {MENU.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.key}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium transition-all ${
                selected === item.key
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100 text-gray-800"
              }`}
              onClick={() => onSelect(item.key)}
            >
              <IconComponent className="text-xl" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
