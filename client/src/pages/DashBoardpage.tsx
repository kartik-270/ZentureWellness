"use client";

import { useState, useEffect } from "react";

import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import DailyCheckIn from "@/components/dailycheckin";
import WellnessJourney from "@/components/WellnessJourney";
import RecommendedForYou from "@/components/RecommendedForYou";
import ConnectAndShare from "@/components/ConnectAndShare";
import AiChatFab from "@/components/AiChatFab.tsx";
import BotpressChatbot from "@/components/botpress-chatbot";
import Footer from "@/components/footer";

declare global {
  interface Window {
    showBotpressChat: () => void;
  }
}

export default function DashboardPage() {
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setAuthToken(token);
  }, []);

  const handleChatFabClick = () => {
    if (window.showBotpressChat) {
      window.showBotpressChat();
    } else {
      console.error("Botpress chat function not available.");
    }
  };

  return (
    <>
      <Navbar />

      <main className="py-16 bg-background">
        <div className="flex flex-col items-center gap-y-20">
          <DailyCheckIn />
          <WellnessJourney />
          <RecommendedForYou />
          <ConnectAndShare />
        </div>
      </main>

      {/* <AiChatFab onClick={handleChatFabClick} /> */}

      
      <BotpressChatbot authToken={authToken} />
      <Footer/>
    </>
  );
}

