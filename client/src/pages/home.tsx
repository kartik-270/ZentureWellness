"use client";

import { useState, useEffect } from 'react';
import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import QuickLinks from "@/components/quick-links";
import PlatformFeatures from "@/components/platform-features";
import Footer from "@/components/footer";
import BotpressChatbot from '@/components/botpress-chatbot';

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  // 1. Add state to hold the user's authentication token
  const [authToken, setAuthToken] = useState<string | null>(null);

  // 2. This effect runs once when the component loads to check for a stored token
  useEffect(() => {
    // In your real application, you would set this token in localStorage
    // immediately after the user successfully logs in.
    const storedToken = localStorage.getItem('jwt_access_token'); 
    if (storedToken) {
      setAuthToken(storedToken);
    }
  }, []);


  useEffect(() => {
    const handleChatOpened = () => {
      console.log("Botpress chat opened");
      setIsChatOpen(true);
    };

    const handleChatClosed = () => {
      console.log("Botpress chat closed");
      setIsChatOpen(false);
    };
    
    // NOTE: The event names for Botpress v3 might be different.
    // Check Botpress documentation if these events do not fire.
    window.addEventListener('bp-web-chat-opened', handleChatOpened);
    window.addEventListener('bp-web-chat-closed', handleChatClosed);

    return () => {
      window.removeEventListener('bp-web-chat-opened', handleChatOpened);
      window.removeEventListener('bp-web-chat-closed', handleChatClosed);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      
      {isChatOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          aria-hidden="true"
        />
      )}

      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <QuickLinks />
        <PlatformFeatures />
        <Footer />
      </div>

      {/* 3. Pass the authToken state as a prop to the Botpress component */}
      {/* The chatbot will now have the user's token when it initializes. */}
      <BotpressChatbot authToken={authToken} />
    </div>
  );
}
