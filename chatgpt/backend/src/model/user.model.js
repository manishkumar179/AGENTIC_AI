import mongoose, { mongo } from "mongoose";
import { required } from "zod/mini";

const userSchema = new mongoose.Schema(
    {
    name:{
        type:String,
        required:true
    }
})