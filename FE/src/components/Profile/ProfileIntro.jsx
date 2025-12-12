import {
  MdWork,
  MdSchool,
  MdHome,
  MdLocationOn,
  MdCake,
  MdPhone,
} from "react-icons/md";

export default function ProfileIntro({ user, isOwnProfile }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">Giới thiệu</h2>

      {user?.bio && <p className="text-gray-700 mb-4">{user.bio}</p>}

      <div className="space-y-3">
        {user?.work && (
          <div className="flex items-center gap-3 text-gray-700">
            <MdWork className="text-gray-500 text-xl" />
            <span>
              Làm việc tại <strong>{user.work}</strong>
            </span>
          </div>
        )}

        {user?.education && (
          <div className="flex items-center gap-3 text-gray-700">
            <MdSchool className="text-gray-500 text-xl" />
            <span>
              Học tại <strong>{user.education}</strong>
            </span>
          </div>
        )}

        {user?.currentAddress && (
          <div className="flex items-center gap-3 text-gray-700">
            <MdHome className="text-gray-500 text-xl" />
            <span>
              Sống tại <strong>{user.currentAddress}</strong>
            </span>
          </div>
        )}

        {user?.homeTown && (
          <div className="flex items-center gap-3 text-gray-700">
            <MdLocationOn className="text-gray-500 text-xl" />
            <span>
              Đến từ <strong>{user.homeTown}</strong>
            </span>
          </div>
        )}

        {user?.dateOfBirth && (
          <div className="flex items-center gap-3 text-gray-700">
            <MdCake className="text-gray-500 text-xl" />
            <span>
              Sinh ngày{" "}
              <strong>
                {new Date(user.dateOfBirth).toLocaleDateString("vi-VN")}
              </strong>
            </span>
          </div>
        )}

        {user?.phoneNumber && (
          <div className="flex items-center gap-3 text-gray-700">
            <MdPhone className="text-gray-500 text-xl" />
            <span>
              <strong>{user.phoneNumber}</strong>
            </span>
          </div>
        )}
      </div>

      {isOwnProfile && (
        <button className="w-full bg-gray-200 hover:bg-gray-300 py-2 rounded-lg font-semibold mt-4">
          Chỉnh sửa chi tiết
        </button>
      )}
    </div>
  );
}
