"use client";

import Script from "next/script";
import { useEffect, JSX } from "react";

// 1. Define the type for the Botpress configuration object
interface BotpressConfig {
  botId: string;
  clientId: string;
  configuration: {
    version: string;
    botName: string;
    botDescription: string;
    website?: Record<string, unknown>;
    email?: Record<string, unknown>;
    phone?: Record<string, unknown>;
    termsOfService?: Record<string, unknown>;
    privacyPolicy?: Record<string, unknown>;
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

// 2. Augment the global Window interface to include `botpressWebChat`
declare global {
  interface Window {
    botpress: {
      init: (config: BotpressConfig) => void;
    };
  }
}

const BotpressChatbot = (): JSX.Element => {
  useEffect(() => {
    const initializeBotpress = () => {
      if (window.botpress) {
        // 3. The configuration object is now type-checked
        const config: BotpressConfig = {
          botId: "7ae5719e-66ae-4d89-af5c-72d5b43e2aac",
          clientId: "0c96ddf8-22ce-42ef-8119-0a01b6731e51",
          configuration: {
            version: "v2",
            botName: "AI Assistant",
            botDescription:
              "I am here to assist you with your custom requests and provide helpful information.",
            website: {},
            email: {},
            phone: {},
            termsOfService: {},
            privacyPolicy: {},
            color: "#3276EA",
            variant: "solid",
            headerVariant: "solid",
            themeMode: "light",
            fontFamily: "Lexend",
            radius: 4,
            feedbackEnabled: true,
            footer: "[⚡ by Botpress](https://botpress.com/?from=webchat)",
            additionalStylesheetUrl:
              "https://files.bpcontent.cloud/2025/09/06/14/20250906140350-435CT55V.css",
          },
        };
        window.botpress.init(config);
      }
    };

    const script = document.getElementById(
      "botpress-webchat-script"
    ) as HTMLScriptElement;
    if (script) {
      script.addEventListener("load", initializeBotpress);
    }

    return () => {
      if (script) {
        script.removeEventListener("load", initializeBotpress);
      }
    };
  }, []);

  return (
  <>
    <Script
      id="botpress-webchat-inject"
      src="https://cdn.botpress.cloud/webchat/v3.2/inject.js"
      strategy="afterInteractive"
    />
    <Script
      id="botpress-bot-config"
      src="https://files.bpcontent.cloud/2025/09/06/13/20250906133443-MMLRENL5.js"
      strategy="afterInteractive"
      onLoad={() => {
        // Initialize only after config script loads
        if (window.botpress) {
          window.botpress.init({
            botId: "7ae5719e-66ae-4d89-af5c-72d5b43e2aac",
            clientId: "0c96ddf8-22ce-42ef-8119-0a01b6731e51",
            configuration: {
              version: "v2",
              botName: "AI Assistant",
              botDescription:
                "I am here to help you.",
              website: {},
              email: {},
              phone: {},
              termsOfService: {},
              privacyPolicy: {},
              color: "#3276EA",
              variant: "solid",
              headerVariant: "solid",
              themeMode: "light",
              fontFamily: "Lexend",
              radius: 4,
              feedbackEnabled: true,
              footer: "[⚡ by Botpress](https://botpress.com/?from=webchat)",
              additionalStylesheetUrl:
                "https://files.bpcontent.cloud/2025/09/06/14/20250906140350-435CT55V.css",
            },
          });
        }
      }}
    />
  </>
);

};

export default BotpressChatbot;
