import { success } from "zod"
import { ConversationModel } from "../model/conversation.model"
import { MessageModel } from "../model/message.model"

export const getConversationController = async (req, res, next) => {
    try{
        const conversations = await ConversationModel.find({user: req.user.id})
        .sort({updatedAt : -1})
        .lean()

        if(!conversations.length){
            return res.status(200).json({
                success:true,
                conversations:[],
            })
        }

        const conversationIds = conversations.map((conversation) => conversation._id);

        const messages = await MessageModel.find({
            conversation:{$in: conversationIds},
        })
        .sort({createdAt: 1})
        .lean();


        const messagesByConversation = new Map();

        for (const message of messages) {
            const key = message.conversation.toString();
            if (!messagesByConversation.has(key)) {
                messagesByConversation.set(key, []);
            }

            messagesByConversation.get(key).push({
                id: message._id,
                author: message.author,
                content: message.content,
                createdAt: message.createdAt,
            });
        }

        const responseConversations = conversations.map((conversation) => ({
            id: conversation._id,
            title: conversation.title,
            createdAt: conversation.createdAt,
            updatedAt: conversation.updatedAt,
            messages: messagesByConversation.get(conversation._id.toString()) || [],
        }));

        return res.status(200).json({
            success: true,
            conversations: responseConversations,
        });

    }catch(error){
        next(error)
    }
}




export const handleMessage = async (req, res) =>{
    const {message, conversationId} = req.body;

    const user = req.user;

    let conversation = null;

    
}











