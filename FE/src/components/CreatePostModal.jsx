import React, { useState, useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaGlobeAsia } from "react-icons/fa";
import { MdPhotoLibrary } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { createPost } from "../api/post";

export default function CreatePostModal({ user, onClose, onPostCreated }) {
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    // Tạo preview
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviews(newPreviews);
    URL.revokeObjectURL(previews[index]);
  };

  const handleSubmit = async () => {
    if (!content.trim() && images.length === 0) {
      alert("Vui lòng nhập nội dung hoặc chọn ảnh!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("content", content);
    images.forEach((img) => formData.append("images", img));

    try {
      const token = localStorage.getItem("token");
      await createPost(formData, token);

      // Cleanup previews
      previews.forEach((url) => URL.revokeObjectURL(url));

      if (onPostCreated) onPostCreated();
      onClose();
    } catch (error) {
      alert("Không thể tạo bài viết. Vui lòng thử lại!");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative">
        <button
          className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <AiOutlineClose />
        </button>
        <div className="p-6 pb-2">
          <h2 className="text-xl font-bold text-center mb-4">Tạo bài viết</h2>
          <div className="flex items-center gap-3 mb-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover border"
            />
            <div>
              <div className="font-semibold">{user.name}</div>
              <button className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-gray-100 border">
                <FaGlobeAsia className="text-gray-500" />
                Công khai
              </button>
            </div>
          </div>
          <textarea
            className="w-full border-none outline-none text-lg resize-none min-h-[60px] mb-2"
            placeholder={`${user.name.split(" ")[0]} ơi, bạn đang nghĩ gì thế?`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {/* Preview ảnh */}
          {previews.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-3">
              {previews.map((preview, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={preview}
                    alt={`preview-${idx}`}
                    className="rounded w-full h-32 object-cover"
                  />
                  <button
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                  >
                    <AiOutlineClose className="text-sm" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 mb-2">
            <span className="bg-gradient-to-tr from-pink-400 to-yellow-400 text-white rounded p-2 font-bold text-lg">
              Aa
            </span>
          </div>
        </div>
        <div className="px-6 pb-4">
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />
          <div className="bg-gray-100 rounded-lg flex items-center gap-3 px-3 py-2 mb-2">
            <span className="text-sm text-gray-700 font-medium">
              Thêm vào bài viết của bạn
            </span>
            <button
              className="text-green-500 text-xl"
              title="Ảnh/video"
              onClick={() => fileInputRef.current?.click()}
            >
              <MdPhotoLibrary />
            </button>
            <button className="text-blue-500 text-xl" title="Gắn thẻ bạn bè">
              <FiUsers />
            </button>
          </div>
          <button
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg mt-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Đang đăng..." : "Đăng"}
          </button>
        </div>
      </div>
    </div>
  );
}
