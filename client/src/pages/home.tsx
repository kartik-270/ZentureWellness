// app/page.js

"use client"; // <-- Add this at the top

import { useState, useEffect } from 'react';
import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import QuickLinks from "@/components/quick-links";
import PlatformFeatures from "@/components/platform-features";
import Footer from "@/components/footer";
import BotpressChatbot from '@/components/botpress-chatbot'; // <-- Import the new component

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    // Handler to set state to true when chat opens
    const handleChatOpened = () => {
      console.log("Botpress chat opened");
      setIsChatOpen(true);
    };

    // Handler to set state to false when chat closes
    const handleChatClosed = () => {
      console.log("Botpress chat closed");
      setIsChatOpen(false);
    };

    // Add event listeners to the window object
    window.addEventListener('bp-web-chat-opened', handleChatOpened);
    window.addEventListener('bp-web-chat-closed', handleChatClosed);

    // Cleanup function to remove event listeners
    return () => {
      window.removeEventListener('bp-web-chat-opened', handleChatOpened);
      window.removeEventListener('bp-web-chat-closed', handleChatClosed);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      
      {/* --- The Background Overlay --- */}
      {/* This div will appear only when isChatOpen is true */}
      {isChatOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          aria-hidden="true"
        />
      )}

      {/* --- Your Page Content --- */}
      {/* The main content remains the same */}
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <QuickLinks />
        <PlatformFeatures />
        <Footer />
      </div>

      {/* --- The Botpress Chatbot Component --- */}
      {/* This component will inject the Botpress script */}
      <BotpressChatbot />
    </div>
  );
}