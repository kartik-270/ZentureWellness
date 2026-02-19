import React, { useState, useEffect } from "react";
import {
    AlertTriangle,
    MessageSquare,
    TrendingUp,
    Heart,
    CheckCircle,
    Activity
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line
} from "recharts";
import AdminLayout from "../../components/AdminLayout";
import { apiConfig } from "@/lib/config";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function ChatAnalytics() {
    const [username, setUsername] = useState("Admin");
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) setUsername(storedUsername);

        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${apiConfig.baseUrl}/admin/analytics/chatbot`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setAnalytics(data);
        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !analytics) {
        return <div className="p-8 text-center text-gray-500">Loading Analytics...</div>;
    }

    // Transform emotion distribution for PieChart
    const emotionData = Object.entries(analytics.emotionDistribution).map(([name, value]) => ({
        name,
        value
    }));

    // Transform trends for LineChart
    const trendData = Object.entries(analytics.trends).map(([date, emotions]: [string, any]) => ({
        date,
        ...emotions
    }));

    return (
        <AdminLayout
            title="Chatbot AI Insights"
            icon={<MessageSquare className="text-purple-600" />}
            username={username}
        >
            {/* KPI Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Completion Rate</p>
                        <h3 className="text-2xl font-bold text-gray-800">{analytics.completionRate}%</h3>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg"><CheckCircle className="text-green-500" /></div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Avg Feedback</p>
                        <h3 className="text-2xl font-bold text-gray-800">{analytics.avgFeedbackScore}/1</h3>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg"><Heart className="text-blue-500" /></div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Crisis Flags</p>
                        <h3 className="text-2xl font-bold text-red-600">{analytics.crisisCount}</h3>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg"><AlertTriangle className="text-red-500" /></div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Primary Emotion</p>
                        <h3 className="text-2xl font-bold text-purple-600">Stressed</h3>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg"><Activity className="text-purple-500" /></div>
                </div>
            </div>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Emotional Distribution Chart */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <span className="text-2xl">😊</span> Emotional Distribution
                    </h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={emotionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {emotionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Emotional Trends Over Time */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <TrendingUp className="text-blue-500" /> Emotional Trends (7 Days)
                    </h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="stressed" fill="#FF8042" stackId="a" />
                                <Bar dataKey="anxious" fill="#FFBB28" stackId="a" />
                                <Bar dataKey="neutral" fill="#00C49F" stackId="a" />
                                <Bar dataKey="happy" fill="#0088FE" stackId="a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </section>

            {/* Intent Clustering */}
            <section className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="text-2xl">🧠</span> Student Concern Clustering (NLP)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(analytics.intentDistribution).map(([topic, count]: [string, any], i) => (
                        <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-purple-200 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-gray-700 capitalize">{topic}</span>
                                <span className="text-xs font-semibold px-2 py-1 bg-purple-100 text-purple-700 rounded-full">{count} sessions</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (count / 100) * 100)}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </AdminLayout>
    );
}
