import { MessageSquare } from "lucide-react";

interface AiChatFabProps {
  onClick: () => void;
}

export default function AiChatFab({ onClick }: AiChatFabProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-blue-700 hover:scale-105 transition-all z-50"
      aria-label="Open AI Chat Assistant"
    >
      <MessageSquare size={28} />
    </button>
  );
}
