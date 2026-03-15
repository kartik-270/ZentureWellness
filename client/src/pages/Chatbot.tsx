import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';
import { apiConfig } from "@/lib/config";
import { Volume2, VolumeX, Calendar, RotateCcw, Send, Loader2, Camera, UserCircle } from 'lucide-react';
import Webcam from 'react-webcam';
import { useLocation } from "wouter";

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
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Function to get the JWT token from storage
  const getToken = () => {
    return localStorage.getItem('authToken');
  };

  const speak = (text: string) => {
    if (!voiceEnabled) return;
    window.speechSynthesis.cancel();
    const strippedText = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
    const utterance = new SpeechSynthesisUtterance(strippedText);
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v =>
      v.name.includes('Google UK English Female') ||
      v.name.includes('Microsoft Zira') ||
      (v.name.includes('Female') && v.lang.startsWith('en'))
    ) || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.rate = 1.0;
    utterance.pitch = 1.1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (messageToSend: string) => {
    if (messageToSend.trim()) {
      setMessages(prevMessages => [...prevMessages, { text: messageToSend, isUser: true }]);
      setInputValue('');
      setIsTyping(true);

      // Placeholder for streaming response
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

        setIsTyping(false);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = (partialLine + chunk).split('\n');
          partialLine = lines.pop() || '';

          for (const line of lines) {
            if (line.trim().startsWith('data: ')) {
              try {
                const data = JSON.parse(line.trim().slice(6));
                if (data.chunk) {
                  botText += data.chunk;
                  setMessages(prev => {
                    const next = [...prev];
                    const last = next[next.length - 1];
                    if (last && !last.isUser) last.text = botText;
                    return next;
                  });
                } else if (data.final) {
                  if (data.conversation_id && !conversationId) {
                    setConversationId(data.conversation_id);
                  }
                  setMessages(prev => {
                    const next = [...prev];
                    const last = next[next.length - 1];
                    if (last && !last.isUser) {
                      last.text = data.full_response;
                      last.followUps = data.followUps;
                    }
                    return next;
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
          const next = [...prev];
          if (next.length > 0 && next[next.length - 1].text === '') next.pop();
          return [...next, {
            text: "Sorry, I'm having trouble connecting right now. Please try again later.",
            isUser: false,
          }];
        });
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

  const webcamRef = useRef<Webcam>(null);

  const handleStartNewChat = () => {
    setMessages([]);
    setConversationId(null);
    setShowFeedback(false);
    setFeedbackSubmitted(false);
  };

  const handleFacialScan = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;
    
    setIsScanning(true);
    try {
      const token = getToken();
      // Route through the backend — it proxies to the inference server and handles DB logging
      const res = await fetch(`${apiConfig.baseUrl}/chatbot/facial-analysis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ image: imageSrc })
      });
      const data = await res.json();
      
      if (res.ok) {
        setDetectedEmotion(data.emotion);
        
        setMessages(prev => [...prev, { 
          text: `[Facial Analysis: Detected emotion is "${data.emotion}" with stress level ${data.stress_level}/10. Sharing this with the AI for context.]`, 
          isUser: true 
        }]);
        
        // Auto-message the bot with the emotion as natural language context
        handleSendMessage(`I'm feeling a bit like the emotion you detected (${data.emotion}). Can you help me process this?`);
      } else {
        console.error("Facial analysis failed:", data.error);
      }
    } catch (e) {
      console.error("Facial analysis error:", e);
    } finally {
      setIsScanning(false);
      setShowWebcam(false);
    }
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
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`p-2 rounded-full transition-colors ${voiceEnabled ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
            title={voiceEnabled ? "Voice Response On" : "Voice Response Off"}
          >
            {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <button
            onClick={handleEndSession}
            title="Start new chat"
            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
          >
            <RotateCcw size={20} />
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
          <div className="self-start flex items-center gap-2 text-gray-400 bg-gray-100 p-3 rounded-xl rounded-bl-none">
            <Loader2 className="animate-spin" size={16} />
            <span className="text-xs italic">Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
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
          onClick={() => setShowWebcam(!showWebcam)}
          className={`flex-shrink-0 w-10 h-10 flex items-center justify-center ml-2 transition-colors focus:outline-none ${showWebcam ? 'text-blue-500' : 'text-gray-400 hover:text-blue-600'}`}
          title="Facial Expression Analysis"
        >
          <Camera size={24} />
        </button>
        <button
          onClick={() => setLocation('/book-appointment')}
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center ml-2 text-gray-400 hover:text-blue-600 transition-colors focus:outline-none"
          title="Book Counseling Session"
        >
          <Calendar size={24} />
        </button>
        <button
          onClick={() => handleSendMessage(inputValue)}
          className={`flex-shrink-0 w-10 h-10 flex items-center justify-center ml-2 text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${isTyping || !inputValue.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
          disabled={isTyping || !inputValue.trim()}
        >
          <Send size={20} />
        </button>
      </div>

      {showWebcam && (
        <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-6 text-center">
          <div className="relative w-full aspect-square max-w-[280px] rounded-full overflow-hidden border-4 border-blue-500 shadow-2xl">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover"
            />
            {isScanning && (
              <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm flex items-center justify-center">
                <Loader2 className="text-white animate-spin" size={40} />
              </div>
            )}
          </div>
          <p className="text-white text-xs font-black uppercase tracking-widest mt-8 mb-2">Expression Analysis</p>
          <p className="text-white/60 text-[10px] font-medium mb-8 px-8 leading-relaxed">Center your face to allow the AI to detect your emotional state and provide better support.</p>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setShowWebcam(false)}
              className="px-6 py-3 rounded-xl border border-white/20 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleFacialScan}
              disabled={isScanning}
              className="px-8 py-3 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/40 hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              Detect Emotion
            </button>
          </div>
        </div>
      )}

      <div className="text-center py-2 text-xs text-gray-400">
        <span>[ ⚡️ by Zenture ]</span>
      </div>
    </div>
  );
};

export default Chatbot;
