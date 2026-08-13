import dotenv from 'dotenv'
dotenv.config()
import UserModel from "../model/user.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { success } from 'zod';
import { tr } from 'zod/locales';

const cookieOption ={
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
}

const signToken = (id)=> jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"1h"} )

const sanitizeUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
});
 
//--------------------------- 1. Register controller -----------------------------------------------------------
export const registerController =async (req, res, next)=>{
    try {

        // Get data from body
        const {name, email, password} = req.body;

        // check data is getting or not
        if(!name || !email || !password){
            return res.status(404).json({
                message:'Name, email and password  are required'
            })
        }

        //Check is user existing already or not

        const existingUser = await UserModel.findOne({email: email.toLowerCase()})

        if(existingUser){
            return res.status(409).json({
                message:"User already exist"
            })
        }

        //Hashed the password

        const hashedPassword = await bcrypt.hash(password, 10);

        //Craete a datbase or save in database
        const user = await UserModel.create({
            name:name.trim(),
            email:email.toLowerCase().trim(),
            password:hashedPassword
        })

        // generate tokens 
        const token = signToken(user._id)

        // Saving token to cookie
        res.cookie("token",token,cookieOption)

        return res.status(201).json({
            success:true,
            message:"Registered successfully",
            user:sanitizeUser(user)
        })

        
    } catch (error) {
        next(error)
    }
}


// --------------------------2. Login Controller------------------------------------
export const loginController = async (req, res, next) =>{
    try {
        const {email, password} = req.body

        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Email and password are required"
            })
        }

        // Find user in database

        const user = await UserModel.findOne({email:email.toLowerCase()})
        if(!user){
            return res.status(401).json({
                message:"Invalid credentials"
            })
        }

        const checkPassword = await bcrypt.compare(password, user.password);
        if(!checkPassword){
            return res.status(401).json({
                message:"Invalid credentials"
            })
        }

        const token = signToken(user._id);
        res.cookie("token", token,cookieOption)

        
        return res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            user: sanitizeUser(user),
        });

    } catch (error) {
        next(error)
    }
}


//---------------------------3. Logout Controller-------------------------------------

export const logoutController = async (req, res, next)=>{
    try {
        res.clearCookie("token",{
            ...cookieOption
        })

        return res.status(200).json({
            success:true,
            message:"Logout successfully"
        })
    } catch (error) {
        next(error)
    }
}


// ---------------------- /me Controller--------------------------------------

// Your me controller assumes that authentication middleware has already 
// verified the JWT and attached the user information to req.user.

/*

Client
  │
  │ GET /auth/me
  │ Cookie: token=JWT
  ▼
Authentication Middleware
  │
  │ Verify JWT
  │
  │ Extract user ID
  │
  │ req.user = { id: "123..." }
  ▼
me Controller
  │
  │ User.findById(req.user.id)
  ▼
MongoDB
  │
  ▼
User data
  │
  ▼
Response


*/


export const me = async (req, res, next)=>{
    try {
        const user = await UserModel.findById(req.user.id).select("-password");

        if(!user){
            return res.status(404).json({
                message:"User not found! "
            })
        }

        return res.status(200).json({
            success:true,
            user
        })

    } catch (error) {
        next(error);
    }
}




