"use client";

import { useState, useEffect, useCallback } from "react";
// Assuming you have a 'Button' component from a UI library like shadcn/ui
import { Button } from "@/components/ui/button";
import { apiConfig } from "@/lib/config";

type Mood = {
    name: "Excellent" | "Good" | "Okay" | "Stressed" | "Sad";
    emoji: string;
    suggestion: string;
    actionText: string;
    actionLink: string;
};

const moods: Mood[] = [
    { name: "Excellent", emoji: "😊", suggestion: "That's great to hear! Let's capture this feeling. What's one good thing that happened today?", actionText: "Add a Gratitude Note", actionLink: "/journal/new?template=gratitude" },
    { name: "Good", emoji: "🙂", suggestion: "Glad you're having a good day. How about exploring a new topic to keep the momentum going?", actionText: "Explore Resources", actionLink: "/psychoeducational-hub" },
    { name: "Okay", emoji: "😐", suggestion: "Some days are just okay, and that's perfectly fine. A short walk can often lift the spirits.", actionText: "Read About Mindfulness", actionLink: "/psychoeducational-hub/article/mindfulness-walk" },
    { name: "Stressed", emoji: "😟", suggestion: "It looks like things are a bit stressful. Let's take a moment to reset with a guided exercise.", actionText: "Try a 5-Min Breathing Exercise", actionLink: "/psychoeducational-hub/audio/breathing-exercise" },
    { name: "Sad", emoji: "😥", suggestion: "We're sorry you're feeling down. Journaling can be a helpful way to process your thoughts.", actionText: "Write a Private Journal Entry", actionLink: "/journal/new" },
];

export default function DailyCheckIn() {
    const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check the user's check-in status when the component mounts
    useEffect(() => {
        const checkStatus = async () => {
            try {
                const token = localStorage.getItem("authToken"); // Use your actual auth token key
                if (!token) {
                    setIsLoading(false);
                    return; // Not logged in, can't check status
                }

                const response = await fetch(`${apiConfig.baseUrl}/mood-checkin/today-status`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setHasCheckedInToday(data.hasCheckedIn);
                }
            } catch (error) {
                console.error("Error checking mood status:", error);
            } finally {
                setIsLoading(false);
            }
        };

        checkStatus();
    }, []);

    const handleMoodSelect = async (mood: Mood) => {
        setSelectedMood(mood);
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem("authToken");
            if (!token) throw new Error("User not authenticated");

            const response = await fetch(`${apiConfig.baseUrl}/mood-checkin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ mood: mood.name }), // Date is handled by the backend
            });

            if (response.status === 409) { // 409 Conflict: Already checked in
                setHasCheckedInToday(true);
                return;
            }

            if (!response.ok) throw new Error("Failed to save mood");

            // On successful submission, update the UI
            setHasCheckedInToday(true);

        } catch (error) {
            console.error("Error saving mood:", error);
            // Revert selection if there was an error
            setSelectedMood(null);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="bg-card gradient-bg border border-border rounded-2xl p-6 md:p-8 text-center shadow-sm h-48 flex items-center justify-center">
                    <p>Loading...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="bg-card gradient-bg border border-border rounded-2xl p-6 md:p-8 text-center shadow-sm">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                    {hasCheckedInToday ? "Thanks for checking in!" : "How are you feeling today?"}
                </h2>

                {hasCheckedInToday ? (
                    <div className="animate-fade-in">
                        <p className="text-muted-foreground">You've completed your check-in for today. Come back tomorrow!</p>
                        <p className="text-4xl mt-4">👍</p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-center items-center gap-2 md:gap-4 flex-wrap mb-6">
                            {moods.map((mood) => (
                                <button
                                    key={mood.name}
                                    onClick={() => handleMoodSelect(mood)}
                                    disabled={isSubmitting}
                                    className={`flex flex-col items-center p-3 rounded-lg w-20 h-20 transition-all duration-200 border-2 disabled:opacity-50 ${selectedMood?.name === mood.name ? 'border-primary bg-primary/20 scale-110' : 'border-transparent hover:bg-muted'}`}
                                    aria-pressed={selectedMood?.name === mood.name}
                                >
                                    <span className="text-3xl mb-1">{mood.emoji}</span>
                                    <span className="text-xs font-medium text-muted-foreground">{mood.name}</span>
                                </button>
                            ))}
                        </div>

                        {selectedMood && !hasCheckedInToday && (
                            <div className="bg-background/70 rounded-lg p-6 max-w-2xl mx-auto text-center animate-fade-in">
                                <p className="text-muted-foreground mb-4">{selectedMood.suggestion}</p>
                                <a href={selectedMood.actionLink}><Button>{selectedMood.actionText}</Button></a>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
