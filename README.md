Claryfy

Claryfy is a full-stack AI-powered web application designed to deliver intelligent insights through a modern, interactive user experience. It integrates AI, web scraping, 3D visualization, and real-time collaboration into one platform.

🚀 Project Structure
Claryfy/
│── client/               # React-based frontend (port 3001)
│   ├── src/              # Frontend source code
│   ├── public/           # Static assets
│   └── package.json      # Frontend dependencies
│
│── server/               # Node.js Express backend
│   ├── routes/           # API routes
│   ├── controllers/      # Business logic & AI integration
│   ├── utils/            # Helpers (Firebase, Puppeteer, etc.)
│   └── package.json      # Backend dependencies
│
│── README.md             # Project documentation
│── .gitignore            # Ignored files & folders

⚙️ Key Technologies

Frontend: React.js, Tailwind CSS, Globe.gl (3D visualization)

Backend: Node.js, Express.js

AI Integration: Google Generative AI APIs

Database & Auth: Firebase

Web Scraping: Puppeteer

Version Control: Git & GitHub

🛠 Development Setup
1. Clone Repository
git clone https://github.com/your-username/claryfy.git
cd claryfy

2. Install Dependencies

Client

cd client
npm install


Server

cd server
npm install

3. Run Development Servers

Frontend (React)

npm run dev


Runs on http://localhost:3001

Backend (Node/Express)

npm run dev


Runs on http://localhost:5000
 (or configured port)

Both run in parallel, with hot reloading and automatic CSS compilation.

📊 Features

🔹 AI-Powered Analysis using Google Generative AI

🔹 Real-Time Collaboration with Firebase

🔹 Web Scraping via Puppeteer for live data integration

🔹 3D Visualization with React Globe.gl

🔹 Responsive UI built with Tailwind CSS

🔹 Secure Auth & Database powered by Firebase

📦 Available Scripts (Client)

npm run dev → Start development server

npm run build → Build for production

npm run lint → Run linter

🔐 Environment Variables

Create a .env file in both client and server directories.

Example (server/.env):
PORT=5000
FIREBASE_API_KEY=your_firebase_key
GOOGLE_AI_API_KEY=your_google_genai_key

Example (client/.env):
VITE_API_URL=http://localhost:5000

🚀 Deployment

Frontend → Vercel / Netlify

Backend → Render / Railway / AWS / Heroku

Database & Auth → Firebase
