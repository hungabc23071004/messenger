import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ConversationList from "../components/ConversationList";
import ChatWindow from "../components/ChatWindow";

export default function Home() {
  const userId = localStorage.getItem("userId") || "user1";
  const [conversationId, setConversationId] = useState(null);

  // Callback để ConversationList báo về hội thoại đầu tiên khi load xong
  const handleConversationsLoaded = (convs) => {
    if (!conversationId && convs && convs.length > 0) {
      setConversationId(convs[0].id);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-100 overflow-hidden">
      <Header />
      <div className="flex flex-1 min-h-0 max-w-[1920px] mx-auto w-full">
        <div className="flex flex-1 min-h-0 shadow-lg bg-white">
          <ConversationList
            userId={userId}
            onSelect={setConversationId}
            selectedId={conversationId}
            onLoaded={handleConversationsLoaded}
          />
          <ChatWindow conversationId={conversationId} userId={userId} />
        </div>
      </div>
    </div>
  );
}
