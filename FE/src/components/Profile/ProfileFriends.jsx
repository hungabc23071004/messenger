export default function ProfileFriends() {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Bạn bè</h2>
        <a href="#" className="text-blue-600 hover:underline">
          Xem tất cả
        </a>
      </div>
      <p className="text-gray-600 mb-4">500 người bạn</p>
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <div key={i}>
            <img
              src={`https://randomuser.me/api/portraits/men/${i}.jpg`}
              className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-90"
              alt="friend"
            />
            <p className="text-sm font-medium mt-1 truncate">Bạn {i}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
