import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { BiComment } from "react-icons/bi";

export default function Post({
  user,
  time,
  content,
  images = [],
  likeCount = 0,
  liked = false,
  comments = 0,
  onLike,
}) {
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
      {images.length > 0 && (
        <div className="w-full mb-2">
          {/* 1 ảnh: full width */}
          {images.length === 1 && (
            <img
              src={images[0]}
              alt="post-media-0"
              className="rounded max-h-96 w-full object-cover"
            />
          )}
          {/* 2 ảnh: 2 cột */}
          {images.length === 2 && (
            <div className="grid grid-cols-2 gap-2">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`post-media-${idx}`}
                  className="rounded h-64 w-full object-cover border-2 border-gray-200"
                />
              ))}
            </div>
          )}
          {/* 3 ảnh: 2 trên, 1 dưới */}
          {images.length === 3 && (
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <img
                  src={images[0]}
                  alt="post-0"
                  className="rounded h-64 w-full object-cover border-2 border-gray-200"
                />
                <img
                  src={images[1]}
                  alt="post-1"
                  className="rounded h-64 w-full object-cover border-2 border-gray-200"
                />
              </div>
              <img
                src={images[2]}
                alt="post-2"
                className="rounded h-48 w-full object-cover border-2 border-gray-200"
              />
            </div>
          )}
          {/* 4 ảnh: grid 2x2 */}
          {images.length === 4 && (
            <div className="grid grid-cols-2 gap-2">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`post-media-${idx}`}
                  className="rounded h-48 w-full object-cover border-2 border-gray-200"
                />
              ))}
            </div>
          )}
          {/* >4 ảnh: 2 ảnh lớn trên, 3 ảnh nhỏ dưới (ảnh cuối +số) */}
          {images.length > 4 && (
            <div className="flex flex-col gap-2">
              {/* 2 ảnh trên */}
              <div className="grid grid-cols-2 gap-2">
                <img
                  src={images[0]}
                  alt="post-0"
                  className="rounded h-64 w-full object-cover border-2 border-gray-200"
                />
                <img
                  src={images[1]}
                  alt="post-1"
                  className="rounded h-64 w-full object-cover border-2 border-gray-200"
                />
              </div>
              {/* 3 ảnh dưới */}
              <div className="grid grid-cols-3 gap-2">
                <img
                  src={images[2]}
                  alt="post-2"
                  className="rounded h-32 w-full object-cover border-2 border-gray-200"
                />
                <img
                  src={images[3]}
                  alt="post-3"
                  className="rounded h-32 w-full object-cover border-2 border-gray-200"
                />
                <div className="relative">
                  <img
                    src={images[4]}
                    alt="post-4"
                    className="rounded h-32 w-full object-cover brightness-50 border-2 border-gray-200"
                  />
                  {images.length > 5 && (
                    <div className="absolute inset-0 flex items-center justify-center text-white text-3xl font-bold">
                      +{images.length - 5}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Like/Comment/Share summary */}
      <div className="flex items-center justify-between border-t pt-2 text-sm text-gray-600 mt-2">
        <div className="flex items-center gap-1">
          <span
            className={
              liked ? "text-blue-600 flex items-center" : "flex items-center"
            }
          >
            <AiFillLike className="mr-1" />
            {likeCount}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>{comments} bình luận</span>
          <span>1 lượt chia sẻ</span>
        </div>
      </div>
      {/* Action buttons */}
      <div className="flex border-t mt-2 pt-1">
        <button
          onClick={onLike}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded hover:bg-gray-100 transition ${
            liked ? "text-blue-600" : "text-gray-700"
          }`}
        >
          {liked ? <AiFillLike /> : <AiOutlineLike />}
          <span>Thích</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded hover:bg-gray-100 transition text-gray-700">
          <BiComment /> <span>Bình luận</span>
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
    </div>
  );
}
