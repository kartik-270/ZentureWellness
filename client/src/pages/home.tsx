// home.tsx
"use client";

import { useState, useEffect } from 'react';
import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import QuickLinks from "@/components/quick-links";
import PlatformFeatures from "@/components/platform-features";
import Footer from "@/components/footer";
import AiChatBubble from '@/components/AiChatBubble';
// import BotpressChatbot from '@/components/botpress-chatbot';

declare global {
  interface Window {
    botpressWebChat: {
      sendEvent: (event: { type: string; payload?: any }) => void;
    };
  }
}

// Augment the global Window interface to include botpressWebChat
declare global {
  interface Window {
    botpressWebChat: {
      sendEvent: (event: { type: string; payload?: any }) => void;
    };
  }
}

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('jwt_access_token');
    if (storedToken) {
      setAuthToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const handleChatOpened = () => {
      console.log("Botpress chat opened");
      setTimeout(() => {
        setIsChatOpen(true);
      }, 50);
    };

    const handleChatClosed = () => {
      console.log("Botpress chat closed");
      setIsChatOpen(false);
    };

    window.addEventListener('bp-web-chat-opened', handleChatOpened);
    window.addEventListener('bp-web-chat-closed', handleChatClosed);

    return () => {
      window.removeEventListener('bp-web-chat-opened', handleChatOpened);
      window.removeEventListener('bp-web-chat-closed', handleChatClosed);
    };
  }, []);

  const handleChatTrigger = () => {
    if (window.botpressWebChat && window.botpressWebChat.sendEvent) {
      window.botpressWebChat.sendEvent({ type: 'toggle' });
    }
  };

  return (<>
    <Navbar />
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {isChatOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          aria-hidden="true"
        />
      )}
      
      <div className="relative z-10">
        <HeroSection />
        <QuickLinks onChatTrigger={handleChatTrigger} />
        <PlatformFeatures />
        <Footer />
      </div>

      {/* Replaced Botpress with local AI Chat Bubble */}
      <AiChatBubble />
      {/* <BotpressChatbot authToken={authToken} /> */}
    </div></>
  );
}