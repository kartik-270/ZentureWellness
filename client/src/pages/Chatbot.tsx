import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { apiConfig } from "@/lib/config";

// Define the types for a message
interface Message {
  text: string;
  isUser: boolean;
  followUps?: string[];
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Function to get the JWT token from storage
  const getToken = () => {
    return localStorage.getItem('authToken');
  };

  const handleSendMessage = async (messageToSend: string) => {
    if (messageToSend.trim()) {
      setMessages(prevMessages => [...prevMessages, { text: messageToSend, isUser: true }]);
      setInputValue('');
      setIsTyping(true);

      try {
        const token = getToken();
        const headers = {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        };

        const response = await fetch(`${apiConfig.baseUrl}/chatbot`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            message: messageToSend,
            conversation_id: conversationId,
          }),
        });

        const data = await response.json();

        if (data.conversation_id && !conversationId) {
          setConversationId(data.conversation_id);
        }

        setMessages(prevMessages => [...prevMessages, {
          text: data.response,
          isUser: false,
          followUps: data.followUps,
        }]);

        // Show feedback after 5 messages
        if (messages.length > 5 && !feedbackSubmitted) {
          setShowFeedback(true);
        }
      } catch (error) {
        console.error("Error fetching chatbot response:", error);
        setMessages(prevMessages => [...prevMessages, {
          text: "Sorry, I'm having trouble connecting right now. Please try again later.",
          isUser: false,
        }]);
      } finally {
        setIsTyping(false);
      }
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
    handleStartNewChat();
  };

  const handleStartNewChat = () => {
    setMessages([]);
    setConversationId(null);
    setShowFeedback(false);
    setFeedbackSubmitted(false);
  };

  return (
    <div className="flex flex-col w-full max-w-md h-[600px] mx-auto rounded-xl shadow-2xl bg-white overflow-hidden relative">
      {/* Header with new chat button */}
      <div className="flex items-center px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-sm mr-3">
          A
        </div>
        <div className="flex-grow flex flex-col">
          <span className="font-bold text-gray-800">AI Assistant</span>
          <span className="text-xs text-gray-500">How are you feeling today?</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleEndSession}
            title="Start new chat"
            className="text-gray-500 text-lg hover:text-gray-800 transition-colors"
          >
            ↻
          </button>
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-grow flex flex-col p-4 space-y-3 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="flex flex-col">
            <div
              className={`p-3 rounded-xl max-w-[80%] break-words ${msg.isUser
                ? 'self-end bg-blue-500 text-white rounded-br-none'
                : 'self-start bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
            >
              {msg.text}
            </div>
            {!msg.isUser && msg.followUps && (
              <div className="self-start mt-2 flex flex-col space-y-2">
                {msg.followUps.map((question, qIndex) => (
                  <button
                    key={qIndex}
                    onClick={() => handleSendMessage(question)}
                    className="p-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {showFeedback && (
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-4 text-center">
            <p className="text-sm text-blue-800 font-medium mb-2">Did this conversation help you feel better?</p>
            <div className="flex justify-center space-x-4">
              <button onClick={() => handleFeedback(1)} className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors">Yes</button>
              <button onClick={() => handleFeedback(0.5)} className="px-3 py-1 bg-gray-400 text-white rounded-lg text-sm hover:bg-gray-500 transition-colors">Neutral</button>
              <button onClick={() => handleFeedback(0)} className="px-3 py-1 bg-red-400 text-white rounded-lg text-sm hover:bg-red-500 transition-colors">No</button>
            </div>
          </div>
        )}

        {isTyping && (
          <div className="self-start bg-gray-200 text-gray-800 rounded-xl p-3 max-w-[80%] rounded-bl-none">
            ...
          </div>
        )}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-4xl mb-3">
              A
            </div>
            <span className="font-bold text-xl text-gray-800 mb-1">AI Assistant</span>
            <span className="text-sm text-gray-500">Your safe space for sharing and support.</span>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="flex items-center px-4 py-3 border-t border-gray-200 bg-gray-50">
        <input
          type="text"
          className="flex-grow border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSendMessage(inputValue);
          }}
          disabled={isTyping}
        />
        <button
          onClick={() => handleSendMessage(inputValue)}
          className={`flex-shrink-0 w-10 h-10 flex items-center justify-center ml-2 text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${isTyping ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
          disabled={isTyping}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-send"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </div>

      <div className="text-center py-2 text-xs text-gray-400">
        <span>[ ⚡️ by Zenture ]</span>
      </div>
    </div>
  );
};

export default Chatbot;
