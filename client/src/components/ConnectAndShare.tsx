"use client";

import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Heart, Calendar } from "lucide-react";

interface Post {
  id: number;
  title: string;
}

export default function ConnectAndShare() {
  const [trendingTopic, setTrendingTopic] = useState<Post | null>(null);

  useEffect(() => {
    const fetchTrendingTopic = async () => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) throw new Error("User not authenticated");

            const response = await fetch("https://zenture-backend.onrender.com/api/forum/posts", {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Failed to fetch forum posts");

            const posts: Post[] = await response.json();
            if (posts.length > 0) {
                setTrendingTopic(posts[0]);
            }
        } catch (error) {
            console.error("Error fetching forum posts:", error);
        }
    };
    fetchTrendingTopic();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <h2 className="text-3xl font-bold text-foreground mb-8">Connect & Share</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="gradient-bg bg-card p-6 rounded-xl shadow-sm border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                <Link href="/peer-support">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                        <Heart className="text-primary group-hover:scale-110 transition-transform" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">Peer Support Hub</h3>
                    <p className="text-muted-foreground mb-4">Connect with fellow students in a safe, moderated space.</p>
                    {trendingTopic && (
                        <div className="text-sm bg-muted/50 p-3 rounded-lg">🔥 <span className="font-bold">Trending:</span> {trendingTopic.title}</div>
                    )}
                </Link>
            </div>
            <div className="gradient-bg bg-card p-6 rounded-xl shadow-sm border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                <Link href="/book-appointment">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                        <Calendar className="text-primary group-hover:scale-110 transition-transform" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">Book a Session</h3>
                    <p className="text-muted-foreground">Confidential support is available. Connect with a campus counselor when you're ready.</p>
                </Link>
            </div>
        </div>
    </section>
  );
}
