
import { Router } from "express";
import { getConversationController, handleMessage } from "../controllers/conversation.controller";
import authMiddleware from "../middleware/auth.middleware";

let conversationRouter = Router();

conversationRouter.get("/",authMiddleware , getConversationController);
conversationRouter.post("/",authMiddleware, handleMessage);
