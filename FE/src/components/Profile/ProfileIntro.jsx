export default function ProfileIntro({ isOwnProfile }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">Giới thiệu</h2>
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-gray-700">
          <span className="material-icons text-gray-500">work</span>
          <span>
            Làm việc tại <strong>Công ty ABC</strong>
          </span>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <span className="material-icons text-gray-500">school</span>
          <span>
            Học tại <strong>Đại học XYZ</strong>
          </span>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <span className="material-icons text-gray-500">home</span>
          <span>
            Sống tại <strong>Hà Nội</strong>
          </span>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <span className="material-icons text-gray-500">location_on</span>
          <span>
            Đến từ <strong>Việt Nam</strong>
          </span>
        </div>
      </div>
      {isOwnProfile && (
        <button className="w-full bg-gray-200 hover:bg-gray-300 py-2 rounded-lg font-semibold mt-4">
          Chỉnh sửa chi tiết
        </button>
      )}
    </div>
  );
}
