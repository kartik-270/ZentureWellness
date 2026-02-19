import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, RotateCcw, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiConfig } from "@/lib/config";

interface Message {
    text: string;
    isUser: boolean;
    followUps?: string[];
}

const AiChatBubble: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const getToken = () => localStorage.getItem('authToken') || localStorage.getItem('jwt_access_token');

    const handleSendMessage = async (messageToSend: string) => {
        if (!messageToSend.trim()) return;

        setMessages(prev => [...prev, { text: messageToSend, isUser: true }]);
        setInputValue('');
        setIsTyping(true);

        try {
            const token = getToken();
            const response = await fetch(`${apiConfig.baseUrl}/chatbot`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                },
                body: JSON.stringify({
                    message: messageToSend,
                    conversation_id: conversationId,
                }),
            });

            const data = await response.json();

            if (data.conversation_id && !conversationId) {
                setConversationId(data.conversation_id);
            }

            setMessages(prev => [...prev, {
                text: data.response,
                isUser: false,
                followUps: data.followUps,
            }]);

            if (messages.length > 5 && !feedbackSubmitted) {
                setShowFeedback(true);
            }
        } catch (error) {
            console.error("Error fetching chatbot response:", error);
            setMessages(prev => [...prev, {
                text: "I'm having trouble connecting. Ensure the backend is running and models are trained.",
                isUser: false,
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleFeedback = async (score: number) => {
        try {
            const token = getToken();
            await fetch(`${apiConfig.baseUrl}/chatbot/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    conversation_id: conversationId,
                    score: score,
                }),
            });
            setFeedbackSubmitted(true);
            setShowFeedback(false);
        } catch (error) {
            console.error("Error submitting feedback:", error);
        }
    };

    const handleEndSession = async () => {
        if (conversationId) {
            try {
                const token = getToken();
                await fetch(`${apiConfig.baseUrl}/chatbot/session/end`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ conversation_id: conversationId }),
                });
            } catch (error) {
                console.error("Error ending session:", error);
            }
        }
        setMessages([]);
        setConversationId(null);
        setShowFeedback(false);
        setFeedbackSubmitted(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-4 w-[380px] h-[550px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between text-white shadow-md">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">
                                    A
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Zenture AI</h3>
                                    <p className="text-[10px] text-blue-100 uppercase tracking-wider font-medium">Local Assisted Support</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={handleEndSession} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Reload Conversation">
                                    <RotateCcw size={18} />
                                </button>
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                            {messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                                        <MessageCircle size={32} />
                                    </div>
                                    <h4 className="font-bold text-gray-800 mb-2">Welcome!</h4>
                                    <p className="text-sm text-gray-500">I am your local AI assistant. How are you feeling today?</p>
                                </div>
                            )}

                            {messages.map((msg, i) => (
                                <div key={i} className={`flex flex-col ${msg.isUser ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${msg.isUser
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                                        }`}>
                                        {msg.text}
                                    </div>
                                    {!msg.isUser && msg.followUps && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {msg.followUps.map((q, j) => (
                                                <button
                                                    key={j}
                                                    onClick={() => handleSendMessage(q)}
                                                    className="px-3 py-1.5 bg-white border border-blue-200 text-blue-600 rounded-full text-xs hover:bg-blue-50 transition-colors"
                                                >
                                                    {q}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Loader2 className="animate-spin" size={16} />
                                    <span className="text-xs italic">AI is thinking...</span>
                                </div>
                            )}

                            {showFeedback && (
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center animate-in fade-in slide-in-from-bottom-2">
                                    <p className="text-xs text-blue-800 font-bold mb-3">Did this conversation help you?</p>
                                    <div className="flex justify-center gap-3">
                                        <button onClick={() => handleFeedback(1)} className="px-3 py-1.5 bg-green-500 text-white rounded-md text-xs font-bold hover:bg-green-600">Yes</button>
                                        <button onClick={() => handleFeedback(0)} className="px-3 py-1.5 bg-red-400 text-white rounded-md text-xs font-bold hover:bg-red-500">No</button>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-gray-100 bg-white">
                            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                                    placeholder="Type a message..."
                                    className="bg-transparent flex-grow outline-none text-sm py-1"
                                />
                                <button
                                    onClick={() => handleSendMessage(inputValue)}
                                    disabled={!inputValue.trim() || isTyping}
                                    className="text-blue-600 disabled:text-gray-400 transition-colors"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                            <div className="text-[9px] text-center text-gray-400 mt-2 font-medium uppercase tracking-tighter">
                                powered by local mental health ai
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bubble Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full shadow-lg flex items-center justify-center text-white ring-4 ring-white"
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
            </motion.button>
        </div>
    );
};

export default AiChatBubble;
