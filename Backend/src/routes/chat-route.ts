import { Router } from "express";
import { verifyToken } from "../utils/token-manager";
import { validate, chatCompletionvalidator } from "../utils/validator";
import { deleteChat, deleteAllChats, generateChatCompletion, getAllChats, getConversation,createChat } from "../controllers/chat-control";
import { verifyUser } from "../controllers/user-controller";


const chatRouter = Router();

chatRouter.post("/create",createChat);
chatRouter.post(
  "/generate",
  verifyToken,
  generateChatCompletion
);
chatRouter.get("/all",getAllChats);
chatRouter.get("/getconversation/:id",getConversation);
chatRouter.delete("/delete/:id",deleteChat);
chatRouter.delete("/deleteall",deleteAllChats);

export default chatRouter;
