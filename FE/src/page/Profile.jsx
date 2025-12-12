import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { getUserInfor } from "../api/User";
import { getCurrentUserId } from "../utils/auth";
import { getPostsByUserId } from "../api/post";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileIntro from "../components/Profile/ProfileIntro";
import ProfilePhotos from "../components/Profile/ProfilePhotos";
import ProfileFriends from "../components/Profile/ProfileFriends";
import CreatePost from "../components/Profile/CreatePost";
import CreatePostModal from "../components/CreatePostModal";
import Post from "../components/Post";

export default function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUserId = getCurrentUserId();
        
        // Nếu không có userId trong URL, redirect về trang cá nhân của mình
        if (!userId) {
          if (currentUserId) {
            navigate(`/profile/${currentUserId}`, { replace: true });
          }
          return;
        }

        // Fetch thông tin user theo userId
        const res = await getUserInfor(userId);
        setUser(res.result);
        
        // Kiểm tra xem có phải trang cá nhân của mình không
        setIsOwnProfile(userId === currentUserId);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [userId, navigate]);

  // Fetch posts của user
  useEffect(() => {
    const fetchPosts = async () => {
      if (!userId) return;
      
      try {
        const token = localStorage.getItem("token");
        const res = await getPostsByUserId(userId, 0, 20, token);
        setPosts(res.data.result || []);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setPosts([]);
      }
    };
    fetchPosts();
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

        {/* Content Section */}
        <div className="max-w-5xl mx-auto mt-4 px-4">
          <div className="grid grid-cols-3 gap-4">
            {/* Left Sidebar */}
            <div className="col-span-1 space-y-4">
              <ProfileIntro user={user} isOwnProfile={isOwnProfile} />
              <ProfilePhotos />
              <ProfileFriends />
            </div>

            {/* Right Content - Posts */}
            <div className="col-span-2 space-y-4">
              {isOwnProfile && (
                <CreatePost user={user} onClick={() => setShowModal(true)} />
              )}
              {posts.length > 0 ? (
                posts
                  .filter((post) => post && post.id)
                  .map((post) => {
                    const mapped = {
                      id: post.id,
                      user: {
                        name: post.authorName || "Người dùng",
                        avatar: post.authorAvatar || "",
                      },
                      time: post.createdAt
                        ? new Date(post.createdAt).toLocaleString()
                        : "",
                      content: post.content,
                      images: Array.isArray(post.images) ? post.images : [],
                      likeCount: post.likeCount,
                      liked: post.liked || false,
                      comments: post.commentCount,
                      onLike: async () => {
                        const token = localStorage.getItem("token");
                        try {
                          const { toggleLike } = await import("../api/post");
                          await toggleLike(post.id, token);
                        } catch (e) {
                          alert("Lỗi like bài viết");
                        }
                      },
                    };
                    return <Post key={post.id} {...mapped} />;
                  })
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                  Chưa có bài viết nào
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {showModal && (
        <CreatePostModal
          user={{
            name: user?.fullName || "User",
            avatar: user?.avatarUrl || "",
          }}
          onClose={() => setShowModal(false)}
          onPostCreated={(newPost) => {
            setPosts([newPost, ...posts]);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
