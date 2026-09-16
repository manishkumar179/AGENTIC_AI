import { Router } from "express";
import { loginController, logoutController, me, registerController } from "../controllers/auth.controller.js";
import protect from "../middleware/auth.middleware.js";

let authRouter = Router()

authRouter.post("/register" , registerController)
authRouter.post("/login" , loginController)
authRouter.post("/logout", logoutController)
authRouter.get("/me", protect, me)

export default authRouter