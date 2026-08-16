import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
    conversation:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Conversation",
        required:true
    },
    author:{
        type:String,
        enum:["user", "ai"],
        default:"user"
    },
    content:{
        type:String,
        required:true
    }
},{
    timestamps:true
})


export const MessageModel = mongoose.model("message", messageSchema);