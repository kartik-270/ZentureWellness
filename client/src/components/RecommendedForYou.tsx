"use client";

import { useState, useEffect } from "react";
import { Lightbulb, Video, BookOpen, Loader2 } from "lucide-react";
import { apiConfig } from "@/lib/config";

// Define the structure for a recommended resource
interface Resource {
  id: number;
  type: "article" | "video" | "exercise";
  title: string;
  description: string;
  link: string;
}

// Helper function to get an icon based on resource type
const getIcon = (type: Resource['type']) => {
  switch (type) {
    case 'article':
      return <BookOpen className="text-primary" size={24} />;
    case 'video':
      return <Video className="text-primary" size={24} />;
    case 'exercise':
      return <Lightbulb className="text-primary" size={24} />;
    default:
      return <Lightbulb className="text-primary" size={24} />;
  }
};

export default function RecommendedForYou() {
  const [recommendations, setRecommendations] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("User not authenticated");

        // --- API Call ---
        // This is a hypothetical endpoint. You would need to create this on your backend.
        // It would analyze the user's recent mood, journal entries, etc.
        // For now, we simulate a response with placeholder data.
        // const response = await fetch(`${apiConfig.baseUrl}/recommendations`, {
        //     headers: { "Authorization": `Bearer ${token}` }
        // });
        // if (!response.ok) throw new Error("Failed to fetch recommendations");
        // const data: Resource[] = await response.json();

        // Placeholder Data Simulation
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        const placeholderData: Resource[] = [
          { id: 1, type: "exercise", title: "5-Minute Mindfulness Exercise", description: "Clear your mind and reduce stress with this guided session.", link: "/psychoeducational-hub/audio/breathing-exercise" },
          { id: 2, type: "article", title: "Managing Exam Anxiety", description: "Learn effective strategies to stay calm and focused during exams.", link: "/psychoeducational-hub/article/exam-anxiety" },
          { id: 3, type: "video", title: "The Importance of a Sleep Routine", description: "Discover how a consistent sleep schedule can boost your mental health.", link: "/psychoeducational-hub/video/sleep-routine" },
        ];

        setRecommendations(placeholderData);

      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <h2 className="text-3xl font-bold text-foreground mb-8">Recommended For You ✨</h2>
      <div className="bg-card gradient-bg border border-border rounded-2xl p-6 shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center h-48"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((item) => (
              <a
                key={item.id}
                href={item.link}
                className="block bg-background/50 p-6 rounded-xl border border-border/50 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center transition-colors group-hover:bg-primary/20">
                    {getIcon(item.type)}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}