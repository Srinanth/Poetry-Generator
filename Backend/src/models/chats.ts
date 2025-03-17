import mongoose from "mongoose";
import { Conversation } from "./convo";

const chatSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        index: true, 
    },
    latestMessage:{
        type:String,
        default:"New Chat",
    },

},{
    timestamps:true,
})
chatSchema.pre("findOneAndDelete", async function (next) {
    const chat = await this.model.findOne(this.getFilter());
    if (chat) {
      await Conversation.deleteMany({ chat: chat._id });
    }
    next();
  });
export const Chat = mongoose.model("Chat",chatSchema)