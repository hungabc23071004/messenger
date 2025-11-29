import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./page/Login";
import Home from "./page/Home";
import ChatPage from "./page/ChatPage";
import React, { useEffect, useState } from "react";
import { connectWebSocket, disconnectWebSocket } from "./api/WebsocketService";
import LogoutModal from "./components/LogoutModal";
import Header from "./components/Header";

function App() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  // Hàm decode token an toàn
  const decodeJwt = (token) => {
    try {
      const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(base64));
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const tokenData = decodeJwt(token);
      const currentTime = Date.now() / 1000;

      // Token hết hạn hoặc lỗi → logout
      if (!tokenData || tokenData.exp < currentTime) {
        setShowLogoutModal(true);
        disconnectWebSocket();
        return;
      }

      // Token hợp lệ → Connect WebSocket
      connectWebSocket();
    }

    // BE gửi event token hết hạn (qua WebSocket)
    const handleTokenExpired = () => {
      setShowLogoutModal(true);
      disconnectWebSocket();
    };

    window.addEventListener("tokenExpired", handleTokenExpired);

    return () => {
      window.removeEventListener("tokenExpired", handleTokenExpired);
      disconnectWebSocket();
    };
  }, []);

  // Khi user xác nhận logout
  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setShowLogoutModal(false);
    disconnectWebSocket();
    navigate("/login");
  };

  // Khi user đóng modal → vẫn logout
  const handleLogoutCancel = handleLogoutConfirm;

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>

      {/* Modal báo hết hạn */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        title="Phiên đăng nhập hết hạn"
        message="Phiên đăng nhập của bạn đã hết hạn. Bạn cần đăng nhập lại để tiếp tục sử dụng."
        cancelText="Đóng"
        confirmText="Đăng nhập lại"
      />
    </>
  );
}

export default App;
