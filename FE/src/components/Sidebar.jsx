import { Link } from "react-router-dom";
export default function Sidebar() {
  return (
    <aside className="w-60 p-4 bg-white shadow hidden md:block min-h-[calc(100vh-56px)]">
      <nav className="flex flex-col gap-4">
        <Link to="/" className="font-semibold text-blue-600">
          Trang chủ
        </Link>
        <Link to="/chat">Tin nhắn</Link>
        <Link to="/friends">Bạn bè</Link>
        <a href="#">Nhóm</a>
        <a href="#">Thông báo</a>
        <a href="#">Cài đặt</a>
      </nav>
      <div className="mt-8">
        <div className="font-bold mb-2">Nhóm nổi bật</div>
        <ul className="text-sm text-gray-700 space-y-1">
          <li># React Devs</li>
          <li># Lập trình Web</li>
          <li># UI/UX Design</li>
        </ul>
      </div>
    </aside>
  );
}
