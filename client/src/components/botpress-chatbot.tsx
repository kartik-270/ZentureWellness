"use client";

import Script from "next/script";
import { useEffect, JSX } from "react";

// 1. Define the props for the component, allowing it to accept the auth token.
interface BotpressChatbotProps {
  authToken: string | null; // The token is a string, or null if the user is not logged in.
}

// 2. Define the TypeScript type for the Botpress configuration object.
//    This includes the optional 'user' payload where we will place the JWT.
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
  };
}

// 3. Augment the global Window interface to make TypeScript aware of `window.botpress` and the new `window.botpressWebChat`.
declare global {
  interface Window {
    botpress: {
      init: (config: BotpressConfig) => void;
    };
    // Define a type for the exposed function
    showBotpressChat: () => void;
  }
}

const BotpressChatbot = ({ authToken }: BotpressChatbotProps): JSX.Element => {
  useEffect(() => {
    const initializeBotpress = () => {
      if (window.botpress) {
        const config: BotpressConfig = {
          botId: "7ae5719e-66ae-4d89-af5c-72d5b43e2aac", // Your Bot ID
          clientId: "0c96ddf8-22ce-42ef-8119-0a01b6731e51", // Your Client ID
          configuration: {
            version: "v2",
            botName: "AI Assistant",
            botDescription:
              "I am here to assist you and provide helpful information.",
            color: "#3276EA",
            variant: "solid",
            headerVariant: "solid",
            themeMode: "light",
            fontFamily: "Lexend",
            radius: 4,
            feedbackEnabled: true,
            footer: "[⚡ by Zenture]",
            additionalStylesheetUrl:
              "https://files.bpcontent.cloud/2025/09/06/14/20250906140350-435CT55V.css",
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
    
    // ⚠️ CRITICAL CHANGE: Expose a function to show the chat
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