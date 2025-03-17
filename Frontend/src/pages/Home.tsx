import React, { useState, useRef, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { GiHamburgerMenu } from "react-icons/gi";
import Header from "../components/header";
import { useChatData } from "../context/chat-context";
import { CgProfile } from "react-icons/cg";
import { FaRobot } from "react-icons/fa";
import { LoadingSmall } from "../components/loading";
import { IoMdSend } from "react-icons/io";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const { fetchResponse, message, prompt, setPrompt, newRequestLoading } = useChatData();
  const messagecontainerRef = useRef<HTMLDivElement | null>(null);
  //scrolling
  useEffect(() => {
    if (messagecontainerRef.current) {
      messagecontainerRef.current.scrollTo({
        top: messagecontainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [message]);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchResponse();
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Hamburger Menu */}
        {!isOpen && (
          <button
            className="md:hidden p-4 bg-gray-800 text-2xl"
            onClick={toggleSidebar}
          >
            <GiHamburgerMenu />
          </button>
        )}

        {/* Header */}
        <div className="p-6">
          <Header />
        </div>

        {/* Message Container */}
        <div
          className="flex-1 p-6 overflow-y-auto thin-scrollbar pb-32" // Added pb-32 for padding at the bottom
          ref={messagecontainerRef}
        >
          {message && message.length > 0 ? (
            message.map((e, i) => (
              <div key={i}>
                {/* User Message */}
                <div className="mb-4 p-4 rounded-lg bg-blue-700 text-white flex gap-3 items-start max-w-[80%] ml-auto">
                  <div className="bg-white p-2 rounded-full text-black text-2xl">
                    <CgProfile />
                  </div>
                  <p>{e.question}</p>
                </div>

                {/* ai Message */}
                <div className="mb-4 p-4 rounded-lg bg-gray-700 text-white flex gap-3 items-start max-w-[80%]">
                  <div className="bg-white p-2 rounded-full text-black text-2xl">
                    <FaRobot />
                  </div>
                  <p dangerouslySetInnerHTML={{ __html: e.answer }}></p>
                </div>
              </div>
            ))
          ) : (
            //no messages display
            <div className="text-center text-gray-400">
              <p className="text-xl">No messages yet.</p>
              <p className="text-lg">Start a conversation by typing below!</p>
            </div>
          )}

          {/* Loading Spinner */}
          {newRequestLoading && <LoadingSmall />}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gray-900">
          <form
            onSubmit={submitHandler}
            className="flex justify-center items-center gap-2"
          >
            <input
              className="flex-grow p-4 bg-gray-700 rounded-lg text-white outline-none"
              type="text"
              placeholder="Enter a prompt here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
            />
            <button
              type="submit"
              className="p-4 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
              disabled={newRequestLoading}
            >
              <IoMdSend />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;