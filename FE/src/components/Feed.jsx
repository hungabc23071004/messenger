import Post from "./Post";

const fakePosts = [
  {
    id: 1,
    user: {
      name: "Nguyễn Văn A",
      avatar: "https://randomuser.me/api/portraits/men/11.jpg",
    },
    time: "2 phút trước",
    content: "Chào mọi người! Đây là bài post đầu tiên của mình.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    likes: 12,
    comments: 3,
  },
  {
    id: 2,
    user: {
      name: "Trần Thị B",
      avatar: "https://randomuser.me/api/portraits/women/21.jpg",
    },
    time: "10 phút trước",
    content: "Hôm nay trời đẹp quá, ai đi chơi không?",
    image: "",
    likes: 8,
    comments: 1,
  },
];

export default function Feed() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded shadow mb-4">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Bạn đang nghĩ gì?"
        />
        <button className="mt-2 bg-blue-500 text-white px-4 py-1 rounded">
          Đăng
        </button>
      </div>
      {fakePosts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </div>
  );
}
