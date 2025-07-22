import { Router } from "express";
import { verifyToken } from "../utils/token-manager";
import { validate, chatCompletionvalidator } from "../utils/validator";
import { deleteChat, deleteAllChats, generateChatCompletion, getAllChats, getConversation,createChat } from "../controllers/chat-control";
import { verifyUser } from "../controllers/user-controller";


const chatRouter = Router();

chatRouter.post("/create", verifyToken, createChat);
chatRouter.post(
  "/generate",
  verifyToken,
  generateChatCompletion
);
chatRouter.get("/all",verifyToken,getAllChats);
chatRouter.get("/getconversation/:id",verifyToken,getConversation);
chatRouter.delete("/delete/:id",verifyToken,deleteChat);
chatRouter.delete("/deleteall",verifyToken,deleteAllChats);

export default chatRouter;
