import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BreathworkVisualizerProps {
    onClose: () => void;
}

const BreathworkVisualizer: React.FC<BreathworkVisualizerProps> = ({ onClose }) => {
    const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "hold2">("inhale");
    const [isActive, setIsActive] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isAudioMuted, setIsAudioMuted] = useState(false);

    // Timing constants (in seconds)
    const durations = {
        inhale: 4,
        hold: 4,
        exhale: 4,
        hold2: 4,
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive) {
            interval = setInterval(() => {
                setProgress((prev) => {
                    const next = prev + 0.1;
                    const currentDuration = durations[phase];

                    if (next >= currentDuration) {
                        // Switch phases
                        setPhase((prevPhase) => {
                            if (prevPhase === "inhale") return "hold";
                            if (prevPhase === "hold") return "exhale";
                            if (prevPhase === "exhale") return "hold2";
                            return "inhale";
                        });
                        return 0;
                    }
                    return next;
                });
            }, 100);
        }

        return () => clearInterval(interval);
    }, [isActive, phase]);

    const toggleExercise = () => setIsActive(!isActive);
    const resetExercise = () => {
        setIsActive(false);
        setPhase("inhale");
        setProgress(0);
    };

    const getPhaseText = () => {
        switch (phase) {
            case "inhale": return "Inhale Slowly";
            case "hold": return "Hold Breath";
            case "exhale": return "Exhale Gently";
            case "hold2": return "Hold and Empty";
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/95 backdrop-blur-md">
            <div className="relative w-full max-w-2xl p-8 flex flex-col items-center">
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 m-4 rounded-full"
                    onClick={onClose}
                >
                    <X className="h-6 w-6" />
                </Button>

                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Box Breathing Exercise
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        Follow the circle to regulate your heart rate and reduce stress.
                    </p>
                </div>

                <div className="relative flex items-center justify-center h-64 w-64 md:h-80 md:w-80">
                    {/* Background Aura */}
                    <motion.div
                        className="absolute inset-0 rounded-full bg-primary/10 blur-3xl"
                        animate={{
                            scale: phase === "inhale" || phase === "hold" ? 1.5 : 1,
                            opacity: isActive ? [0.1, 0.2, 0.1] : 0.1,
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                    />

                    {/* Main Visualizer Circle */}
                    <motion.div
                        className="w-full h-full rounded-full border-4 border-primary/20 flex items-center justify-center relative bg-card/10 backdrop-blur-sm shadow-[0_0_50px_-12px_rgba(var(--primary),0.3)]"
                        animate={{
                            scale: phase === "inhale" ? 1.2 : phase === "exhale" ? 0.8 : phase === "hold" ? 1.2 : 0.8,
                        }}
                        transition={{
                            duration: 4,
                            ease: "easeInOut"
                        }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={phase}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-center"
                            >
                                <p className="text-2xl font-light tracking-widest uppercase text-primary">
                                    {isActive ? getPhaseText() : "Ready?"}
                                </p>
                                {isActive && (
                                    <p className="text-lg mt-2 font-mono text-muted-foreground/60">
                                        {Math.ceil(durations[phase] - progress)}s
                                    </p>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Dynamic Ring */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle
                                cx="50%"
                                cy="50%"
                                r="48%"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                className="text-primary/10"
                            />
                            {isActive && (
                                <motion.circle
                                    cx="50%"
                                    cy="50%"
                                    r="48%"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    strokeDasharray="100 100"
                                    className="text-primary"
                                    animate={{
                                        strokeDashoffset: [100, 0]
                                    }}
                                    transition={{
                                        duration: durations[phase],
                                        ease: "linear",
                                        repeat: 0
                                    }}
                                />
                            )}
                        </svg>
                    </motion.div>
                </div>

                <div className="mt-16 flex items-center gap-6">
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full h-12 w-12"
                        onClick={resetExercise}
                    >
                        <RotateCcw className="h-5 w-5" />
                    </Button>

                    <Button
                        variant="default"
                        size="lg"
                        className="rounded-full h-16 w-16 shadow-lg shadow-primary/25"
                        onClick={toggleExercise}
                    >
                        {isActive ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full h-12 w-12"
                        onClick={() => setIsAudioMuted(!isAudioMuted)}
                    >
                        {isAudioMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </Button>
                </div>

                <div className="mt-8 flex gap-2">
                    {["inhale", "hold", "exhale", "hold2"].map((p) => (
                        <div
                            key={p}
                            className={`h-1.5 w-8 rounded-full transition-colors duration-500 ${phase === p && isActive ? "bg-primary" : "bg-muted"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BreathworkVisualizer;
