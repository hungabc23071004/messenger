import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import FriendSidebar from "../components/FriendSidebar";
import FriendCard from "../components/FriendCard";
import {
  getFriends,
  getFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  unfriend,
  getFriendsWithBirthdayToday,
} from "../api/friendship";
import { getUserInfor } from "../api/User";
import { onConnected } from "../api/WebsocketService";

export default function FriendsPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [birthdayFriends, setBirthdayFriends] = useState([]);
  const [loading, setLoading] = useState(false);

  // WebSocket subscription for realtime friend notifications
  useEffect(() => {
    let subscription;

    onConnected((client) => {
      // Subscribe to private friendship queue
      subscription = client.subscribe(
        "/user/queue/friendship",
        async (message) => {
          const event = JSON.parse(message.body);
          console.log("🔔 Friend notification:", event);

          if (event.type === "FRIEND_REQUEST_NEW") {
            // Delta Fetching: Chỉ fetch thông tin inviter mới
            try {
              const userResponse = await getUserInfor(event.inviterId);
              const newRequest = {
                id: event.friendshipId,
                friendshipId: event.friendshipId,
                name: userResponse.result.fullName,
                avatar:
                  userResponse.result.avatarUrl ||
                  "https://randomuser.me/api/portraits/men/32.jpg",
                mutual: 0,
              };

              // Prepend vào đầu list nếu đang ở tab requests
              if (selectedTab === "requests") {
                setFriendRequests((prev) => [newRequest, ...prev]);
              }

              console.log(`📨 New friend request from: ${newRequest.name}`);
            } catch (error) {
              console.error("Error fetching inviter info:", error);
              // Fallback: Reload toàn bộ list
              if (selectedTab === "requests") {
                loadFriendRequests();
              }
            }
          } else if (event.type === "FRIEND_REQUEST_ACCEPTED") {
            // Delta Fetching: Chỉ fetch thông tin friend mới
            try {
              const friendId = event.accepterId || event.friendId;
              const userResponse = await getUserInfor(friendId);
              const newFriend = {
                id: userResponse.result.id,
                name: userResponse.result.fullName,
                avatar:
                  userResponse.result.avatarUrl ||
                  "https://randomuser.me/api/portraits/men/32.jpg",
                mutual: 0,
              };

              // Prepend vào đầu list nếu đang ở tab all
              if (selectedTab === "all") {
                setFriends((prev) => [newFriend, ...prev]);
              }

              console.log(`✅ Friend request accepted: ${newFriend.name}`);
            } catch (error) {
              console.error("Error fetching friend info:", error);
              // Fallback: Reload toàn bộ list
              if (selectedTab === "all") {
                loadFriends();
              }
            }
          } else if (event.type === "FRIEND_REMOVED") {
            // Someone unfriended you
            console.log(
              `⚠️ User removed you from friends. userId: ${event.data}`
            );

            // Debug: Check current friends list
            console.log(
              "Current friends before filter:",
              friends.map((f) => ({ id: f.id, name: f.name }))
            );
            console.log("Removing friend with id:", event.data);

            // event.data contains the userId who unfriended you
            // Remove them from your friends list
            setFriends((prev) => {
              const filtered = prev.filter((f) => f.id !== event.data);
              console.log(
                "Friends after filter:",
                filtered.map((f) => ({ id: f.id, name: f.name }))
              );
              return filtered;
            });
          }
        }
      );
    });

    // Cleanup subscription on unmount
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [selectedTab]);

  // Fetch friends list
  useEffect(() => {
    if (selectedTab === "all") {
      loadFriends();
    }
  }, [selectedTab]);

  // Fetch friend requests
  useEffect(() => {
    if (selectedTab === "requests") {
      loadFriendRequests();
    }
  }, [selectedTab]);

  // Fetch birthday friends
  useEffect(() => {
    if (selectedTab === "birthday") {
      loadBirthdayFriends();
    }
  }, [selectedTab]);

  const loadFriends = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await getFriends(token);
      const friendsData = response.data?.result || [];

      // Map to FriendCard format
      const mappedFriends = friendsData.map((user) => ({
        id: user.id,
        name: user.fullName,
        avatar:
          user.avatarUrl || "https://randomuser.me/api/portraits/men/32.jpg",
        mutual: 0, // TODO: Implement mutual friends count
      }));

      setFriends(mappedFriends);
    } catch (error) {
      console.error("Error loading friends:", error);
      setFriends([]);
    } finally {
      setLoading(false);
    }
  };

  const loadFriendRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await getFriendRequests(0, 20, token);
      const requestsData =
        response.data?.result?.content || response.data?.result || [];

      // Map to FriendCard format
      const mappedRequests = requestsData.map((req) => ({
        id: req.id,
        friendshipId: req.id,
        name: req.inviterName,
        avatar:
          req.inviterAvatar || "https://randomuser.me/api/portraits/men/32.jpg",
        mutual: 0,
      }));

      setFriendRequests(mappedRequests);
    } catch (error) {
      console.error("Error loading friend requests:", error);
      setFriendRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const loadBirthdayFriends = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await getFriendsWithBirthdayToday(token);
      const birthdayData = response.data?.result || [];

      // Map to FriendCard format
      const mappedBirthdays = birthdayData.map((user) => ({
        id: user.id,
        name: user.fullName,
        avatar:
          user.avatarUrl || "https://randomuser.me/api/portraits/men/32.jpg",
        mutual: 0,
      }));

      setBirthdayFriends(mappedBirthdays);
    } catch (error) {
      console.error("Error loading birthday friends:", error);
      setBirthdayFriends([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (friend) => {
    try {
      const token = localStorage.getItem("token");
      await acceptFriendRequest(friend.friendshipId, token);

      // Remove from requests list
      setFriendRequests((prev) => prev.filter((f) => f.id !== friend.id));
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleRemove = async (friend) => {
    try {
      const token = localStorage.getItem("token");

      if (selectedTab === "requests") {
        // Decline friend request
        await declineFriendRequest(friend.friendshipId, token);
        setFriendRequests((prev) => prev.filter((f) => f.id !== friend.id));
      } else {
        // Unfriend
        await unfriend(friend.id, token);
        setFriends((prev) => prev.filter((f) => f.id !== friend.id));
      }
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  const displayData =
    selectedTab === "requests"
      ? friendRequests
      : selectedTab === "birthday"
      ? birthdayFriends
      : friends;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <FriendSidebar selected={selectedTab} onSelect={setSelectedTab} />
        <main className="flex-1 overflow-y-auto bg-gray-100">
          <div className="px-6 py-5 bg-white border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800">
                {selectedTab === "all" && `Tất cả bạn bè (${friends.length})`}
                {selectedTab === "requests" &&
                  `Lời mời kết bạn (${friendRequests.length})`}
                {selectedTab === "suggest" && "Gợi ý"}
                {selectedTab === "birthday" && "Sinh nhật"}
                {selectedTab === "custom" && "Danh sách tuỳ chỉnh"}
              </h3>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Đang tải...</div>
            ) : displayData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {selectedTab === "requests"
                  ? "Không có lời mời kết bạn nào"
                  : "Chưa có bạn bè"}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {displayData.map((f) => (
                  <FriendCard
                    key={f.id}
                    friend={f}
                    onAccept={
                      selectedTab === "requests" ? handleAccept : undefined
                    }
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
