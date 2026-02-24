"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { apiConfig } from "@/lib/config";
import { CheckCircle2, ChevronRight, ChevronLeft, Save } from "lucide-react";

type MoodCheckinModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (summary: string) => void;
    isSimplified?: boolean;
};

const moods = [
    { label: "Happy", emoji: "😊", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    { label: "Calm", emoji: "😌", color: "bg-blue-100 text-blue-700 border-blue-200" },
    { label: "Stressed", emoji: "😟", color: "bg-orange-100 text-orange-700 border-orange-200" },
    { label: "Sad", emoji: "😥", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
    { label: "Anxious", emoji: "😰", color: "bg-purple-100 text-purple-700 border-purple-200" },
    { label: "Angry", emoji: "😠", color: "bg-red-100 text-red-700 border-red-200" },
];

const sleepOptions = [
    { label: "Poor", icon: "😫" },
    { label: "Fair", icon: "🥱" },
    { label: "Good", icon: "😴" },
    { label: "Excellent", icon: "✨" },
];

const energyOptions = ["Low", "Medium", "High"];

export default function MoodCheckinModal({ isOpen, onClose, onSuccess, isSimplified = false }: MoodCheckinModalProps) {
    const [step, setStep] = useState(1);
    const [mood, setMood] = useState("");
    const [intensity, setIntensity] = useState(5);
    const [sleep, setSleep] = useState("Good");
    const [social, setSocial] = useState(false);
    const [energy, setEnergy] = useState("Medium");
    const [isSaving, setIsSaving] = useState(false);
    const [analysis, setAnalysis] = useState("");

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setStep(1);
            setMood("");
            setIntensity(5);
            setSleep("Good");
            setSocial(false);
            setEnergy("Medium");
            setAnalysis("");
        }
    }, [isOpen]);

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSave = async (quickMood?: string) => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem("authToken");
            const finalMood = quickMood || mood;
            const response = await fetch(`${apiConfig.baseUrl}/mood-checkin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    mood: finalMood,
                    intensity,
                    sleep_quality: sleep,
                    social_interaction: social,
                    energy_level: energy
                })
            });

            if (response.ok) {
                const data = await response.json();
                setAnalysis(data.analysis);
                if (!isSimplified) setStep(6); // Step 6 is already set in simplified mode
            }
        } catch (error) {
            console.error("Save error:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleFinish = () => {
        onSuccess(analysis);
        onClose();
        // Notify other components like Navbar about streak update
        window.dispatchEvent(new Event('streak-updated'));
        // Reset for next time
        setStep(1);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px] overflow-hidden p-0 border-none shadow-2xl">
                <div className="bg-gradient-to-br from-blue-50 to-white p-6">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-bold text-blue-900">
                            {step < 6 ? "Mood Check-in" : "Your Analysis"}
                        </DialogTitle>
                        <DialogDescription className="text-blue-700/70">
                            {step < 6
                                ? (isSimplified ? "Quick Update" : `Step ${step} of 5`)
                                : "Assessment Results"}
                        </DialogDescription>
                    </DialogHeader>

                    {/* Step 1: Mood */}
                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h3 className="font-semibold text-lg text-slate-800">How's your mood right now?</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {moods.map((m) => (
                                    <button
                                        key={m.label}
                                        onClick={() => {
                                            if (isSaving) return;
                                            setMood(m.label);
                                            if (isSimplified) {
                                                // Simplified mode: Trigger save and jump to results
                                                handleSave(m.label);
                                                setStep(6);
                                            }
                                        }}
                                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${mood === m.label ? m.color + " scale-105 shadow-md" : "bg-white border-slate-100 hover:border-blue-200"}`}
                                    >
                                        <span className="text-3xl">{m.emoji}</span>
                                        <span className="text-xs font-semibold">{m.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Intensity */}
                    {step === 2 && (
                        <div className="space-y-8 py-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h3 className="font-semibold text-lg text-slate-800">How strong is this feeling?</h3>
                            <div className="px-2">
                                <div className="flex justify-between mb-4">
                                    <span className="text-sm font-medium text-slate-500">Mild</span>
                                    <span className="text-2xl font-bold text-blue-600">{intensity}</span>
                                    <span className="text-sm font-medium text-slate-500">Intense</span>
                                </div>
                                <Slider
                                    value={[intensity]}
                                    min={1}
                                    max={10}
                                    step={1}
                                    onValueChange={(val) => setIntensity(val[0])}
                                    className="my-6"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 3: Sleep */}
                    {step === 3 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h3 className="font-semibold text-lg text-slate-800">How was your sleep last night?</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {sleepOptions.map((opt) => (
                                    <button
                                        key={opt.label}
                                        onClick={() => setSleep(opt.label)}
                                        className={`p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${sleep === opt.label ? "border-blue-500 bg-blue-50 shadow-sm" : "bg-white border-slate-100 hover:border-blue-200"}`}
                                    >
                                        <span className="text-2xl">{opt.icon}</span>
                                        <span className="font-medium text-slate-700">{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Social */}
                    {step === 4 && (
                        <div className="space-y-8 py-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-lg text-slate-800">Social Check</h3>
                                    <p className="text-sm text-slate-500">Did you talk to someone today?</p>
                                </div>
                                <Switch checked={social} onCheckedChange={setSocial} />
                            </div>
                        </div>
                    )}

                    {/* Step 5: Energy */}
                    {step === 5 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h3 className="font-semibold text-lg text-slate-800">What's your energy level?</h3>
                            <div className="flex p-1 bg-slate-100 rounded-xl">
                                {energyOptions.map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => setEnergy(opt)}
                                        className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all ${energy === opt ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 6: Summary */}
                    {step === 6 && (
                        <div className="space-y-6 animate-in zoom-in duration-500">
                            <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CheckCircle2 size={20} />
                                        <span className="text-sm font-medium uppercase tracking-wider">Report Summary</span>
                                    </div>
                                    <p className="text-lg leading-relaxed font-medium min-h-[60px] flex items-center justify-center">
                                        {isSaving && !analysis ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span className="text-sm opacity-80">Generating personalized analysis...</span>
                                            </div>
                                        ) : (
                                            `"${analysis || "Thanks for your check-in! Our experts are processing your wellness report."}"`
                                        )}
                                    </p>
                                </div>
                                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                            </div>

                            <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                <CheckCircle2 size={16} className="text-blue-500" />
                                <span>Report saved to 'My Reports' for tracking.</span>
                            </div>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="mt-8 flex items-center justify-between">
                        {step > 1 && step < 6 ? (
                            <Button variant="ghost" onClick={prevStep} className="text-slate-500">
                                <ChevronLeft className="mr-2" size={18} /> Back
                            </Button>
                        ) : <div />}

                        {step < 5 ? (
                            <Button
                                onClick={nextStep}
                                disabled={step === 1 && !mood}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-full"
                            >
                                Next <ChevronRight className="ml-2" size={18} />
                            </Button>
                        ) : step === 5 ? (
                            <Button
                                onClick={() => handleSave()}
                                disabled={isSaving}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-full"
                            >
                                {isSaving ? "Saving..." : "Save to My Profile"} <Save className="ml-2" size={18} />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleFinish}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 text-lg"
                            >
                                Done
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
