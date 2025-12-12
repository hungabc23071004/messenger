import { MdVideocam, MdPhotoLibrary } from "react-icons/md";
import { BsEmojiSmile } from "react-icons/bs";

export default function CreatePost({ user, onClick }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={
            user?.avatarUrl || "https://randomuser.me/api/portraits/men/32.jpg"
          }
          className="w-10 h-10 rounded-full"
          alt="avatar"
        />
        <input
          type="text"
          placeholder={`${user?.fullName} ơi, bạn đang nghĩ gì thế?`}
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 hover:bg-gray-200 cursor-pointer"
          readOnly
          onClick={onClick}
        />
      </div>
      <div className="border-t pt-3 flex gap-2">
        <button 
          onClick={onClick}
          className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 rounded-lg text-gray-700"
        >
          <MdVideocam className="text-red-500 text-2xl" />
          <span className="font-medium">Video trực tiếp</span>
        </button>
        <button 
          onClick={onClick}
          className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 rounded-lg text-gray-700"
        >
          <MdPhotoLibrary className="text-green-500 text-2xl" />
          <span className="font-medium">Ảnh/video</span>
        </button>
        <button 
          onClick={onClick}
          className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 rounded-lg text-gray-700"
        >
          <BsEmojiSmile className="text-yellow-500 text-2xl" />
          <span className="font-medium">Cảm xúc/Hoạt động</span>
        </button>
      </div>
    </div>
  );
}
