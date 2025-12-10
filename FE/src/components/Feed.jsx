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

      // Subscribe to user queue (post + like)
      subRef.current = client.subscribe(`/user/queue/feed`, (message) => {
        const data = JSON.parse(message.body);
        console.log("[WS] Nhận dữ liệu từ /user/queue/feed:", data);
        // Nếu là bài viết mới
        if (data.content && data.id) {
          setPosts((prevPosts) => {
            if (prevPosts.some((p) => p.id === data.id)) return prevPosts;
            return [data, ...prevPosts];
          });
        }
        // Nếu là cập nhật like
        if (data.postId && typeof data.likeCount === "number") {
          console.log("[WS] Nhận LikeResponse:", data);
          setPosts((prevPosts) =>
            prevPosts.map((p) => {
              console.log("[WS] So sánh post:", p.id, "với", data.postId);
              if (p.id !== data.postId) return p;
              // So sánh userId trong LikeResponse với userId hiện tại
              const myId = getCurrentUserId();
              console.log("[WS] Cập nhật post:", p.id, {
                likeCount: data.likeCount,
                liked: data.userId === myId ? data.liked : p.liked,
              });
              return {
                ...p,
                likeCount: data.likeCount,
                liked: data.userId === myId ? data.liked : p.liked,
              };
            })
          );
        }
      });
      console.log("Đã subscribe user queue feed:", `/user/queue/feed`);
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
