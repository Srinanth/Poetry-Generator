import mongoose from "mongoose";

const convoSchema = new mongoose.Schema({
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Chat',
        required:true,
        index: true, 
    },
    question:{
        type:String,
        required:true,
    },
    answer:{
        type:String,
        required:true,
    }
},{
    timestamps:true,
})

export const Conversation = mongoose.model("Conversation",convoSchema)