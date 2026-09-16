import { ConversationModel } from "../model/conversation.model.js"
import { MessageModel } from "../model/message.model.js"
import { getStream, generateTitle } from "../services/ai.service.js"

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



export const handleMessage = async (req, res) => {
    try {
        const { message, conversationId } = req.body;

        console.log('MESSAGE RECEIVED:', message);
        console.log('CONVERSATION ID:', conversationId);
        console.log('USER:', req.user);

        const user = req.user;

        let conversation = null;

        if (!conversationId) {
            console.log('Creating new conversation...');

            let title = message.slice(0, 30) || 'New Conversation';
            try {
                const generatedTitle = await generateTitle({ message });
                if (generatedTitle) {
                    title = generatedTitle;
                }
            } catch (err) {
                console.warn('Title generation failed, using fallback title:', err.message);
            }

            console.log('Generated title:', title);

            conversation = await ConversationModel.create({
                title,
                user: req.user.id,
            });
        } else {
            conversation = await ConversationModel.findOne({
                _id: conversationId,
                user: req.user.id,
            });

            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    message: 'Conversation not found',
                });
            }
        }

        console.log('Conversation:', conversation._id);

        const userMessage = await MessageModel.create({
            conversation: conversation._id,
            content: message,
            author: 'user',
        });

        console.log('User message created:', userMessage._id);

        const messages = await MessageModel.find({
            conversation: conversation._id,
        });

        console.log('Messages:', messages.length);

        console.log('Calling getStream...');

        const stream = await getStream({
            messages,
            userId: user.id,
        });

        console.log('Stream received');

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader(
            'X-Conversation-Id',
            conversation._id.toString()
        );
        res.setHeader(
            'X-Conversation-Title',
            conversation.title
        );
        res.setHeader(
            'Access-Control-Expose-Headers',
            'X-Conversation-Id, X-Conversation-Title'
        );

        let assistantReply = '';

        for await (const chunk of stream) {
            // Support both chunk message object / tuple format and text content extraction
            const token = Array.isArray(chunk) ? chunk[0] : chunk;
            const tokenText = typeof token?.content === 'string' ? token.content : (token?.text || '');

            if (!tokenText) continue;

            assistantReply += tokenText;

            process.stdout.write(tokenText);

            const lines = tokenText.split('\n');

            for (const line of lines) {
                res.write(`data: ${line}\n`);
            }

            res.write('\n');
        }

        if (assistantReply.trim()) {
            await MessageModel.create({
                conversation: conversation._id,
                content: assistantReply,
                author: 'ai',
            });
        }

        await ConversationModel.updateOne(
            { _id: conversation._id },
            { $set: { updatedAt: new Date() } }
        );

        res.end();

    } catch (error) {
        console.error('🔥 HANDLE MESSAGE ERROR:', error);

        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to process message',
            });
        }

        // If headers were already sent, stream the error over SSE so frontend receives it
        const errorMessage = error.message || 'An error occurred while streaming response';
        res.write(`data: [ERROR] ${errorMessage}\n\n`);
        res.end();
    }
};











