import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, RotateCcw, Send, Loader2, Mic, MicOff, Volume2, VolumeX, Calendar } from 'lucide-react';
import { useLocation } from "wouter";
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
    const [bubbleBottom, setBubbleBottom] = useState(24); // default bottom-6 (24px)
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(false);
    const [, setLocation] = useLocation();

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        const handleScroll = () => {
            const footer = document.getElementById('main-footer');
            if (!footer) return;

            const footerRect = footer.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // If footer is visible
            if (footerRect.top < viewportHeight) {
                const overlap = viewportHeight - footerRect.top;
                setBubbleBottom(overlap + 24); // Maintain 24px spacing from footer top
            } else {
                setBubbleBottom(24);
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const getToken = () => localStorage.getItem('authToken') || localStorage.getItem('jwt_access_token');

    const handleSendMessage = async (messageToSend: string) => {
        if (!messageToSend.trim()) return;

        if (messageToSend === "Book a Counselor Session") {
            setLocation('/book-appointment');
            setIsOpen(false);
            return;
        }

        setMessages(prev => [...prev, { text: messageToSend, isUser: true }]);
        setInputValue('');
        setIsTyping(true);

        // Add a placeholder for the bot response
        setMessages(prev => [...prev, { text: '', isUser: false }]);

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

            if (!response.body) throw new Error('No response body');
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let botText = '';
            let partialLine = '';

            setIsTyping(false); // Hide loader once tokens start arriving

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = (partialLine + chunk).split('\n');
                partialLine = lines.pop() || ''; // Keep the last incomplete line

                for (const line of lines) {
                    if (line.trim().startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.trim().slice(6));
                            if (data.chunk) {
                                botText += data.chunk;
                                // Update the last message (placeholder) with the new text
                                setMessages(prev => {
                                    const newMessages = [...prev];
                                    const lastMsg = newMessages[newMessages.length - 1];
                                    if (lastMsg && !lastMsg.isUser) {
                                        lastMsg.text = botText;
                                    }
                                    return newMessages;
                                });
                            } else if (data.final) {
                                if (data.conversation_id && !conversationId) {
                                    setConversationId(data.conversation_id);
                                }
                                // Add follow-ups and final full response if needed
                                setMessages(prev => {
                                    const newMessages = [...prev];
                                    const lastMsg = newMessages[newMessages.length - 1];
                                    if (lastMsg && !lastMsg.isUser) {
                                        lastMsg.followUps = data.followUps;
                                        lastMsg.text = data.full_response;
                                    }
                                    return newMessages;
                                });

                                if (voiceEnabled) {
                                    speak(data.full_response);
                                }
                            }
                        } catch (e) {
                            console.error("Error parsing stream chunk:", e);
                        }
                    }
                }
            }

            if (messages.length > 5 && !feedbackSubmitted) {
                setShowFeedback(true);
            }
        } catch (error) {
            console.error("Error fetching chatbot response:", error);
            setMessages(prev => {
                const newMessages = [...prev];
                // Remove the empty placeholder if error
                if (newMessages.length > 0 && newMessages[newMessages.length - 1].text === '') {
                    newMessages.pop();
                }
                return [...newMessages, {
                    text: "I'm having trouble connecting. Ensure the backend is running and models are trained.",
                    isUser: false,
                }];
            });
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

    const startListening = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US'; // Default, but models are multilingual

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
        };
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInputValue(prev => prev + (prev ? ' ' : '') + transcript);
        };

        recognition.start();
    };

    const speak = (text: string) => {
        if (!voiceEnabled) return;

        // Strip emojis from text before speaking
        const strippedText = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');

        const utterance = new SpeechSynthesisUtterance(strippedText);

        // Find a smooth female voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v =>
            v.name.includes('Google UK English Female') ||
            v.name.includes('Microsoft Zira') ||
            (v.name.includes('Female') && v.lang.startsWith('en')) ||
            v.name.includes('Samantha')
        ) || voices[0];

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.rate = 1.0;
        utterance.pitch = 1.1; // Slightly higher for a helpful/friendly tone

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="fixed right-6 z-[9999] flex flex-col items-end" style={{ bottom: `${bubbleBottom}px` }}>
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
                                <button
                                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                                    className={`p-2 rounded-full transition-colors ${voiceEnabled ? 'bg-white/20' : 'hover:bg-white/10'}`}
                                    title={voiceEnabled ? "Voice Response On" : "Voice Response Off"}
                                >
                                    {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                                </button>
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
                                                    className="px-3 py-1.5 bg-white border border-blue-200 text-blue-600 rounded-full text-xs text-left hover:bg-blue-50 transition-colors"
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
                                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-center animate-in fade-in slide-in-from-bottom-2 mx-auto max-w-[80%]">
                                    <p className="text-[10px] text-blue-800 font-bold mb-2">Did this conversation help you?</p>
                                    <div className="flex justify-center gap-3">
                                        <button onClick={() => handleFeedback(1)} className="px-2 py-1 bg-green-500 text-white rounded-md text-[10px] font-bold hover:bg-green-600 transition-colors">Yes</button>
                                        <button onClick={() => handleFeedback(0)} className="px-2 py-1 bg-red-400 text-white rounded-md text-[10px] font-bold hover:bg-red-500 transition-colors">No</button>
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
                                    onClick={startListening}
                                    className={`transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-blue-600'}`}
                                    title="Voice Typing"
                                >
                                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                                </button>
                                <button
                                    onClick={() => setLocation('/book-appointment')}
                                    className="text-gray-400 hover:text-blue-600 transition-colors"
                                    title="Book Counseling Session"
                                >
                                    <Calendar size={20} />
                                </button>
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
                className="w-14 h-14 bg-gradient-to-tr from-blue-500 to-cyan-300 rounded-full shadow-lg flex items-center justify-center text-white ring-4 ring-white"
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
            </motion.button>
        </div >
    );
};

export default AiChatBubble;
