import { FiEdit3 } from "react-icons/fi";
import { MdPhoto, MdAdd, MdPersonAdd, MdChat, MdSearch } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { FaUserFriends } from "react-icons/fa";
import { uploadBanner, uploadAvatar } from "../../api/User";
import { useRef, useState } from "react";
import ProfileEditModal from "./ProfileEditModal";

export default function ProfileHeader({ user, isOwnProfile }) {
  const bannerInputRef = useRef(null);
  const avatarInputRef = useRef(null);
  const [bannerUrl, setBannerUrl] = useState(user?.bannerUrl);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userInfo, setUserInfo] = useState(user);

  const handleBannerClick = () => {
    bannerInputRef.current?.click();
  };

  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const handleBannerChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await uploadBanner(formData);
      // Response.result chứa URL ảnh mới
      setBannerUrl(response.result);
    } catch (error) {
      console.error("Error uploading banner:", error);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await uploadAvatar(formData);
      // Response.result chứa URL ảnh mới
      setAvatarUrl(response.result);
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Cover Photo */}
        <div className="relative h-96 bg-gradient-to-r from-blue-400 to-purple-500 rounded-b-lg overflow-hidden">
          {bannerUrl && (
            <img
              src={bannerUrl}
              alt="cover"
              className="w-full h-full object-cover object-center"
            />
          )}
          <div className="absolute bottom-4 right-4 flex gap-2">
            {isOwnProfile && (
              <>
                <input
                  type="file"
                  ref={bannerInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleBannerChange}
                />
                <button
                  onClick={handleBannerClick}
                  className="bg-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-100"
                >
                  <MdPhoto />
                  Chỉnh sửa ảnh bìa
                </button>
              </>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="px-8 pb-4">
          <div className="flex items-end justify-between -mt-8">
            <div className="flex items-end gap-4">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={
                    avatarUrl ||
                    "https://randomuser.me/api/portraits/men/32.jpg"
                  }
                  alt="avatar"
                  className="w-40 h-40 rounded-full border-4 border-white object-cover bg-white"
                />
                {isOwnProfile && (
                  <>
                    <input
                      type="file"
                      ref={avatarInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                    <button
                      onClick={handleAvatarClick}
                      className="absolute bottom-2 right-2 bg-gray-200 p-2 rounded-full hover:bg-gray-300"
                    >
                      <MdPhoto className="text-xl" />
                    </button>
                  </>
                )}
              </div>

              {/* Name & Stats */}
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {user?.fullName || "Tên người dùng"}
                </h1>
                <p className="text-gray-600 mt-1">500 bạn bè</p>
                <div className="flex -space-x-2 mt-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <img
                      key={i}
                      src={`https://randomuser.me/api/portraits/women/${i}.jpg`}
                      className="w-8 h-8 rounded-full border-2 border-white"
                      alt="friend"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mb-4">
              {isOwnProfile ? (
                <>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2">
                    <MdAdd className="text-xl" />
                    Thêm vào tin
                  </button>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="bg-gray-200 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 flex items-center gap-2"
                  >
                    <FiEdit3 />
                    Chỉnh sửa trang cá nhân
                  </button>
                </>
              ) : (
                <>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2">
                    <FaUserFriends className="text-xl" />
                    Bạn bè
                  </button>
                  <button className="bg-gray-200 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 flex items-center gap-2">
                    <MdChat className="text-xl" />
                    Nhắn tin
                  </button>
                  <button className="bg-gray-200 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 flex items-center gap-2">
                    <MdSearch className="text-xl" />
                    Tìm kiếm
                  </button>
                  <button className="bg-gray-200 px-2 py-2 rounded-lg font-semibold hover:bg-gray-300">
                    <BsThreeDots className="text-xl" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <ProfileEditModal
          user={userInfo}
          onClose={() => setShowEditModal(false)}
          onUpdate={(updatedUser) => setUserInfo(updatedUser)}
        />
      )}
    </div>
  );
}
