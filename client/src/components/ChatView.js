import React, { useState, useEffect, useRef } from 'react';

const ChatView = ({ messages, onNewMessage, isLoading, isSidebarOpen, setIsSidebarOpen }) => {
    const [input, setInput] = useState('');
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSend = () => {
        if (input.trim() && !isLoading) {
            onNewMessage(input);
            setInput('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const WelcomeScreen = () => (
        <div className="text-center m-auto max-w-4xl px-4 relative">
            <div className="clarifyt-glow"></div>
            <div className="relative inline-block p-2 mb-6 group z-10">
                <div className="relative z-10 inline-block p-5 bg-card/50 rounded-full ring-1 ring-border">
                    <svg className="w-12 h-12 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
            </div>
            <h1 className="text-5xl font-bold mb-4 text-primary animated-gradient-text z-10 relative">Clarifyt</h1>
            <p className="text-muted-foreground text-lg z-10 relative">The future of news verification. Paste a link or text to begin your analysis.</p>
        </div>
    );

    const ResultCard = ({ result }) => {
        const { classification, sourceAnalysis } = result;
        if (!classification) return null;

        const isFake = classification.label === 'FAKE';
        const isError = classification.label === 'Error';
        const score = isError ? 0 : parseFloat(classification.score) * 100;
        
        let verdictColor, gradientFrom, ringColor;
        if(isError) {
            verdictColor = 'text-yellow-400';
            gradientFrom = 'from-yellow-500/10';
            ringColor = 'ring-yellow-500/30';
        } else if (isFake) {
            verdictColor = 'text-red-400';
            gradientFrom = 'from-red-500/10';
            ringColor = 'ring-red-500/30';
        } else {
            verdictColor = 'text-green-400';
            gradientFrom = 'from-green-500/10';
            ringColor = 'ring-green-500/30';
        }

        return (
            <div className={`mt-4 text-left bg-card/50 backdrop-blur-lg rounded-xl overflow-hidden ring-1 ${ringColor}`}>
                <div className={`p-5 bg-gradient-to-br ${gradientFrom} to-transparent`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`font-bold text-2xl ${verdictColor}`}>{classification.label}</p>
                            <p className="text-sm text-muted-foreground">{isError ? "Analysis Failed" : "Confidence Score"}</p>
                        </div>
                        {!isError && (
                            <div className="relative w-20 h-20">
                                <svg className="w-full h-full" viewBox="0 0 36 36">
                                    <path className="text-accent" strokeWidth="3" fill="none" stroke="currentColor" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    <path className={verdictColor} strokeWidth="3" fill="none" stroke="currentColor" strokeDasharray={`${score}, 100`} strokeLinecap="round" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center text-primary font-semibold text-lg">{Math.round(score)}%</div>
                            </div>
                        )}
                    </div>
                    {isError && <p className="mt-2 text-yellow-200">{classification.score}</p>}
                </div>
                {sourceAnalysis && (
                    <div className="p-5 border-t border-border">
                        <h4 className="font-bold mb-2 text-primary">Source Credibility: {sourceAnalysis.domain}</h4>
                        <p className="text-sm text-muted-foreground">{sourceAnalysis.credibility}</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full flex-grow bg-background text-foreground">
            <div className="flex-grow p-6 overflow-y-auto chat-history-scrollbar">
                <div className="max-w-3xl mx-auto">
                    {!isSidebarOpen && (
                         <button 
                            onClick={() => setIsSidebarOpen(true)} 
                            className="fixed top-4 left-4 z-40 p-2 text-muted-foreground rounded-full hover:bg-accent hover:text-primary transition-colors"
                            title="Open sidebar"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                        </button>
                    )}

                    {messages.length === 0 && !isLoading && <WelcomeScreen />}
                    
                    {messages.map((msg, index) => (
                        <div key={msg.id || index}>
                            {msg.user && (
                                <div className="flex my-6 justify-end">
                                    <div className="px-5 py-3 rounded-2xl bg-blue-600 text-white max-w-xl shadow-lg">
                                        <p className="whitespace-pre-wrap">{msg.user}</p>
                                    </div>
                                </div>
                            )}
                            {msg.ai && (
                                <div className="flex my-6 justify-start">
                                    <div className="flex items-start gap-4 max-w-xl">
                                         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 shadow-lg"></div>
                                        <div className="flex-1">
                                            <ResultCard result={msg.ai} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                         <div className="flex justify-start my-6">
                            <div className="flex items-start gap-4 max-w-xl">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 shadow-lg"></div>
                                <div className="px-5 py-4 rounded-2xl bg-accent">
                                    <div className="flex items-center space-x-2 text-muted-foreground">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
            </div>
            <div className="p-4 bg-background/80 backdrop-blur-sm border-t border-border">
                <div className="relative max-w-3xl mx-auto">
                    <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress}
                        placeholder="Analyze a link or paste text..."
                        className="w-full p-4 pr-16 bg-input border border-border rounded-xl resize-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all shadow-inner"
                        rows="2"
                    />
                    <button onClick={handleSend} disabled={isLoading || !input.trim()}
                        className="absolute bottom-3 right-3 p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:bg-accent disabled:text-muted-foreground disabled:cursor-not-allowed transition-all transform hover:scale-110">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatView;