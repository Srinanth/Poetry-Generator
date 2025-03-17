import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextFunction, Request, Response } from "express";
import User from "../models/user.js";
import { Chat } from "../models/chats.js";
import { Conversation } from "../models/convo.js";
import  { models, generationConfig, parts } from "../config/gemini-config.js";
import dotenv from 'dotenv';
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const generateChatCompletion = async (req, res, next) => {
  console.log("Backend: Request received at /chat/generate");
  console.log("Backend: Request body:", req.body);

  const { message, chatId } = req.body;
  const userId = res.locals.jwtData.id;

  try {
    let chat = await Chat.findOne({ _id: chatId, user: userId });

    if (!chat) {
      
      chat = await Chat.create({ user: userId, latestMessage: "New Chat" });
    }
    const words = message.trim().split(/\s+/);
    if (words.length < 2) {
     
      const reply = "Please provide a sentence or phrase with at least 2 words for me to create a poetry";

      
      await Conversation.create({ chat: chat._id, question: message, answer: reply });

      if (chat.latestMessage === "New Chat") {
        chat.latestMessage = message.length > 30 ? message.slice(0, 30) + "..." : message;
        await chat.save();
      }

      return res.status(200).json({
        chatId: chat._id,
        chats: [{ content: message, role: "user" }, { content: reply, role: "assistant" }],
      });
    }
    const updatedParts = [...parts, { text: `input: ${message}` }];
    const result = await model.generateContent({
      contents: [{ role: "user", parts: updatedParts }],
      generationConfig,
    });
    let reply = result.response.text() || "No response";
    reply = reply.replace(/^output:\s*/i, "");
    await Conversation.create({ chat: chat._id, question: message, answer: reply });

    if (chat.latestMessage === "New Chat") {
      chat.latestMessage = message.length > 30 ? message.slice(0, 30) + "..." : message;
      await chat.save();
    }
    return res.status(200).json({
      chatId: chat._id,
      chats: [{ content: message, role: "user" }, { content: reply, role: "assistant" }],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteAllChats = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.jwtData.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }
    await Chat.deleteMany({ user: userId });

    res.status(200).json({ message: "All chats deleted successfully" });
  } catch (error) {
    console.error("Error deleting all chats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createChat = async (req, res) => {
  try {
    const userId = res.locals.jwtData.id;
    const chat = await Chat.create({ user: userId });
    console.log("Chat created:", chat);

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllChats = async (req: Request, res: Response) => {
  try {
    console.log("getting chats")
    
    // Ensure res.locals.jwtData exists
    if (!res.locals.jwtData || !res.locals.jwtData.id) {
      return res.status(401).json({ message: "Unauthorized: Token data missing" });
    }

    const userId = res.locals.jwtData.id;
    console.log("Fetching chats for user ID:", userId); // Debug log

    // Debug: Check if the user exists in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Fetch chats for the user
    const chats = await Chat.find({ user: userId }).sort({ createdAt: -1 });
    if (!Array.isArray(chats)) {
      console.error("Invalid chats format:", chats); // Debug log
      return res.status(500).json({ message: "ERROR", cause: "Invalid chats format" });
    }
    
    console.log("Fetched chats from database:", chats); // Debug log

    // Ensure the response has the correct format
    return res.status(200).json(chats); // Return the chats array directly
  } catch (error) {
    console.error("Error fetching chats:", error); // Debug log
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

export const getConversation = async (req, res) => {
  try {
    const chatId = req.params.id;
    const userId = res.locals.jwtData.id;
    const chat = await Chat.findOne({ _id: chatId, user: userId });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found or unauthorized" });
    }
    const conversation = await Conversation.find({ chat: chatId });
    if (!conversation) {
      return res.status(404).json({ message: "No conversation found for this chat" });
    }
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteChat = async (req: Request, res: Response) => {
  try {
    const chatId = req.params.id;
    const userId = res.locals.jwtData.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
    }
    const chat = await Chat.findOneAndDelete({ _id: chatId, user: userId });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found or does not belong to the user' });
    }
  
    res.status(200).json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
