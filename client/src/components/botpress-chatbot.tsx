"use client";

import Script from "next/script";
import { useEffect, JSX } from "react";

// 1. Define the props for the component, allowing it to accept the auth token.
interface BotpressChatbotProps {
  authToken: string | null; // The token is a string, or null if the user is not logged in.
}

// 2. Define the TypeScript type for the Botpress configuration object.
//    This includes the optional 'user' payload where we will place the JWT.
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

// 3. Augment the global Window interface to make TypeScript aware of `window.botpress`.
declare global {
  interface Window {
    botpress: {
      init: (config: BotpressConfig) => void;
    };
  }
}

// 4. The component now accepts the authToken prop from your page.
const BotpressChatbot = ({
  authToken,
}: BotpressChatbotProps): JSX.Element => {
  useEffect(() => {
    const initializeBotpress = () => {
      if (window.botpress) {
        // 5. The configuration object is now fully type-checked for safety.
        const config: BotpressConfig = {
          botId: "7ae5719e-66ae-4d89-af5c-72d5b43e2aac", // Your Bot ID
          clientId: "0c96ddf8-22ce-42ef-8119-0a01b6731e51", // Your Client ID
          configuration: {
            version: "v2",
            botName: "AI Assistant",
            botDescription:
              "I am here to assist you with your custom requests and provide helpful information.",
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

        // 6. This is the key step: Conditionally add the user's auth token to the payload.
        //    This securely passes the user's identity to the chatbot.
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

    // We must ensure the Botpress script is fully loaded before trying to initialize it.
    const script = document.getElementById(
      "botpress-webchat-inject"
    ) as HTMLScriptElement;
    
    if (script) {
      // A check to see if the script has already loaded to prevent re-initialization.
      if (script.getAttribute('data-loaded')) {
        initializeBotpress();
      } else {
        script.addEventListener("load", initializeBotpress);
        script.setAttribute('data-loaded', 'true');
      }
    }

    // This is a cleanup function that removes the event listener when the component unmounts.
    return () => {
      if (script) {
        script.removeEventListener("load", initializeBotpress);
      }
    };
    // The useEffect hook will re-run if the authToken changes (e.g., when a user logs in or out).
  }, [authToken]); 

  // 7. This component now only needs to render the main Botpress script.
  //    The configuration is handled dynamically in the useEffect hook above.
  return (
    <Script
      id="botpress-webchat-inject"
      src="https://cdn.botpress.cloud/webchat/v3.2/inject.js"
      strategy="afterInteractive"
    />
  );
};

export default BotpressChatbot;

