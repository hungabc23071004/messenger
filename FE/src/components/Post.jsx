export default function Post({ user, time, content, image, likes, comments }) {
  return (
    <div className="bg-white rounded shadow p-4">
      <div className="flex items-center gap-3 mb-2">
        <img
          src={user.avatar}
          alt="avatar"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <div className="font-semibold">{user.name}</div>
          <div className="text-xs text-gray-500">{time}</div>
        </div>
      </div>
      <div className="mb-2">{content}</div>
      {image && (
        <img
          src={image}
          alt="post"
          className="rounded mb-2 max-h-80 w-full object-cover"
        />
      )}
      <div className="flex gap-6 text-sm text-gray-600 mt-2">
        <span>👍 {likes} Thích</span>
        <span>💬 {comments} Bình luận</span>
      </div>
    </div>
  );
}
