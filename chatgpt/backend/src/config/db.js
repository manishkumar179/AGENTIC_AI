import mongoose  from "mongoose";

export const connectDB = async ()=>{
    try {
        await mongoose.connect("mongodb://0.0.0.0/chatgpt")
        console.log("Database connected successfully")
    } catch (error) {
        console.log("Database disconnected")
    }
}
