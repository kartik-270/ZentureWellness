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
    const [chatbotStats, setChatbotStats] = useState<any>(null);
    const [nlpAnalytics, setNlpAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) setUsername(storedUsername);

        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const headers = { 'Authorization': `Bearer ${token}` };

            const [chatbotRes, nlpRes] = await Promise.all([
                fetch(`${apiConfig.baseUrl}/admin/analytics/chatbot`, { headers }),
                fetch(`${apiConfig.baseUrl}/admin/analytics/chat`, { headers })
            ]);

            if (chatbotRes.ok) setChatbotStats(await chatbotRes.json());
            if (nlpRes.ok) setNlpAnalytics(await nlpRes.json());

        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !chatbotStats || !nlpAnalytics) {
        return <div className="p-8 text-center text-gray-500">Loading Analytics...</div>;
    }

    // Transform emotion distribution for PieChart
    const emotionData = Object.entries(chatbotStats.emotionDistribution || {}).map(([name, value]) => ({
        name,
        value
    }));

    // Transform trends for LineChart
    const trendData = Object.entries(chatbotStats.trends || {}).map(([date, emotions]: [string, any]) => ({
        date,
        ...emotions
    }));

    const sentimentChartData = nlpAnalytics?.sentiment || [];
    const topics = nlpAnalytics?.topics || [];
    const risks = nlpAnalytics?.risks || [];

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
                        <h3 className="text-2xl font-bold text-gray-800">{chatbotStats.completionRate}%</h3>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg"><CheckCircle className="text-green-500" /></div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Avg Feedback</p>
                        <h3 className="text-2xl font-bold text-gray-800">{chatbotStats.avgFeedbackScore}/1</h3>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg"><Heart className="text-blue-500" /></div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Crisis Flags</p>
                        <h3 className="text-2xl font-bold text-red-600">{chatbotStats.crisisCount}</h3>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg"><AlertTriangle className="text-red-500" /></div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Primary Emotion</p>
                        <h3 className="text-2xl font-bold text-purple-600">
                            {emotionData.length > 0 ? emotionData.sort((a, b) => (b.value as number) - (a.value as number))[0]?.name : "None"}
                        </h3>
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
            <section className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="text-2xl">🧠</span> Student Concern Clustering (NLP)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(chatbotStats.intentDistribution || {}).map(([topic, count]: [string, any], i) => (
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

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Advanced Topic NLP */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <TrendingUp className="text-indigo-500" /> NLP Topic Volume (24 Hrs)
                    </h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topics} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" />
                                <YAxis dataKey="topic" type="category" width={80} />
                                <Tooltip />
                                <Bar dataKey="volume" fill="#8884d8" barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sentiment Arc */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Activity className="text-green-500" /> Sentiment Arc (24 Hrs)
                    </h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sentimentChartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="timestamp" />
                                <YAxis domain={[-1, 1]} />
                                <Tooltip />
                                <Line type="monotone" dataKey="sentimentScore" stroke="#00C49F" strokeWidth={3} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </section>

            {/* High Risk Alerts Table */}
            <section className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <AlertTriangle className="text-red-500" /> High-Risk AI Identifications
                </h2>
                {risks.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 font-medium text-gray-500">Student ID (Anon)</th>
                                    <th className="px-6 py-3 font-medium text-gray-500">Risk Score</th>
                                    <th className="px-6 py-3 font-medium text-gray-500">Trigger Factors</th>
                                    <th className="px-6 py-3 font-medium text-gray-500">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {risks.map((risk: any, i: number) => (
                                    <tr key={i} className="border-b hover:bg-red-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-700">{risk.studentId}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${risk.riskScore > 80 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {risk.riskScore}/100
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 text-sm">{risk.riskFactors.join(", ")}</td>
                                        <td className="px-6 py-4">
                                            <button className="text-blue-600 font-semibold hover:underline">Review Chat</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">No high-risk identifications detected in recent logs.</p>
                )}
            </section>
        </AdminLayout>
    );
}
