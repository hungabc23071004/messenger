import { useEffect, useState } from "react";
import { fetchConversations } from "../api/conversation";

export default function ConversationList({
  userId,
  onSelect,
  selectedId,
  onLoaded,
}) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetchConversations(token)
      .then((data) => {
        setConversations(data);
        setLoading(false);
        if (onLoaded) onLoaded(data);
      })
      .catch((err) => {
        setError("Không thể tải danh sách hội thoại");
        setLoading(false);
      });
  }, []);

  return (
    <aside className="w-72 bg-white border-r h-full overflow-y-auto">
      <div className="font-bold text-lg p-4 border-b">Tin nhắn</div>
      {loading ? (
        <div className="p-4 text-gray-400">Đang tải...</div>
      ) : error ? (
        <div className="p-4 text-red-500">{error}</div>
      ) : (
        <ul>
          {conversations.map((c) => (
            <li
              key={c.id}
              className={`p-4 border-b hover:bg-blue-50 cursor-pointer flex justify-between items-center ${
                selectedId === c.id ? "bg-blue-100" : ""
              }`}
              onClick={() => onSelect && onSelect(c.id)}
            >
              <div className="flex items-center gap-2">
                {!c.isGroup && c.partner?.avatarUrl && (
                  <img
                    src={c.partner.avatarUrl}
                    alt={c.partner.username}
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                )}
                <div>
                  <div className="font-semibold">
                    {c.isGroup
                      ? c.name || "Nhóm không tên"
                      : c.partner?.username || "Người dùng"}
                  </div>
                  <div className="text-xs text-gray-500 truncate max-w-[120px]">
                    {/* Có thể thêm lastMessage nếu BE trả về */}
                  </div>
                </div>
              </div>
              {c.unreadCount > 0 && (
                <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 ml-2">
                  {c.unreadCount}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
