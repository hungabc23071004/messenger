import { useState, useEffect, useRef } from "react";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { FaTimes } from "react-icons/fa";
import { getStompClient, connectWebSocket } from "../api/WebsocketService";
import {
  getComments,
  addComment,
  deleteComment,
  updateComment,
} from "../api/post";
import { getCurrentUserId } from "../utils/auth";

export default function PostDetailModal({ post, onClose, onLike }) {
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    if (!post?.id) return;

    // Lấy userId hiện tại
    const userId = getCurrentUserId();
    setCurrentUserId(userId);

    // Load comments khi mở modal
    loadComments();

    // Subscribe WebSocket topic để nhận realtime updates
    connectWebSocket((client) => {
      subscriptionRef.current = client.subscribe(
        `/topic/post.${post.id}.comment`,
        (message) => {
          const event = JSON.parse(message.body);
          handleWebSocketEvent(event);
        }
      );
    });

    // Cleanup: unsubscribe khi đóng modal
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [post?.id]);

  const loadComments = async () => {
    if (!post?.id) {
      console.error("Post ID is missing");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log("📥 Loading comments for post:", post.id);
      const response = await getComments(post.id, token);
      console.log("✅ Comments loaded:", response.data);
      setComments(response.data.result || []);
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };

  const handleWebSocketEvent = (event) => {
    console.log("📩 WebSocket event:", event);

    switch (event.type) {
      case "COMMENT_ADDED":
        // Thêm comment mới vào cuối danh sách (mới nhất ở dưới)
        setComments((prev) => [...prev, event.data]);
        break;

      case "COMMENT_DELETED":
        // Xóa comment khỏi danh sách
        setComments((prev) =>
          prev.filter((c) => c.id !== event.data.commentId)
        );
        break;

      case "COMMENT_UPDATED":
        // Cập nhật content của comment
        setComments((prev) =>
          prev.map((c) => (c.id === event.data.id ? event.data : c))
        );
        break;

      default:
        console.log("Unknown event type:", event.type);
    }
  };

  const handleAddComment = async () => {
    if (!commentInput.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const payload = {
        postId: post.id,
        content: commentInput.trim(),
      };

      // Nếu đang reply một comment, thêm parentCommentId
      if (replyingTo) {
        // Facebook style: luôn trỏ về root comment (level 1)
        // Nếu đang reply một reply, lấy parentCommentId của nó (root)
        // Nếu đang reply một root comment, lấy id của nó
        payload.parentCommentId = replyingTo.parentCommentId || replyingTo.id;
      }

      await addComment(payload, token);
      setCommentInput("");
      setReplyingTo(null); // Reset reply state
      // Comment sẽ được thêm vào UI qua WebSocket event
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Không thể thêm bình luận");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Bạn có chắc muốn xóa bình luận này?")) return;

    try {
      const token = localStorage.getItem("token");
      await deleteComment(commentId, token);
      // Comment sẽ được xóa khỏi UI qua WebSocket event
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Không thể xóa bình luận");
    }
  };

  const handleStartEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingContent("");
  };

  const handleSaveEdit = async (commentId) => {
    if (!editingContent.trim()) return;

    try {
      const token = localStorage.getItem("token");
      await updateComment(commentId, { content: editingContent.trim() }, token);
      setEditingCommentId(null);
      setEditingContent("");
      // Comment sẽ được cập nhật qua WebSocket event
    } catch (error) {
      console.error("Error updating comment:", error);
      alert("Không thể cập nhật bình luận");
    }
  };

  const handleReply = (comment) => {
    setReplyingTo(comment);
    // Focus vào input (có thể thêm ref nếu cần)
  };

  // Render một comment (dùng chung cho parent và reply)
  const renderComment = (comment) => (
    <div className="flex gap-2">
      <img
        src={comment.authorAvatar || "https://via.placeholder.com/32"}
        alt="avatar"
        className="w-8 h-8 rounded-full"
      />
      <div className="flex-1">
        {editingCommentId === comment.id ? (
          // Edit mode
          <div className="space-y-2">
            <input
              type="text"
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
              className="w-full bg-gray-100 rounded-2xl px-3 py-2 outline-none"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleSaveEdit(comment.id)}
                className="text-xs text-blue-600 font-semibold"
              >
                Lưu
              </button>
              <button
                onClick={handleCancelEdit}
                className="text-xs text-gray-600"
              >
                Hủy
              </button>
            </div>
          </div>
        ) : (
          // View mode
          <>
            <div className="bg-gray-100 rounded-2xl px-3 py-2 inline-block">
              <div className="font-semibold text-sm">
                {comment.authorName || "Unknown"}
              </div>
              <div className="text-sm">{comment.content}</div>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-600 mt-1 ml-3">
              <span>
                {comment.createdAt
                  ? new Date(comment.createdAt).toLocaleDateString("vi-VN")
                  : ""}
              </span>
              {/* Chỉ người tạo comment mới có thể sửa/xóa */}
              {currentUserId === comment.userId && (
                <>
                  <button
                    onClick={() => handleStartEdit(comment)}
                    className="font-semibold hover:underline"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="font-semibold hover:underline"
                  >
                    Xóa
                  </button>
                </>
              )}
              <button
                onClick={() => handleReply(comment)}
                className="hover:underline"
              >
                Trả lời
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            Bài viết của {post.user.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            {/* Post header */}
            <div className="flex items-center gap-3 mb-3">
              <img
                src={post.user.avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="font-semibold">{post.user.name}</div>
                <div className="text-xs text-gray-500">{post.time}</div>
              </div>
            </div>

            {/* Post content */}
            <div className="mb-3">{post.content}</div>

            {/* Post images */}
            {post.images && post.images.length > 0 && (
              <div className="mb-3">
                {post.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`post-${idx}`}
                    className="w-full rounded-lg mb-2"
                  />
                ))}
              </div>
            )}

            {/* Like/Comment summary */}
            <div className="flex items-center justify-between text-sm text-gray-600 mb-3 pb-3 border-b">
              <div className="flex items-center gap-1">
                <AiFillLike className="text-blue-600" />
                <span>{post.likeCount}</span>
              </div>
              <div className="flex items-center gap-4">
                <span>{comments.length} bình luận</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex border-b pb-2 mb-4">
              <button
                onClick={onLike}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded hover:bg-gray-100 transition ${
                  post.liked ? "text-blue-600" : "text-gray-700"
                }`}
              >
                {post.liked ? <AiFillLike /> : <AiOutlineLike />}
                <span>Thích</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded hover:bg-gray-100 transition text-gray-700">
                <BiComment />
                <span>Bình luận</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded hover:bg-gray-100 transition text-gray-700">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
                <span>Chia sẻ</span>
              </button>
            </div>

            {/* Comments section */}
            <div className="space-y-3">
              <div className="font-semibold text-sm">
                {comments.length > 0
                  ? `Tất cả ${comments.length} bình luận`
                  : "Chưa có bình luận"}
              </div>
              {/* Group: Mỗi root comment + tất cả replies của nó */}
              {comments
                .filter((c) => !c.parentCommentId)
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                .map((rootComment) => (
                  <div key={rootComment.id}>
                    {/* Root comment */}
                    {renderComment(rootComment)}
                    
                    {/* Tất cả replies của root này */}
                    {comments
                      .filter((c) => {
                        // Lấy tất cả comments có parentCommentId trỏ về root này
                        // hoặc trỏ về bất kỳ reply nào của root này (nested)
                        if (c.parentCommentId === rootComment.id) return true;
                        // Kiểm tra xem parent của comment này có phải là reply của root không
                        const parent = comments.find(p => p.id === c.parentCommentId);
                        return parent && (parent.parentCommentId === rootComment.id || parent.id === rootComment.id);
                      })
                      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                      .map((reply) => (
                        <div key={reply.id} className="ml-10 mt-2">
                          {renderComment(reply)}
                        </div>
                      ))}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Comment input */}
        <div className="border-t bg-white">
          {/* Hiển thị thông báo đang reply */}
          {replyingTo && (
            <div className="px-3 pt-3 pb-1 bg-gray-50 border-b flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Đang trả lời{" "}
                <span className="font-semibold">{replyingTo.authorName}</span>
              </div>
              <button
                onClick={() => setReplyingTo(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={14} />
              </button>
            </div>
          )}

          <div className="p-3 flex gap-2 items-center">
            <img
              src={post.user.avatar}
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              placeholder={
                replyingTo
                  ? `Trả lời ${replyingTo.authorName}...`
                  : "Viết bình luận..."
              }
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 outline-none"
            />
            <button
              onClick={handleAddComment}
              className="text-blue-600 font-semibold"
            >
              Gửi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
