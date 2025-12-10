import { Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { FiMessageSquare, FiUsers, FiBell, FiSettings } from "react-icons/fi";
import { MdGroup } from "react-icons/md";

export default function Sidebar() {
  return (
    <aside className="w-64 p-5 bg-white shadow-lg hidden md:block min-h-[calc(100vh-56px)]">
      <nav className="flex flex-col gap-2">
        <Link
          to="/chat"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 text-gray-700"
        >
          <FiMessageSquare className="text-xl" />
          Tin nhắn
        </Link>
        <Link
          to="/friends"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 text-gray-700"
        >
          <FiUsers className="text-xl" />
          Bạn bè
        </Link>
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 text-gray-700"
        >
          <MdGroup className="text-xl" />
          Nhóm
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 text-gray-700"
        >
          <FiBell className="text-xl" />
          Thông báo
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 text-gray-700"
        >
          <FiSettings className="text-xl" />
          Cài đặt
        </a>
      </nav>
      <div className="mt-8">
        <div className="font-bold mb-2 text-gray-800">Nhóm nổi bật</div>
        <ul className="text-sm text-gray-700 space-y-2 pl-2">
          <li className="rounded bg-gray-100 px-2 py-1"># React Devs</li>
          <li className="rounded bg-gray-100 px-2 py-1"># Lập trình Web</li>
          <li className="rounded bg-gray-100 px-2 py-1"># UI/UX Design</li>
        </ul>
      </div>
    </aside>
  );
}
