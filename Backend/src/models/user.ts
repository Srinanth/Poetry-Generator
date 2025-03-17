import mongoose from "mongoose";
import {randomUUID} from "crypto";



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    chats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
});


export default mongoose.model('User',userSchema);