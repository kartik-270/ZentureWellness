import { useState, useEffect, useRef } from 'react';
import { apiConfig } from "@/lib/config";
import CounsellorSidebar from '@/components/CounsellorSidebar';
import { Send, User as UserIcon, MoreVertical } from 'lucide-react';

interface Conversation {
    user: { id: number; name: string; role: string };
    last_message: string;
    timestamp: string;
    unread: number;
}

interface Message {
    id: number;
    sender_id: number;
    content: string;
    timestamp: string;
    is_read: boolean;
}

export default function Messages() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>(null); // Conversation.user
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const chatEndRef = useRef<HTMLDivElement>(null);
    const currentUserId = Number(localStorage.getItem("userId") || 0); // Need to store this on login! usually 

    // Mock ID fix - in real app store this in context
    // For now assuming we can get "You" status properly

    useEffect(() => { fetchConversations(); }, []);

    useEffect(() => {
        if (selectedUser) {
            fetchMessages(selectedUser.id);
            const interval = setInterval(() => fetchMessages(selectedUser.id), 5000); // Poll for new messages
            return () => clearInterval(interval);
        }
    }, [selectedUser]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const res = await fetch(`${apiConfig.baseUrl}/messages/conversations`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) setConversations(await res.json());
        } catch (e) { }
    };

    const fetchMessages = async (uid: number) => {
        try {
            const token = localStorage.getItem('authToken');
            const res = await fetch(`${apiConfig.baseUrl}/messages/${uid}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) setMessages(await res.json());
        } catch (e) { }
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || !selectedUser) return;
        try {
            const token = localStorage.getItem('authToken');
            const res = await fetch(`${apiConfig.baseUrl}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    receiver_id: selectedUser.id,
                    content: inputText
                })
            });
            if (res.ok) {
                setInputText("");
                fetchMessages(selectedUser.id);
                fetchConversations(); // Update last message listing
            }
        } catch (e) { }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <CounsellorSidebar />
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-80 bg-white border-r flex flex-col">
                    <div className="p-4 border-b font-bold text-lg">Messages</div>
                    <div className="flex-1 overflow-y-auto">
                        {conversations.map(c => (
                            <div
                                key={c.user.id}
                                onClick={() => setSelectedUser(c.user)}
                                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${selectedUser?.id === c.user.id ? 'bg-blue-50' : ''}`}
                            >
                                <div className="flex justify-between mb-1">
                                    <span className="font-semibold">{c.user.name}</span>
                                    <span className="text-xs text-gray-400">{c.timestamp ? new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                                </div>
                                <div className="text-sm text-gray-500 truncate">{c.last_message}</div>
                                {c.unread > 0 && <span className="inline-block mt-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">{c.unread} new</span>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                {selectedUser ? (
                    <div className="flex-1 flex flex-col bg-gray-100">
                        {/* Header */}
                        <div className="bg-white p-4 border-b flex justify-between items-center shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                    <UserIcon className="text-gray-500" />
                                </div>
                                <h2 className="font-bold">{selectedUser.name}</h2>
                            </div>
                            <button><MoreVertical className="text-gray-400" /></button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map(m => {
                                const isMe = m.sender_id !== selectedUser.id; // Logic depends on knowing my own ID. 
                                // Since I don't have my ID easily without context, I can infer it OR use boolean from backend? 
                                // Actually endpoint returns raw data. 
                                // Simplest: Check if sender_id === selectedUser.id (Incoming) else (Outgoing)
                                const isIncoming = m.sender_id === selectedUser.id;
                                return (
                                    <div key={m.id} className={`flex ${isIncoming ? 'justify-start' : 'justify-end'}`}>
                                        <div className={`max-w-[70%] p-3 rounded-2xl shadow-sm text-sm ${isIncoming ? 'bg-white text-gray-800 rounded-bl-none' : 'bg-blue-600 text-white rounded-br-none'}`}>
                                            {m.content}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={chatEndRef}></div>
                        </div>

                        {/* Input */}
                        <div className="bg-white p-4">
                            <form onSubmit={sendMessage} className="flex gap-2">
                                <input
                                    value={inputText}
                                    onChange={e => setInputText(e.target.value)}
                                    className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 focus:ring-2 ring-blue-500 outline-none"
                                    placeholder="Type a message..."
                                />
                                <button type="submit" className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition">
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50">
                        <p>Select a conversation to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
}
