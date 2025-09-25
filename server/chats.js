import express from 'express';
import { getChatList, getChatMessages, renameChat, deleteChat, deleteAllChats } from './firestore.js';

const router = express.Router();

// GET all chat sessions for a user
router.get('/:userId', async (req, res) => {
    try {
        const chats = await getChatList(req.params.userId);
        res.json(chats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch chat list.' });
    }
});

// GET all messages for a specific chat
router.get('/:userId/:chatId', async (req, res) => {
    try {
        const messages = await getChatMessages(req.params.userId, req.params.chatId);
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch chat messages.' });
    }
});

// PUT (update) a chat's title
router.put('/:userId/:chatId', async (req, res) => {
    try {
        await renameChat(req.params.userId, req.params.chatId, req.body.title);
        res.status(200).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to rename chat.' });
    }
});

// DELETE a chat session
router.delete('/:userId/:chatId', async (req, res) => {
    try {
        await deleteChat(req.params.userId, req.params.chatId);
        res.status(200).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete chat.' });
    }
});

// DELETE all chat history for a user
router.delete('/:userId', async (req, res) => {
    try {
        await deleteAllChats(req.params.userId);
        res.status(200).json({ message: 'All chat history deleted successfully.' });
    } catch (error) {
        console.error("Failed to delete all chats:", error);
        res.status(500).json({ error: 'Failed to delete all chat history.' });
    }
});


export default router;
