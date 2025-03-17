import React, { useEffect } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { useChatData } from "../context/chat-context";
import { useAuth } from "../context/AuthContext";
import { LoadingSpinner } from "./loading";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { chats, createChat, createLod, setSelected, deleteChat, fetchChats, deleteAllChats } =
    useChatData();
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const deleteChatHandler = (id: string) => {
    if (confirm("Are you sure you want to delete this chat?")) {
      deleteChat(id);
      toast.success("Chat deleted successfully");
    }
  };

  const clickEvent = (chatId: string) => {
    setSelected(chatId);
    toggleSidebar();
  };

  const handleDeleteAll = async () => {
    if (chats.length === 0) {
      toast.error("No chats to delete");
      return;
    }

    if (window.confirm("Are you sure you want to delete all chats?")) {
      try {
        await deleteAllChats();
        toast.success("All chats deleted successfully");
      } catch (error) {
        toast.error("Failed to delete all chats");
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 w-64 bg-gray-800 p-4 transition-transform transform z-20 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0 flex flex-col h-screen pb-24`}
    >
      {/* Close Button */}
      <button
        className="absolute top-4 right-4 p-2 bg-gray-700 rounded-md md:hidden"
        onClick={toggleSidebar}
      >
        <IoIosCloseCircle size={32} color="white" />
      </button>

      {/* Sidebar Header */}
      <h2 className="text-2xl font-semibold text-white mb-6">Menu</h2>

      {/* Mobile Logout Button */}
      <div className="md:hidden mb-4">
        <button
          className="bg-red-600 text-white text-xl px-3 py-2 rounded-md hover:bg-red-700 w-full"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* New Chat Button */}
      <div className="mb-4">
        <button
          className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded"
          onClick={createChat}
        >
          {createLod ? <LoadingSpinner /> : "New Chat +"}
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto mb-4">
        <p className="text-sm text-gray-400 mb-2">Recent</p>

        <div className="space-y-2">
          {chats.map((chat) => (
            <div
              key={chat._id}
              className="w-full text-left py-2 px-2 bg-gray-700 hover:bg-gray-600 rounded flex justify-between items-center cursor-pointer"
              onClick={() => clickEvent(chat._id)}
            >
              <span>{chat.latestMessage}</span>
              <button
                className="bg-red-600 text-white text-xl px-3 py-2 rounded-md hover:bg-red-700"
                onClick={(event) => {
                  event.stopPropagation();
                  deleteChatHandler(chat._id);
                }}
              >
                <MdDelete />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4">
            <button
              onClick={handleDeleteAll}
              className="w-full py-2 bg-red-600 text-white text-xl rounded-md hover:bg-red-700 flex items-center justify-center gap-2"
              disabled={chats.length === 0}
            >
              <MdDelete /> Delete All
            </button>
      </div>
      </div>
      {/* Logout Button */}
      <div className="mt-4 hidden md:block">
        <button
          className="bg-red-600 text-white text-xl px-3 py-2 rounded-md hover:bg-red-700 w-full"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};
