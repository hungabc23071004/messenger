import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import OnlineFriends from "../components/OnlineFriends";

export default function Home() {
  return (
    <div className="w-screen h-screen flex flex-col bg-gray-100 overflow-hidden">
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 p-4 overflow-y-auto min-h-0">
          <Feed />
        </main>
        <aside className="w-72 p-4 hidden md:block overflow-y-auto min-h-0">
          <OnlineFriends />
        </aside>
      </div>
    </div>
  );
}
