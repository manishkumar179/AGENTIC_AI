
import { Router } from "express";
import { getConversationController, handleMessage } from "../controllers/conversation.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

let conversationRouter = Router();

conversationRouter.get("/",authMiddleware , getConversationController);
conversationRouter.post("/",authMiddleware, handleMessage);

export default conversationRouter


