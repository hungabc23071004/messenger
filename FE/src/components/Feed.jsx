import React, { useEffect, useState, useRef } from "react";
import Post from "./Post";
import CreatePostModal from "./CreatePostModal";
import { getNewsFeed } from "../api/post";
import { getStompClient, connectWebSocket } from "../api/WebsocketService";
import { getMyInfor } from "../api/User";
import { getCurrentUserId } from "../utils/auth";

export default function Feed() {
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const subRef = useRef(null);

  // Load bài viết
  const loadPosts = () => {
    const token = localStorage.getItem("token");
    getNewsFeed(0, 10, token)
      .then((res) => {
        const list = res.data?.result || res.result || res.data || [];
        setPosts(Array.isArray(list) ? list : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Không thể tải danh sách bài viết");
        setLoading(false);
      });
  };

  // Lấy user hiện tại
  useEffect(() => {
    getMyInfor()
      .then((res) => {
        const user = res.result || res.data?.result;
        if (user) {
          setCurrentUser({
            name: user.fullName || user.username || "User",
            avatar: user.avatarUrl || "",
          });
        }
      })
      .catch(() => {
        console.error("Không thể lấy thông tin user");
      });

    loadPosts();
  }, []);

  // Sub WebSocket
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const userId = getCurrentUserId();
    if (!userId) {
      console.error("Token lỗi");
      return;
    }

    connectWebSocket(() => {
      const client = getStompClient();
      if (!client || !client.connected) return;

      // Hủy sub cũ (nếu có)
      if (subRef.current) {
        try {
          subRef.current.unsubscribe();
        } catch {
          // Ignore
        }
      }

      // Subscribe to topic feed của user (nhận post + like events)
      subRef.current = client.subscribe(
        `/topic/feed.user.${userId}`,
        (message) => {
          const event = JSON.parse(message.body);
          console.log(
            "[WS] Nhận WebSocketEvent từ /topic/feed.user." + userId + ":",
            event
          );

          handleWebSocketEvent(event);
        }
      );
      console.log("Đã subscribe topic feed:", `/topic/feed.user.${userId}`);
    });

    return () => {
      if (subRef.current) {
        try {
          subRef.current.unsubscribe();
        } catch {
          // Ignore
        }
      }
    };
  }, []);

  // Xử lý WebSocket events với type discrimination
  const handleWebSocketEvent = (event) => {
    switch (event.type) {
      case "POST_CREATED":
        // Thêm post mới vào đầu danh sách
        setPosts((prevPosts) => {
          if (prevPosts.some((p) => p.id === event.data.id)) return prevPosts;
          return [event.data, ...prevPosts];
        });
        break;

      case "POST_LIKED":
        // Cập nhật like count và liked status
        setPosts((prevPosts) =>
          prevPosts.map((p) => {
            if (p.id !== event.data.postId) return p;

            const myId = getCurrentUserId();
            return {
              ...p,
              likeCount: event.data.likeCount,
              // Chỉ cập nhật liked status nếu là chính mình like
              liked: event.data.userId === myId ? event.data.liked : p.liked,
            };
          })
        );
        break;

      default:
        console.log("Unknown WebSocket event type:", event.type);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tạo bài viết */}
      <div className="bg-white p-4 rounded shadow mb-4 flex items-center gap-3">
        <img
          src={currentUser?.avatar || "https://via.placeholder.com/40"}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <input
          className="flex-1 border rounded-full px-4 py-2 cursor-pointer bg-gray-100 hover:bg-gray-200"
          placeholder="Bạn đang nghĩ gì?"
          readOnly
          onClick={() => setShowModal(true)}
        />
      </div>

      {showModal && (
        <CreatePostModal
          user={currentUser}
          onClose={() => setShowModal(false)}
          onPostCreated={() => {
            setShowModal(false);
            loadPosts();
          }}
        />
      )}

      {/* Danh sách bài viết */}
      {loading ? (
        <div className="text-center text-gray-400">Đang tải...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        posts.map((post) => {
          const mapped = {
            id: post.id,
            user: {
              name: post.authorName || "Người dùng",
              avatar: post.authorAvatar || "",
            },
            time: post.createdAt
              ? new Date(post.createdAt).toLocaleString()
              : "",
            content: post.content,
            images: Array.isArray(post.images) ? post.images : [],
            likeCount: post.likeCount,
            liked: post.liked || false,
            comments: post.commentCount,
            onLike: async () => {
              const token = localStorage.getItem("token");
              try {
                await import("../api/post").then((m) =>
                  m.toggleLike(post.id, token)
                );
                // Cập nhật sẽ được nhận qua WebSocket
              } catch (e) {
                alert("Lỗi like bài viết");
              }
            },
          };
          return <Post key={post.id} {...mapped} />;
        })
      )}
    </div>
  );
}
