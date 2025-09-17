"use client";

import Script from "next/script";
import { useEffect, JSX } from "react";

interface BotpressChatbotProps {
  authToken: string | null; // The token is a string, or null if the user is not logged in.
}

interface BotpressConfig {
  botId: string;
  clientId: string;
  user?: {
    payload?: {
      authToken?: string | null;
    };
  };
  configuration: {
    version: string;
    botName: string;
    botDescription: string;
    color: string;
    variant: string;
    headerVariant: string;
    themeMode: string;
    fontFamily: string;
    radius: number;
    feedbackEnabled: boolean;
    footer: string;
    additionalStylesheetUrl?: string;
    startConversation?: boolean;
    soundenabled?: boolean;
  };
}
declare global {
  interface Window {
    botpress: {
      init: (config: BotpressConfig) => void;
    };
    showBotpressChat: () => void;
  }
}

const BotpressChatbot = ({ authToken }: BotpressChatbotProps): JSX.Element => {
  useEffect(() => {
    const initializeBotpress = () => {
      if (window.botpress) {
        const config: BotpressConfig = {
          botId: "35a5203f-5952-4deb-b266-d6f036888765", 
          clientId: "f1d0dea9-6b50-465b-962f-8b5e21b6fa34", 
          configuration: {
            version: "v2",
            botName: "AI Assistant",
            botDescription:
              "I am here to assist you and provide helpful information.",
            color: "#3276EA",
            variant: "solid",
            headerVariant: "glass",
            themeMode: "light",
            fontFamily: "inter",
            radius: 4,
            feedbackEnabled: true,
            footer: "[⚡ by Zenture]",
startConversation:true,
            additionalStylesheetUrl:
              "https://files.bpcontent.cloud/2025/09/06/14/20250906140350-435CT55V.css",
                soundenabled: true,
          },
        };

        if (authToken) {
          config.user = {
            payload: {
              authToken: authToken,
            },
          };
        }

        window.botpress.init(config);
      }
    };

    const script = document.getElementById(
      "botpress-webchat-inject"
    ) as HTMLScriptElement;
    
    if (script) {
      if (script.getAttribute('data-loaded')) {
        initializeBotpress();
      } else {
        script.addEventListener("load", initializeBotpress);
        script.setAttribute('data-loaded', 'true');
      }
    }
    
    window.showBotpressChat = () => {
        const botpressWebChat = (window as any).botpressWebChat;
        if (botpressWebChat && botpressWebChat.sendEvent) {
            botpressWebChat.sendEvent({ type: 'show' });
        } else {
            console.error('Botpress Web Chat is not yet available.');
        }
    };

    return () => {
      if (script) {
        script.removeEventListener("load", initializeBotpress);
      }
    };
  }, [authToken]); 

  return (
    <Script
      id="botpress-webchat-inject"
      src="https://cdn.botpress.cloud/webchat/v3.2/inject.js"
      strategy="afterInteractive"
    />
  );
};
export default BotpressChatbot;
