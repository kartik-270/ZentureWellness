// home.tsx
"use client";

import { useState, useEffect } from 'react';
import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import QuickLinks from "@/components/quick-links";
import PlatformFeatures from "@/components/platform-features";
import Footer from "@/components/footer";
import BotpressChatbot from '@/components/botpress-chatbot';

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
      // CRITICAL: Delay the state update to ensure the blur overlay appears after the chat
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

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* This is the main change. We're applying a larger, more prominent blur overlay
        when the chat is open. The `fixed inset-0` ensures it covers the entire viewport.
      */}
      {isChatOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          aria-hidden="true"
        />
      )}
      
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <QuickLinks onChatTrigger={handleChatTrigger} />
        <PlatformFeatures />
        <Footer />
      </div>
      
      {/* The BotpressChatbot component now needs to be styled to show up on a larger portion
        of the screen. We achieve this by modifying the CSS that Botpress applies.
        However, the most direct way to control its position and size is often
        through custom CSS. Since we can't directly modify the Botpress component's
        internal styles, the best approach is to let its default behavior handle
        the positioning while we just control the overlay. 
      */}
      <BotpressChatbot authToken={authToken} />
    </div>
  );
}