import React from "react";

export default function FriendCard({ friend, onAccept, onRemove }) {
  // Fake mutual friends avatars for demo
  const mutualAvatars = [
    "https://randomuser.me/api/portraits/men/32.jpg",
    "https://randomuser.me/api/portraits/women/44.jpg",
  ];
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center transition hover:shadow-lg">
      <img
        src={friend.avatar}
        alt={friend.name}
        className="w-full h-40 object-cover rounded-xl mb-2 border border-gray-200"
        style={{ maxHeight: 140, minHeight: 140, objectFit: "cover" }}
      />
      <div className="font-semibold text-base mb-0.5 text-center truncate w-full">
        {friend.name}
      </div>
      <div className="flex items-center gap-1 mb-3 w-full justify-center">
        {mutualAvatars.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt="mutual"
            className="w-5 h-5 rounded-full border border-white -ml-1 first:ml-0"
            style={{ zIndex: 2 - idx }}
          />
        ))}
        <span className="text-xs text-gray-500 ml-1">
          {friend.mutual} bạn chung
        </span>
      </div>
      <div className="flex gap-2 w-full">
        {onAccept && (
          <button
            className="flex-1 bg-blue-500 text-white rounded-md font-normal py-0.5 text-[11px] hover:bg-blue-600 transition-all shadow-sm min-h-0"
            style={{ minWidth: 0, height: 26, lineHeight: "1.1" }}
            onClick={() => onAccept(friend)}
          >
            Xác nhận
          </button>
        )}
        <button
          className={`flex-1 ${
            onAccept ? "bg-gray-100 text-gray-700" : "bg-gray-200 text-gray-700"
          } rounded-md font-normal py-0.5 text-[11px] hover:bg-gray-200 transition-all shadow-sm min-h-0`}
          style={{ minWidth: 0, height: 26, lineHeight: "1.1" }}
          onClick={() => onRemove(friend)}
        >
          Xóa
        </button>
      </div>
    </div>
  );
}
