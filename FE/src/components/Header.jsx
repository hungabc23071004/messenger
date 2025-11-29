export default function Header() {
  return (
    <header className="bg-white shadow flex items-center justify-between px-6 py-3 sticky top-0 z-10">
      <div className="font-bold text-xl text-blue-600">Messenger Social</div>
      <input
        className="border rounded px-3 py-1 w-64"
        placeholder="Tìm kiếm bạn bè, tin nhắn..."
      />
      <div className="flex items-center gap-4">
        <button className="relative">
          <span className="material-icons">notifications</span>
        </button>
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="avatar"
          className="w-8 h-8 rounded-full"
        />
      </div>
    </header>
  );
}
