import app from "./app/app.js";
import dotenv from 'dotenv'
import { connectDB } from "./config/db.js";
dotenv.config()

const PORT = process.env.PORT

app.listen(PORT,()=>{
    connectDB()
    console.log(`Server started at port ${PORT} ` )
})