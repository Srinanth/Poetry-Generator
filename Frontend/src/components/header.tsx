import { useChatData } from '../context/chat-context';

const Header = () => {
  const { chats } = useChatData();

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-white mb-2">Poetry AI</h1>
      {chats && chats.length === 0 && (
        <p className="text-lg text-gray-400">Create a new chat to start your poetic journey!</p>
      )}
    </div>
  );
};

export default Header;