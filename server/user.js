import express from 'express';
import { getUserProfile } from './firestore.js'; // Make sure this function is exported from firestore.js

const router = express.Router();

// Route to get a user's profile
router.get('/:userId/profile', async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    try {
        const userProfile = await getUserProfile(userId);
        res.json(userProfile);
    } catch (error) {
        console.error('Failed to get user profile:', error);
        res.status(500).json({ error: 'Failed to retrieve user profile' });
    }
});

export default router;