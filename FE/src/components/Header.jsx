import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getMyInfor } from "../api/User";
import { getCurrentUserId } from "../utils/auth";

// React Icons
import { FiSettings, FiHelpCircle, FiMoon, FiLogOut } from "react-icons/fi";
import { MdFeedback, MdOndemandVideo, MdStorefront } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { MdGroups } from "react-icons/md";
import { FaGamepad } from "react-icons/fa";

export default function Header() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMyInfor();
        setUser(res.result);
      } catch (err) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <header className="w-full bg-white shadow-sm border-b flex items-center justify-between px-6 py-2 sticky top-0 z-50">
      {/* LEFT — Logo + Search */}
      <div className="flex items-center gap-3 flex-1">
        <div className="font-bold text-lg text-blue-600">Messenger Social</div>

        <input
          className="border rounded-full px-3 py-1.5 w-56 bg-gray-100 text-sm"
          placeholder="Tìm kiếm bạn bè"
        />
      </div>

      {/* CENTER — Navigation Icons */}
      <div className="flex items-center gap-2 text-gray-600">
        <button
          onClick={() => navigate("/")}
          className="relative px-12 py-2.5 bg-white rounded-lg transition group"
        >
          <AiFillHome className="text-blue-600 text-xl" />
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-blue-600 rounded-t-md"></div>
        </button>

        <button className="px-12 py-2.5 bg-white rounded-lg transition hover:bg-gray-100">
          <MdOndemandVideo className="text-xl text-gray-500" />
        </button>

        <button className="px-12 py-2.5 bg-white rounded-lg transition hover:bg-gray-100">
          <MdStorefront className="text-xl text-gray-500" />
        </button>

        <button className="px-12 py-2.5 bg-white rounded-lg transition hover:bg-gray-100">
          <MdGroups className="text-xl text-gray-500" />
        </button>

        <button className="px-12 py-3 bg-white rounded-lg transition hover:bg-gray-100">
          <FaGamepad className="text-[18px] text-gray-500" />
        </button>
      </div>

      {/* RIGHT — Notification + Avatar */}
      <div
        className="flex items-center gap-4 relative flex-1 justify-end pr-4"
        ref={dropdownRef}
      >
        <div className="relative cursor-pointer">
          <IoMdNotificationsOutline className="text-2xl" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>
        </div>

        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <img
            src={
              user?.avatarUrl ||
              "https://randomuser.me/api/portraits/men/32.jpg"
            }
            alt="avatar"
            className="w-8 h-8 rounded-full"
          />
          <FaChevronDown
            className={`text-gray-600 text-sm transition-transform ${
              open ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>

        {/* DROPDOWN */}
        {open && (
          <div className="absolute right-0 top-12 w-72 bg-white shadow-xl rounded-xl border py-3 z-50">
            {/* User */}
            <div
              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-lg"
              onClick={() => {
                const userId = getCurrentUserId();
                if (userId) {
                  navigate(`/profile/${userId}`);
                  setOpen(false);
                }
              }}
            >
              <img
                src={
                  user?.avatarUrl ||
                  "https://randomuser.me/api/portraits/men/32.jpg"
                }
                className="w-10 h-10 rounded-full"
                alt="avatar"
              />
              <div>
                <p className="font-semibold">{user?.fullName || "User Name"}</p>
                <p className="text-sm text-gray-500">Xem trang cá nhân</p>
              </div>
            </div>

            <div className="border-t my-2"></div>

            {/* Settings */}
            <button className="flex items-center gap-3 w-full px-3 py-3 hover:bg-gray-100 rounded-lg">
              <FiSettings className="text-lg" />
              <span className="flex-1 text-left font-medium">
                Cài đặt & Quyền riêng tư
              </span>
              <span className="text-gray-500">&gt;</span>
            </button>

            {/* Help */}
            <button className="flex items-center gap-3 w-full px-3 py-3 hover:bg-gray-100 rounded-lg">
              <FiHelpCircle className="text-lg" />
              <span className="flex-1 text-left font-medium">
                Trợ giúp & Hỗ trợ
              </span>
              <span className="text-gray-500">&gt;</span>
            </button>

            {/* Display */}
            <button className="flex items-center gap-3 w-full px-3 py-3 hover:bg-gray-100 rounded-lg">
              <FiMoon className="text-lg" />
              <span className="flex-1 text-left font-medium">
                Màn hình & Trợ năng
              </span>
              <span className="text-gray-500">&gt;</span>
            </button>

            {/* Feedback */}
            <button className="flex items-center gap-3 w-full px-3 py-3 hover:bg-gray-100 rounded-lg">
              <MdFeedback className="text-lg" />
              <div className="flex flex-col text-left">
                <span className="font-medium">Đóng góp ý kiến</span>
                <span className="text-[10px] text-gray-500">Ctrl + B</span>
              </div>
            </button>

            {/* Logout */}
            <button
              className="flex items-center gap-3 w-full px-3 py-3 hover:bg-gray-100 rounded-lg text-red-600 font-semibold"
              onClick={handleLogout}
            >
              <FiLogOut className="text-lg" />
              <span>Đăng xuất</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
