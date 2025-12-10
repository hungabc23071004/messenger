import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { getMyInfor, getUserInfor } from "../api/User";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileTabs from "../components/Profile/ProfileTabs";
import ProfileIntro from "../components/Profile/ProfileIntro";
import ProfilePhotos from "../components/Profile/ProfilePhotos";
import ProfileFriends from "../components/Profile/ProfileFriends";
import CreatePost from "../components/Profile/CreatePost";
import Post from "../components/Post";

export default function Profile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (userId) {
          const res = await getUserInfor(userId);
          setUser(res.result);
          setIsOwnProfile(false);
        } else {
          const res = await getMyInfor();
          setUser(res.result);
          setIsOwnProfile(true);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [userId]);

  if (!user) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-100">
      <Header />

      <div className="flex-1 overflow-y-auto">
        <ProfileHeader user={user} isOwnProfile={isOwnProfile} />
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content Section */}
        <div className="max-w-5xl mx-auto mt-4 px-4">
          <div className="grid grid-cols-3 gap-4">
            {/* Left Sidebar */}
            <div className="col-span-1 space-y-4">
              <ProfileIntro isOwnProfile={isOwnProfile} />
              <ProfilePhotos />
              <ProfileFriends />
            </div>

            {/* Right Content - Posts */}
            <div className="col-span-2 space-y-4">
              {isOwnProfile && <CreatePost user={user} />}
              {[1, 2, 3].map((postId) => (
                <Post key={postId} user={user} postId={postId} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
