import express from 'express';
import cors from 'cors';
import predictRoute from './predict.js';
import chatsRoute from './chats.js';
import userRoute from './user.js'; // 1. Import the new user route
import './firestore.js';

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/predict', predictRoute);
app.use('/api/chats', chatsRoute);
app.use('/api/user', userRoute); // 2. Add the new user route

app.listen(PORT, () => {
  console.log(` Backend server running on http://localhost:${PORT}`);
});