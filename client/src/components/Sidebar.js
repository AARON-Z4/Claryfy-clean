import React, { useState } from 'react';

const SettingsModal = ({ isOpen, onClose, theme, setTheme, onLogout, onDeleteAllHistory }) => {
    const [showConfirm, setShowConfirm] = useState(false);

    if (!isOpen) return null;

    const handleDelete = () => {
        onDeleteAllHistory();
        setShowConfirm(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-card rounded-2xl shadow-2xl w-full max-w-sm p-6 relative" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-primary">Settings</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                        <label className="text-foreground font-medium">Theme</label>
                        <div className="flex items-center bg-background p-1 rounded-full shadow-inner">
                            <button 
                                onClick={() => setTheme('light')} 
                                className={`px-4 py-1 text-sm rounded-full transition-colors ${theme === 'light' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground'}`}
                            >
                                Light
                            </button>
                            <button 
                                onClick={() => setTheme('dark')} 
                                className={`px-4 py-1 text-sm rounded-full transition-colors ${theme === 'dark' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground'}`}
                            >
                                Dark
                            </button>
                        </div>
                    </div>

                    <button 
                        onClick={onLogout} 
                        className="w-full text-left p-3 flex items-center gap-3 rounded-lg hover:bg-accent transition-colors text-foreground"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        <span className="font-medium">Logout</span>
                    </button>

                    {!showConfirm ? (
                        <button 
                            onClick={() => setShowConfirm(true)} 
                            className="w-full text-left p-3 flex items-center gap-3 rounded-lg hover:bg-destructive/10 transition-colors text-destructive"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                           <span className="font-medium">Delete All History</span>
                        </button>
                    ) : (
                        <div className="p-4 bg-destructive/10 rounded-lg text-center">
                            <p className="text-destructive font-semibold mb-4">Are you sure? This cannot be undone.</p>
                            <div className="flex gap-4">
                                <button onClick={() => setShowConfirm(false)} className="flex-1 py-2 rounded-lg bg-secondary hover:bg-accent font-semibold">Cancel</button>
                                <button onClick={handleDelete} className="flex-1 py-2 rounded-lg bg-destructive text-destructive-foreground hover:opacity-90 font-semibold">Delete</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


const Sidebar = ({ user, userProfile, chatList, activeChatId, onNewChat, onSelectChat, onDeleteChat, onRenameChat, isOpen, setIsOpen, theme, setTheme, onLogout, onDeleteAllHistory }) => {
    const [editingChatId, setEditingChatId] = useState(null);
    const [renameValue, setRenameValue] = useState("");
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handleRenameStart = (chat) => {
        setEditingChatId(chat.id);
        setRenameValue(chat.title);
    };

    const handleRenameSubmit = (e) => {
        e.preventDefault();
        if (editingChatId && renameValue.trim()) {
            onRenameChat(editingChatId, renameValue.trim());
        }
        setEditingChatId(null);
    };

    const HistoryItem = ({ chat }) => (
        <div className={`group relative w-full flex items-center rounded-lg transition-colors duration-200 ${activeChatId === chat.id ? 'bg-accent text-primary' : 'hover:bg-accent'}`}>
            {editingChatId === chat.id ? (
                <form onSubmit={handleRenameSubmit} className="flex-grow">
                    <input
                        type="text"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onBlur={handleRenameSubmit}
                        className="w-full bg-transparent text-sm p-2.5 outline-none text-primary"
                        autoFocus
                    />
                </form>
            ) : (
                <>
                    <button onClick={() => onSelectChat(chat.id)} className="w-full text-left text-sm p-2.5 truncate text-muted-foreground group-hover:text-primary transition-colors">
                        {chat.title}
                    </button>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center opacity-0 group-hover:opacity-100 text-muted-foreground transition-opacity">
                        <button onClick={() => handleRenameStart(chat)} className="p-1 hover:text-primary" title="Rename"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" /></svg></button>
                        <button onClick={() => onDeleteChat(chat.id)} className="p-1 hover:text-primary" title="Delete"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                    </div>
                </>
            )}
        </div>
    );

    const usageLimit = userProfile.plan === 'premium' ? 50 : 10;
    const usagePercentage = Math.min((userProfile.usageCount / usageLimit) * 100, 100);

    return (
        <>
            <aside className={`absolute top-0 left-0 h-full bg-card/50 backdrop-blur-xl border-r border-border flex-col transition-transform duration-300 ease-in-out z-30 w-72 ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex`}>
                <div className="p-4 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold tracking-tighter animated-gradient-text">Clarifyt</h1>
                        <button onClick={() => setIsOpen(false)} className="p-2 text-muted-foreground hover:text-primary lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <button onClick={onNewChat} className="w-full flex items-center justify-center gap-2 p-2.5 font-semibold text-sm cta-button">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        <span>New Analysis</span>
                    </button>
                    
                    <div className="flex-grow overflow-y-auto my-4 -mr-2 pr-2 space-y-1 chat-history-scrollbar">
                        <p className="px-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">History</p>
                        {chatList.map((chat) => <HistoryItem key={chat.id} chat={chat} />)}
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-border space-y-4">
                        <div>
                            <div className="flex justify-between items-center text-xs text-muted-foreground px-1 mb-1">
                                <span>Daily Usage</span>
                                <span>{userProfile.usageCount} / {usageLimit}</span>
                            </div>
                            <div className="w-full bg-accent rounded-full h-2.5">
                                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full" style={{ width: `${usagePercentage}%` }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex items-center p-2">
                             <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white flex-shrink-0 text-base">
                                {user?.email?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-grow truncate ml-3">
                                <p className="font-semibold text-sm text-primary">{user?.displayName || user?.email}</p>
                            </div>
                            <button onClick={() => setIsSettingsOpen(true)} title="Settings" className="ml-2 p-2 rounded-full text-muted-foreground hover:bg-accent hover:text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.532 1.532 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.532 1.532 0 01-.947-2.287c1.561-.379-1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
            <SettingsModal 
                isOpen={isSettingsOpen} 
                onClose={() => setIsSettingsOpen(false)}
                theme={theme}
                setTheme={setTheme}
                onLogout={onLogout}
                onDeleteAllHistory={onDeleteAllHistory}
            />
        </>
    );
};

export default Sidebar;