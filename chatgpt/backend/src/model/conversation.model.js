import mongoose from "mongoose";


const conversationSchema  = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    title:{
        type:String,
        required:true
    }
},{
    timestamps:true
})


export const ConversationModel = mongoose.model("conversation", conversationSchema )
