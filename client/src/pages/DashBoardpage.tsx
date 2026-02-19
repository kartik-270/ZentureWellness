"use client";

import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { Link } from "wouter";

import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import DailyCheckIn from "@/components/dailycheckin";
import WellnessJourney from "@/components/WellnessJourney";
import RecommendedForYou from "@/components/RecommendedForYou";
import ConnectAndShare from "@/components/ConnectAndShare";
import AiChatFab from "@/components/AiChatFab.tsx";
import AiChatBubble from "@/components/AiChatBubble";
// import BotpressChatbot from "@/components/botpress-chatbot";
import Footer from "@/components/footer";
import UpcomingStudentAppointments from "@/components/UpcomingStudentAppointments";
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
          <UpcomingStudentAppointments />

          {/* Quick Access to Messages */}
          <div className="w-full max-w-4xl px-4 mb-8">
            <Link href="/messages">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-border flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">My Messages</h3>
                    <p className="text-muted-foreground text-sm">Chat with your counselors</p>
                  </div>
                </div>
                <span className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium text-sm">Open Chat</span>
              </div>
            </Link>
          </div>

          <DailyCheckIn />
          <WellnessJourney />
          <RecommendedForYou />
          <ConnectAndShare />
        </div>
      </main>

      {/* <AiChatFab onClick={handleChatFabClick} /> */}


      {/* Replaced Botpress with local AI Chat Bubble */}
      <AiChatBubble />
      {/* <BotpressChatbot authToken={authToken} /> */}
      <Footer />
    </>
  );
}

