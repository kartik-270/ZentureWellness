"use client";

import { useState, useEffect, useMemo } from "react";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
    AreaChart, Area
} from 'recharts';
import { apiConfig } from "@/lib/config";
import {
    Calendar, TrendingUp, History, Info,
    LayoutDashboard, CheckCircle2, CloudRain, Sun, Cloud
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface MoodEntry {
    mood: string;
    intensity: number;
    sleep: string;
    social: boolean;
    energy: string;
    analysis: string;
    date: string;
}

export default function MoodReports() {
    const [history, setHistory] = useState<MoodEntry[]>([]);
    const [view, setView] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
    const [isLoading, setIsLoading] = useState(true);

    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            const daysMap = { daily: 1, weekly: 7, monthly: 30 };
            const token = localStorage.getItem("authToken");
            const response = await fetch(`${apiConfig.baseUrl}/mood-history?days=${daysMap[view]}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setHistory(data);
            }
        } catch (error) {
            console.error("Fetch history error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [view]);

    const chartData = useMemo(() => {
        return history.map(entry => {
            const date = new Date(entry.date);
            let label = "";
            if (view === 'daily') {
                label = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } else {
                label = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
            }
            return {
                label,
                intensity: entry.intensity,
                mood: entry.mood,
                rawDate: date
            };
        });
    }, [history, view]);

    const averageIntensity = useMemo(() => {
        if (history.length === 0) return 0;
        return (history.reduce((acc, curr) => acc + curr.intensity, 0) / history.length).toFixed(1);
    }, [history]);

    const getMoodIcon = (mood: string) => {
        const m = mood.toLowerCase();
        if (m === 'happy' || m === 'excellent') return <Sun className="text-yellow-500" />;
        if (m === 'sad' || m === 'anxious') return <CloudRain className="text-blue-500" />;
        return <Cloud className="text-slate-400" />;
    };

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">My Wellness Reports</h2>
                    <p className="text-slate-500">Track and analyze your mental health journey over time.</p>
                </div>

                <div className="flex p-1 bg-slate-100 rounded-xl self-start">
                    {(['daily', 'weekly', 'monthly'] as const).map((v) => (
                        <button
                            key={v}
                            onClick={() => setView(v)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${view === v ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart Card */}
                <Card className="lg:col-span-2 border-blue-50 shadow-sm overflow-hidden rounded-[2rem]">
                    <CardHeader className="bg-slate-50/50">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <TrendingUp className="text-blue-600" />
                                Mood Intensity Trend
                            </CardTitle>
                            <div className="text-sm font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                                Avg: {averageIntensity}/10
                            </div>
                        </div>
                        <CardDescription>Tracing your emotion strength over the {view} period.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 h-[350px]">
                        {isLoading ? (
                            <div className="h-full flex items-center justify-center text-slate-400">Loading data...</div>
                        ) : chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="label"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        domain={[0, 10]}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        dx={-10}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ fontWeight: 'bold', color: '#2563eb' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="intensity"
                                        stroke="#2563eb"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorIntensity)"
                                        animationDuration={1500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                                <Calendar size={48} className="opacity-20" />
                                <p>No check-ins recorded for this period.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Summaries Column */}
                <div className="space-y-6">
                    <Card className="border-blue-50 shadow-sm rounded-[2rem] h-full overflow-hidden">
                        <CardHeader className="bg-slate-50/50">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <History className="text-blue-600" />
                                Recent Insights
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {history.length > 0 ? (
                                    [...history].reverse().slice(0, 5).map((entry, i) => (
                                        <div key={i} className="group p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    {getMoodIcon(entry.mood)}
                                                    <span className="font-bold text-slate-800">{entry.mood}</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                                    {new Date(entry.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                                                {entry.analysis}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-400 text-center py-10 italic">Start checking in to see personalized insights.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Logs", value: history.length, icon: <CheckCircle2 className="text-green-500" />, bg: "bg-green-50" },
                    { label: "Sleep Quality", value: history[0]?.sleep || "N/A", icon: <History className="text-indigo-500" />, bg: "bg-indigo-50" },
                    { label: "Social Activity", value: history.filter(h => h.social).length, icon: <Info className="text-orange-500" />, bg: "bg-orange-50" },
                    { label: "Mood Score", value: `${averageIntensity}/10`, icon: <TrendingUp className="text-blue-500" />, bg: "bg-blue-50" },
                ].map((stat, i) => (
                    <div key={i} className={`p-4 rounded-3xl border border-white shadow-sm flex items-center gap-4 ${stat.bg}`}>
                        <div className="bg-white p-3 rounded-2xl shadow-sm">
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">{stat.label}</p>
                            <p className="text-lg font-black text-slate-800">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
