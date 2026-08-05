import mongoose, { mongo } from "mongoose";


const userSchema = new mongoose.Schema(
    {
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        minLength:6
    }
},{
    timestamps:true
})

let UserModel = mongoose.model("user", userSchema)

 export default UserModel;