import { useEffect, useRef, useState } from "react";
import { getStompClient } from "../api/WebsocketService";
import { fetchMessages, fetchConversationDetail } from "../api/conversation";
import { uploadFiles } from "../api/file";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";

export default function ChatBox({ conversationId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userMap, setUserMap] = useState({});
  const [file, setFile] = useState(null); // For selected file

  const stompRef = useRef(null);
  const subRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Lấy userId từ JWT token
  const token = localStorage.getItem("token");
  let userId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.sub;
    } catch (e) {
      console.error("Invalid token", e);
    }
  }

  // -------------------------------------------
  // FETCH MESSAGE & USER MAP
  // -------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!conversationId || !token) return;

    fetchMessages(conversationId, token)
      .then((data) => setMessages(data))
      .catch(() => setMessages([]));

    fetchConversationDetail(conversationId, token).then((conv) => {
      const map = {};
      conv.participants?.forEach((u) => (map[u.id] = u));
      setUserMap(map);
    });
  }, [conversationId]);

  // -------------------------------------------
  // SUBSCRIBE WEBSOCKET AN TOÀN
  // -------------------------------------------
  useEffect(() => {
    const client = getStompClient();
    if (!client) return;

    const trySubscribe = () => {
      if (!client.connected) return;

      stompRef.current = client;

      // Hủy sub cũ (nếu có)
      if (subRef.current) {
        try {
          subRef.current.unsubscribe();
        } catch {
          // Ignore unsubscribe errors
        }
      }

      // Tạo sub mới
      subRef.current = client.subscribe(
        `/topic/conversation.${conversationId}/message`,
        (msg) => {
          const body = JSON.parse(msg.body);
          setMessages((prev) => [...prev, body]);
        }
      );
    };

    // Nếu stomp đã connect → sub luôn
    if (client.connected) {
      trySubscribe();
    } else {
      // Nếu chưa connect → đợi nó connect
      const wait = setInterval(() => {
        if (client.connected) {
          clearInterval(wait);
          trySubscribe();
        }
      }, 200);

      return () => clearInterval(wait);
    }

    return () => {
      if (subRef.current) {
        try {
          subRef.current.unsubscribe();
        } catch {
          // Ignore unsubscribe errors
        }
      }
    };
  }, [conversationId]);

  // -------------------------------------------
  // AUTO SCROLL
  // -------------------------------------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // -------------------------------------------
  // SEND MESSAGE
  // -------------------------------------------
  const sendMessage = async () => {
    if (!input.trim() && !file) return;

    let type = "TEXT";
    let mediaUrl = [];
    if (file) {
      if (file.type.startsWith("image/")) type = "IMAGE";
      else if (file.type.startsWith("video/")) type = "VIDEO";
      else type = "FILE";
      // Upload file lên server lấy url
      try {
        const token = localStorage.getItem("token");
        mediaUrl = [await uploadFiles([file], token)[0]];
      } catch (e) {
        alert("Lỗi upload file");
        return;
      }
    }

    const msg = {
      conversationId,
      senderId: userId,
      content: input,
      type,
      mediaUrl,
    };

    if (stompRef.current?.connected) {
      stompRef.current.send(
        `/app/conversation/${conversationId}/send`,
        {},
        JSON.stringify(msg)
      );
    }

    setInput("");
    setFile(null);
  };

  return (
    <div className="flex flex-col h-full border rounded shadow bg-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-transparent">
        {messages.map((m, i) => {
          const isMe = m.senderId === (userId || "");
          const sender = userMap[m.senderId];

          return (
            <div
              key={i}
              className={`flex items-end gap-2 mb-1 ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              {!isMe && sender?.avatarUrl && (
                <img
                  src={sender.avatarUrl}
                  alt={sender.username}
                  className="w-7 h-7 rounded-full object-cover border shadow"
                />
              )}

              <div
                className={`flex flex-col max-w-[70%] ${
                  isMe ? "items-end" : "items-start"
                }`}
              >
                <span
                  className={`px-4 py-2 rounded-2xl text-base shadow-sm break-words ${
                    isMe
                      ? "bg-yellow-600 text-white rounded-br-md"
                      : "bg-white text-gray-900 rounded-bl-md border"
                  }`}
                >
                  {m.content}
                </span>

                <span className="text-xs text-gray-400 mt-1 select-none">
                  {m.createdAt ? dayjs(m.createdAt).format("HH:mm DD/MM") : ""}
                </span>
              </div>

              {isMe && sender?.avatarUrl && (
                <img
                  src={sender.avatarUrl}
                  alt={sender.username}
                  className="w-7 h-7 rounded-full object-cover border shadow"
                />
              )}
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-2 border-t flex gap-2 items-center">
        {/* File input button */}
        <label className="cursor-pointer flex items-center">
          <span className="text-xl px-2">📎</span>
          <input
            type="file"
            className="hidden"
            accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.7z,.mp3,.mp4,.avi,.mkv,.mov,.csv,.json,.xml,.apk,.exe,.msi"
            onChange={(e) => {
              setFile(
                e.target.files && e.target.files[0] ? e.target.files[0] : null
              );
            }}
          />
        </label>

        {/* Preview selected files */}

        {file && (
          <div className="flex gap-2 overflow-x-auto max-w-[40%]">
            <div className="relative group">
              {/* Remove button */}
              <button
                type="button"
                onClick={() => setFile(null)}
                className="absolute -top-2 -right-2 z-10 bg-white border border-gray-300 rounded-full w-5 h-5 flex items-center justify-center text-xs shadow hover:bg-red-500 hover:text-white"
                title="Xóa file này"
              >
                ×
              </button>
              {file.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-10 h-10 object-cover rounded border"
                />
              ) : file.type.startsWith("video/") ? (
                <video
                  src={URL.createObjectURL(file)}
                  className="w-10 h-10 rounded border"
                  controls
                />
              ) : (
                <div className="px-2 py-1 bg-gray-100 rounded text-xs border w-16 h-10 flex items-center justify-center">
                  {file.name}
                </div>
              )}
            </div>
          </div>
        )}

        <input
          className="flex-1 border rounded px-3 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập tin nhắn..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={sendMessage}
        >
          Gửi
        </button>
      </div>
    </div>
  );
}
