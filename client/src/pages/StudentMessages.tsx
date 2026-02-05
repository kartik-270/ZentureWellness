import { useState, useEffect, useRef } from 'react';
import { apiConfig } from "@/lib/config";
import Navbar from "@/components/navbar";
import { Send, Search, User, Clock, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface User {
    id: number;
    username: string;
    role: string;
}

interface Message {
    id: number;
    sender: string;
    content: string;
    timestamp: string;
    is_read: boolean;
    is_sender: boolean;
}

export default function StudentMessages() {
    const [conversations, setConversations] = useState<any[]>([]);
    const [activeChat, setActiveChat] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (activeChat) {
            fetchMessages(activeChat.id);
            const interval = setInterval(() => fetchMessages(activeChat.id), 3000); // Poll for new messages
            return () => clearInterval(interval);
        }
    }, [activeChat]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchConversations = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch(`${apiConfig.baseUrl}/api/messages/conversations`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setConversations(data);
            }
        } catch (err) {
            console.error("Failed to fetch conversations", err);
        }
    };

    const fetchMessages = async (userId: number) => {
        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch(`${apiConfig.baseUrl}/api/messages/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
                // Mark read (optional here, or call separate endpoint)
            }
        } catch (err) {
            console.error("Failed to fetch messages", err);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !activeChat) return;

        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch(`${apiConfig.baseUrl}/api/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    receiver_id: activeChat.id,
                    content: newMessage
                })
            });

            if (res.ok) {
                setNewMessage("");
                fetchMessages(activeChat.id);
                fetchConversations(); // Update last message snippet
            } else {
                toast({ title: "Failed to send", variant: "destructive" });
            }
        } catch (err) {
            console.error("Error sending message", err);
        }
    };

    const filteredConversations = conversations.filter(c =>
        c.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-1 flex max-w-6xl mx-auto w-full p-4 gap-4 h-[calc(100vh-80px)]">

                {/* Sidebar - Conversations */}
                <div className="w-1/3 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                    <div className="p-4 border-b">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Messages</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {filteredConversations.map((c: any) => (
                            <div
                                key={c.user.id}
                                onClick={() => setActiveChat({ id: c.user.id, username: c.user.name, role: c.user.role })}
                                className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${activeChat?.id === c.user.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                            {c.user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{c.user.name}</h3>
                                            <p className="text-sm text-gray-500 truncate max-w-[140px]">{c.last_message || "No messages yet"}</p>
                                        </div>
                                    </div>
                                    {c.unread_count > 0 && (
                                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{c.unread_count}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                        {conversations.length === 0 && (
                            <div className="p-8 text-center text-gray-500">
                                No conversations yet. Book a session to start chatting!
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                    {activeChat ? (
                        <>
                            <div className="p-4 border-b flex justify-between items-center bg-gray-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                                        {activeChat.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">{activeChat.username}</h3>
                                        <span className="text-xs text-gray-500 capitalize">{activeChat.role}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.is_sender ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] p-3 rounded-2xl ${msg.is_sender ? 'bg-blue-600 text-white rounded-rt-none' : 'bg-white border border-gray-200 text-gray-800 rounded-lt-none'}`}>
                                            <p>{msg.content}</p>
                                            <div className={`text-xs mt-1 flex items-center gap-1 ${msg.is_sender ? 'text-blue-100' : 'text-gray-400'}`}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                {msg.is_sender && (
                                                    msg.is_read ? <CheckCircle size={12} /> : <Clock size={12} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="p-4 border-t bg-white">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Type a message..."
                                        className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                    />
                                    <button
                                        onClick={sendMessage}
                                        className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <User size={32} />
                            </div>
                            <p>Select a counselor to start messaging</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

