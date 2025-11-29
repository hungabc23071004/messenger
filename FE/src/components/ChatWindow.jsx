import { useEffect, useState } from "react";
import ChatBox from "./ChatBox";
import { fetchConversationDetail } from "../api/conversation";

export default function ChatWindow({ conversationId, userId }) {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!conversationId) return;
    const token = localStorage.getItem("token");
    setLoading(true);
    fetchConversationDetail(conversationId, token)
      .then((data) => {
        setInfo(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Không thể tải thông tin hội thoại");
        setLoading(false);
      });
  }, [conversationId]);

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex items-center gap-3 bg-white border-b p-4 shadow-sm min-h-[64px]">
        {loading ? (
          <div className="text-gray-400">Đang tải...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : info ? (
          <>
            <img
              src={info.isGroup ? info.avatarUrl : info.partner?.avatarUrl}
              alt={info.isGroup ? info.name : info.partner?.username}
              className="w-10 h-10 rounded-full object-cover border"
            />
            <div>
              <div className="font-semibold">
                {info.isGroup ? info.name : info.partner?.username}
              </div>
              {/* Có thể thêm trạng thái online nếu muốn */}
            </div>
          </>
        ) : null}
      </div>
      <div className="flex-1 flex flex-col bg-gray-50">
        <ChatBox conversationId={conversationId} userId={userId} />
      </div>
    </div>
  );
}
