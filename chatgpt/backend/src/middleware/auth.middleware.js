import dotenv from 'dotenv'
dotenv.config()
import jwt from 'jsonwebtoken';
import UserModel from '../model/user.model.js';


const authMiddleware = async (req, res, next)=>{
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                message:"No authorized! Please login "
            })
        }

        let decode = jwt.verify(token, process.env.JWT_SECRET);
        if(!decode){
            return res.status(401).json({
                message:"Unauthorized user"
            })
        }

        const findUser = await UserModel.findById(decode.id);
        
        if(!user){
            return res.status(404).json({
                message:"user not found"
            })
        }

        req.user = user;

        next()

    } catch (error) {
        return res.status(500).json({
            message:"Session expired! Please login again."
        })
    }
}

export default authMiddleware;


