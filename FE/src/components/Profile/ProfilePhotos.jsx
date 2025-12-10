export default function ProfilePhotos() {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Ảnh</h2>
        <a href="#" className="text-blue-600 hover:underline">
          Xem tất cả
        </a>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <img
            key={i}
            src={`https://picsum.photos/200/200?random=${i}`}
            className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-90"
            alt="photo"
          />
        ))}
      </div>
    </div>
  );
}
