const fakeFriends = [
  {
    id: 1,
    name: "Nguyễn Văn C",
    avatar: "https://randomuser.me/api/portraits/men/31.jpg",
  },
  {
    id: 2,
    name: "Lê Thị D",
    avatar: "https://randomuser.me/api/portraits/women/41.jpg",
  },
  {
    id: 3,
    name: "Phạm Văn E",
    avatar: "https://randomuser.me/api/portraits/men/51.jpg",
  },
];

export default function OnlineFriends() {
  return (
    <div>
      <div className="font-bold mb-2">Bạn bè online</div>
      <ul className="space-y-2">
        {fakeFriends.map((f) => (
          <li key={f.id} className="flex items-center gap-2">
            <span className="relative">
              <img
                src={f.avatar}
                alt={f.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
            </span>
            <span>{f.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
