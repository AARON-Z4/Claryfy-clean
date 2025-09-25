import admin from 'firebase-admin';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

const db = admin.firestore();

// --- User Profile and Usage Management ---

export async function getUserProfile(userId) {
    const userRef = db.collection('users').doc(userId);
    let userDoc = await userRef.get();

    if (!userDoc.exists) {
        const defaultProfile = {
            plan: 'free',
            usageCount: 0,
            lastReset: admin.firestore.FieldValue.serverTimestamp()
        };
        await userRef.set(defaultProfile);
        userDoc = await userRef.get();
    }

    const userData = userDoc.data();
    
    const lastResetDate = userData.lastReset.toDate();
    const now = new Date();
    if (now.getDate() !== lastResetDate.getDate() || now.getMonth() !== lastResetDate.getMonth() || now.getFullYear() !== lastResetDate.getFullYear()) {
        await userRef.update({
            usageCount: 0,
            lastReset: admin.firestore.FieldValue.serverTimestamp()
        });
        userData.usageCount = 0;
    }
    
    return userData;
}

export async function incrementUsage(userId) {
    const userRef = db.collection('users').doc(userId);
    await userRef.update({
        usageCount: admin.firestore.FieldValue.increment(1)
    });
}


// --- Chat Management Functions ---
export async function createChat(userId, initialTitle) {
    const chatsRef = db.collection('users').doc(userId).collection('chats');
    const newChat = await chatsRef.add({ title: initialTitle, createdAt: admin.firestore.FieldValue.serverTimestamp() });
    return newChat.id;
}
export async function addMessageToChat(userId, chatId, messageData) {
    const messagesRef = db.collection('users').doc(userId).collection('chats').doc(chatId).collection('messages');
    await messagesRef.add({ ...messageData, timestamp: admin.firestore.FieldValue.serverTimestamp() });
}
export async function getChatList(userId) {
    const chatsRef = db.collection('users').doc(userId).collection('chats');
    const snapshot = await chatsRef.orderBy('createdAt', 'desc').get();
    if (snapshot.empty) return [];
    const chats = [];
    snapshot.forEach(doc => chats.push({ id: doc.id, ...doc.data() }));
    return chats;
}
export async function getChatMessages(userId, chatId) {
    const messagesRef = db.collection('users').doc(userId).collection('chats').doc(chatId).collection('messages');
    const snapshot = await messagesRef.orderBy('timestamp', 'asc').get();
    if (snapshot.empty) return [];
    const messages = [];
    snapshot.forEach(doc => messages.push({ id: doc.id, ...doc.data() }));
    return messages;
}
export async function renameChat(userId, chatId, newTitle) {
    const chatRef = db.collection('users').doc(userId).collection('chats').doc(chatId);
    await chatRef.update({ title: newTitle });
}
export async function deleteChat(userId, chatId) {
    const chatRef = db.collection('users').doc(userId).collection('chats').doc(chatId);
    // You might want to delete subcollections (messages) here as well in a real app
    await chatRef.delete();
}

// New function to delete all chats for a user
export async function deleteAllChats(userId) {
    const chatsRef = db.collection('users').doc(userId).collection('chats');
    const snapshot = await chatsRef.get();
    if (snapshot.empty) return;

    const batch = db.batch();
    snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
    });
    await batch.commit();
}
