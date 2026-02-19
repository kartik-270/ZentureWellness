import React, { useState, useEffect } from "react";
import {
    BarChart2,
    Users,
    Stethoscope,
    Activity,
    Calendar,
    TrendingUp
} from "lucide-react";
import { apiConfig } from "@/lib/config";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "../../components/AdminLayout";

const Reports: React.FC = () => {
    const [username, setUsername] = useState("Admin");
    const [loading, setLoading] = useState(true);
    const [overview, setOverview] = useState({
        totalUsers: 0,
        activeUsers: 0,
        totalSessions: 0,
        avgSessionDuration: "0 min"
    });

    const { toast } = useToast();

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }
        fetchOverview();
    }, []);

    const fetchOverview = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch(`${apiConfig.baseUrl}/admin/analytics/overview`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setOverview(data);
            }
        } catch (e) {
            console.error(e);
            toast({ title: "Failed to load report data", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout
            title="Reporting & Analytics"
            icon={<BarChart2 className="text-blue-500" />}
            username={username}
        >
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500">Loading analytics...</p>
                </div>
            ) : (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-500 text-sm">Total Users</p>
                                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{overview.totalUsers}</h3>
                                </div>
                                <Users className="text-blue-100" size={24} color="#3b82f6" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-500 text-sm">Active Users (30d)</p>
                                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{overview.activeUsers}</h3>
                                </div>
                                <Activity className="text-green-100" size={24} color="#22c55e" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-500 text-sm">Total Sessions</p>
                                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{overview.totalSessions}</h3>
                                </div>
                                <Stethoscope className="text-purple-100" size={24} color="#a855f7" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-500 text-sm">Avg Session Duration</p>
                                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{overview.avgSessionDuration}</h3>
                                </div>
                                <Calendar className="text-orange-100" size={24} color="#f97316" />
                            </div>
                        </div>
                    </div>

                    {/* Charts Area Placeholder */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-xl shadow-md h-96 flex flex-col items-center justify-center border border-gray-100">
                            <TrendingUp size={48} className="text-gray-300 mb-4" />
                            <p className="text-gray-500 font-medium">Engagement Trends Chart</p>
                            <p className="text-xs text-gray-400 mt-2">Connects to /admin/analytics/engagement</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md h-96 flex flex-col items-center justify-center border border-gray-100">
                            <Activity size={48} className="text-gray-300 mb-4" />
                            <p className="text-gray-500 font-medium">Mood Analysis Chart</p>
                            <p className="text-xs text-gray-400 mt-2">Connects to /admin/analytics/mood</p>
                        </div>
                    </div>
                </>
            )}
        </AdminLayout>
    );
};

export default Reports;
