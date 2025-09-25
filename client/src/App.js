import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import axios from 'axios';

import Login from './components/Login';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import LandingPage from './components/LandingPage';

const API_URL = 'http://localhost:5001';

const App = () => {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    
    const [chatList, setChatList] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const fetchUserProfile = async (userId) => {
        try {
            const response = await axios.get(`${API_URL}/api/user/${userId}/profile`);
            setUserProfile(response.data);
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            setUserProfile({ plan: 'free', usageCount: 0 }); 
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                await fetchUserProfile(currentUser.uid);
                fetchChatList(currentUser.uid);
            } else {
                setUser(null);
                setUserProfile(null);
                setChatList([]);
                setActiveChatId(null);
                setMessages([]);
            }
            setLoadingAuth(false);
        });
        return () => unsubscribe();
    }, []);

    const fetchChatList = async (userId) => {
        try {
            const response = await axios.get(`${API_URL}/api/chats/${userId}`);
            setChatList(response.data);
        } catch (error) {
            console.error("Failed to fetch chat list:", error);
        }
    };

    const fetchMessages = async (chatId) => {
        if (!user || !chatId) return;
        setIsLoading(true);
        setMessages([]);
        try {
            const response = await axios.get(`${API_URL}/api/chats/${user.uid}/${chatId}`);
            setMessages(response.data);
        } catch (error)
        {
            console.error("Failed to fetch messages:", error);
        } finally {
            setIsLoading(false);
        }
    };
   const handleNewMessage = async (inputText) => {
        if (!user || !userProfile) return;
        setIsLoading(true);
        const tempMessageId = Date.now();
        const currentChatId = activeChatId;

        setMessages(prev => [...prev, { id: tempMessageId, user: inputText }]);
    
        try {
            const response = await axios.post(`${API_URL}/api/predict`, {
                userId: user.uid,
                newsText: inputText,
                chatId: currentChatId
            });
            const { result, chatId: newChatId } = response.data;
    
            setMessages(prev => prev.map(msg => 
                msg.id === tempMessageId ? { ...msg, ai: result } : msg
            ));

            if (!currentChatId) {
                setActiveChatId(newChatId);
                fetchChatList(user.uid); 
            }
            fetchUserProfile(user.uid);
    
        } catch (error) {
            console.error("Analysis error:", error);
            
            // This now reads the specific error message from the server response
            let errorMessage = 'An error occurred during analysis.';
            if (error.response && error.response.data && error.response.data.error) {
                errorMessage = error.response.data.error;
            } else if (error.message) {
                errorMessage = error.message;
            }

            const errorResult = { 
                classification: { label: 'Error', score: errorMessage },
                sourceAnalysis: null
            };

            setMessages(prev => prev.map(msg => 
                msg.id === tempMessageId ? { ...msg, ai: errorResult } : msg
            ));
        } finally {
            setIsLoading(false);
        }
    };
    

    const handleNewChat = () => {
        setActiveChatId(null);
        setMessages([]);
    };

    const handleSelectChat = (chatId) => {
        setActiveChatId(chatId);
        fetchMessages(chatId);
    };
    
    const handleDeleteChat = async (chatId) => {
        if (!user) return;
        const originalChats = [...chatList];
        setChatList(prev => prev.filter(chat => chat.id !== chatId));
        if (activeChatId === chatId) handleNewChat();
        try {
            await axios.delete(`${API_URL}/api/chats/${user.uid}/${chatId}`);
        } catch (error) {
            console.error("Failed to delete chat:", error);
            setChatList(originalChats); // Revert on failure
        }
    };

  const handleRenameChat = async (chatId, newTitle) => {
        if (!user || !newTitle.trim()) return;
        const originalTitle = chatList.find(c => c.id === chatId)?.title;
        setChatList(prev => prev.map(chat => chat.id === chatId ? { ...chat, title: newTitle } : chat));
        try {
            // CORRECTED: Changed API_G_URL to API_URL
            await axios.put(`${API_URL}/api/chats/${user.uid}/${chatId}`, { title: newTitle });
        } catch (error) {
            console.error("Failed to rename chat:", error);
            setChatList(prev => prev.map(chat => chat.id === chatId ? { ...chat, title: originalTitle } : chat));
        }
    };

    const handleLogout = () => signOut(auth);

    const handleDeleteAllHistory = async () => {
        if (!user) return;
        try {
            await axios.delete(`${API_URL}/api/chats/${user.uid}`);
            setChatList([]);
            handleNewChat();
        } catch (error) {
            console.error("Failed to delete all history:", error);
        }
    };
    
    if (loadingAuth) {
        return (
            <div className="flex items-center justify-center h-screen bg-background text-primary">
                <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <Router>
            <div className="h-screen font-sans bg-background text-foreground">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={!user ? <Login /> : <Navigate to="/app" />} />
                    <Route
                        path="/app"
                        element={
                            user ? (
                                <div className="flex h-full">
                                    <Sidebar 
                                        user={user} 
                                        userProfile={userProfile}
                                        chatList={chatList}
                                        activeChatId={activeChatId}
                                        onNewChat={handleNewChat} 
                                        onSelectChat={handleSelectChat}
                                        onDeleteChat={handleDeleteChat}
                                        onRenameChat={handleRenameChat}
                                        isOpen={isSidebarOpen}
                                        setIsOpen={setIsSidebarOpen}
                                        theme={theme}
                                        setTheme={setTheme}
                                        onLogout={handleLogout}
                                        onDeleteAllHistory={handleDeleteAllHistory}
                                    />
                                    <main className="flex-1 flex flex-col relative transition-all duration-500 ease-in-out">
                                        <ChatView 
                                            messages={messages} 
                                            onNewMessage={handleNewMessage}
                                            isLoading={isLoading}
                                            isSidebarOpen={isSidebarOpen}
                                            setIsSidebarOpen={setIsSidebarOpen}
                                        />
                                    </main>
                                </div>
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;