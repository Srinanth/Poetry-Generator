import { createContext, useContext, ReactNode, useEffect, useCallback } from "react";
import { useState } from "react";
import axios from "axios";
import { server } from "../main";
import toast from "react-hot-toast";

interface Message {
  question: string;
  answer: string;
}
interface ChatContextType {
  fetchResponse: () => Promise<void>;
  message: Message[];
  setMessage: React.Dispatch<React.SetStateAction<Message[]>>;
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  newRequestLoading: boolean;
  chats:any[];
  createChat?: () => void;
  setChats?: React.Dispatch<React.SetStateAction<any[]>>;
  createLod?: boolean;
  selected: any;
  setSelected: React.Dispatch<React.SetStateAction<any>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  deleteChat: (id: any) => void;
  deleteAllChats:()=> void;
  fetchChats: () => void;
  fetchMessages:() => Promise<void>;  
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [message, setMessage] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState("");
  const [newRequestLoading, setNewRequestLoading] = useState(false);
  const [chats, setChats] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [createLod, setCreateLod] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchResponse = useCallback(async () => {
    if (!selected) {
     
      return alert("Please select a chat first");
    }
  
    setNewRequestLoading(true);
    setPrompt("");
  
    try {
      const payload = { message: prompt, chatId: selected }; // Include chatId in the payload  
      const response = await axios.post(
        `${server}/chat/generate`, 
        payload, // Send the payload with message and chatId
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const newMessage = {
        question: prompt,
        answer: response.data.chats[response.data.chats.length - 1].content, // Get the latest response
      };
  
      // Update the messages state
      setMessage((prev) => [...prev, newMessage]);
      setNewRequestLoading(false);
    } catch (error) {
      toast.error("Something went wrong");
      setNewRequestLoading(false);
    }
  }, [prompt, selected]); // dependency array

  const fetchChats = useCallback(async () => {
    try {      
      const { data } = await axios.get(`${server}/chat/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, 
          'Cache-Control': 'no-cache',
        },
      });
    
      if (data && Array.isArray(data)) {
        setChats(data);
  
        // Set the first chat as selected (if available)
        if (data.length > 0) {
          setSelected(data[0]._id);
        }
      } else {
        console.error("Invalid response format:", data); // Debug log
        
      }
    } catch (error) {
      console.error("Error fetching chats:", error); // Debug log
      
    }
  }, []);

  const createChat = useCallback(async () => {
    setCreateLod(true);
    try {
      const { data } = await axios.post(`${server}/chat/create`);
  
      if (!data || !data._id) {
        throw new Error("Invalid response from server");
      }
  
      // Update the chats state locally
      setChats((prev) => {
        if (!Array.isArray(prev)) {
          console.error("prev is not an array:", prev);
          return [data]; // Fallback: Return a new array with the new chat
        }
  
        const updatedChats = [...prev, data]; // Add the new chat to the list
        return updatedChats;
      });
  
      setSelected(data._id); // Set the new chat as selected
      setCreateLod(false);
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Failed to create chat");
      setCreateLod(false);
    }
  }, []);

  useEffect(() => {
    // Resets message state when the selected chat changes
    setMessage([]);
  }, [selected]);
  const fetchMessages = useCallback(async () => {
    if (!selected) {
      return;
    }
    setLoading(true);
    setMessage([]);
    try {
      const { data } = await axios.get(`${server}/chat/getconversation/${selected}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessage(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }, [selected]);
  

  const deleteChat = useCallback(async (id: string) => {
    try {
      await axios.delete(`${server}/chat/delete/${id}`);
      toast.success("Chat deleted successfully");
      setChats((prev) => {
        const updatedChats = prev.filter((chat) => chat._id !== id);
        return updatedChats;
      });
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error("Failed to delete chat");
    }
  }, []);

  const deleteAllChats = async () => {
    try {
      await axios.delete(`${server}/chat/deleteall`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setChats([]); // Clear the chats in the state
    } catch (error) {
      console.error('Error deleting all chats:', error);
      throw error;
    }
  };

  // Fetch chats when the component mounts
  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  // Fetch messages when the selected chat changes diff from reset
  useEffect(() => {
    if (selected) {
      fetchMessages();
    }
  }, [selected, fetchMessages]);

  return (
    <ChatContext.Provider
      value={{
        fetchResponse,
        message,
        setMessage,
        prompt,
        setPrompt,
        newRequestLoading,
        chats,
        createChat,
        setChats,
        createLod,
        selected,
        setSelected,
        loading,
        setLoading,
        deleteChat,
        deleteAllChats,
        fetchChats,
        fetchMessages
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatData = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatData must be used within a ChatProvider");
  }
  return context;
};