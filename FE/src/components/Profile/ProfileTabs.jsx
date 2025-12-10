export default function ProfileTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "posts", label: "Bài viết" },
    { id: "about", label: "Giới thiệu" },
    { id: "friends", label: "Bạn bè" },
    { id: "photos", label: "Ảnh" },
    { id: "videos", label: "Video" },
  ];

  return (
    <div className="bg-white">
      <div className="max-w-5xl mx-auto px-8">
        <div className="border-t border-gray-300">
          <div className="flex gap-2 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-semibold border-b-4 transition ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
