import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Home,
} from "lucide-react";
import { apiConfig } from "@/lib/config";
import AdminLayout from "../../components/AdminLayout";

// Define the data structures for the charts using interfaces
interface ChartDataPoint {
  label: string;
  value: number;
}

interface PieChartDataPoint {
  label: string;
  value: number;
  color: string;
}

interface AnxietyDataPoint {
  day: string;
  low: number;
  medium: number;
  high: number;
}

// Define interface for upcoming appointments
interface Appointment {
  student_username: string;
  appointment_time: string;
}

// Simple Line Chart Component for demonstration
const LineChart = ({ data, colors }: { data: ChartDataPoint[][]; colors: string[] }) => {
  const chartHeight = 200;
  const chartWidth = 500;
  const allValues = data.flatMap(series => series.map(d => d.value));
  const yAxisMax = Math.max(...allValues, 10); // Ensure at least some height
  const yAxisMin = 0;
  const yRatio = chartHeight / (yAxisMax - yAxisMin);
  const xRatio = chartWidth / (data[0].length - 1 || 1);
  const days = data[0].map(d => d.label);

  return (
    <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 30}`} className="w-full">
      {/* X-axis labels */}
      {days.map((day, i) => (
        <text
          key={`label-${i}`}
          x={i * xRatio}
          y={chartHeight + 15}
          textAnchor="middle"
          fontSize="12"
          fill="#4b5563"
        >
          {day}
        </text>
      ))}
      {data.map((series, seriesIndex) => {
        const points = series
          .map((d, i) => `${i * xRatio},${chartHeight - (d.value - yAxisMin) * yRatio}`)
          .join(" ");

        return (
          <g key={seriesIndex}>
            <polyline
              fill="none"
              stroke={colors[seriesIndex]}
              strokeWidth="2"
              points={points}
            />
            {series.map((d, i) => (
              <circle
                key={i}
                cx={i * xRatio}
                cy={chartHeight - (d.value - yAxisMin) * yRatio}
                r="4"
                fill={colors[seriesIndex]}
              />
            ))}
            {/* Labels */}
            {series.map((d, i) => (
              <text
                key={i}
                x={i * xRatio}
                y={chartHeight - (d.value - yAxisMin) * yRatio - 10}
                textAnchor="middle"
                fontSize="12"
                fill={colors[seriesIndex]}
              >
                {d.value}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
};

// Simple Pie Chart Component for demonstration
const PieChart = ({ data }: { data: PieChartDataPoint[] }) => {
  let total = data.reduce((sum, item) => sum + item.value, 0);
  let startAngle = 0;

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {data.map((slice, index) => {
        const endAngle = startAngle + (slice.value / total) * 360;
        const largeArcFlag = slice.value / total > 0.5 ? 1 : 0;
        const x1 = 50 + 50 * Math.cos(Math.PI * startAngle / 180);
        const y1 = 50 + 50 * Math.sin(Math.PI * startAngle / 180);
        const x2 = 50 + 50 * Math.cos(Math.PI * endAngle / 180);
        const y2 = 50 + 50 * Math.sin(Math.PI * endAngle / 180);
        const d = `M 50,50 L ${x1},${y1} A 50,50 0 ${largeArcFlag},1 ${x2},${y2} z`;

        startAngle = endAngle;

        return (
          <path key={index} d={d} fill={slice.color} />
        );
      })}
      {/* Labels and Legend */}
      <g className="translate-x-12">
        {data.map((slice, index) => (
          <text
            key={index}
            x="55"
            y={`${15 + index * 15}`}
            fontSize="5"
            fill="#4b5563"
          >
            <circle cx="50" cy="10" r="4" fill={slice.color} transform={`translate(-5, ${index * 15})`} />
            <tspan x="60" y={`${15 + index * 15}`} className="ml-2">{slice.label} ({Math.round(slice.value / total * 100)}%)</tspan>
          </text>
        ))}
      </g>
    </svg>
  );
};

// New Anxiety Analysis Chart for demonstration
const AnxietyAnalysisChart = ({ data }: { data: AnxietyDataPoint[] }) => {
  const chartHeight = 200;
  const chartWidth = 500;
  const xAxisLabels = data.map(d => d.day);
  const maxTotal = Math.max(...data.map(d => d.low + d.medium + d.high), 10);

  return (
    <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 30}`} className="w-full">
      {data.map((d, index) => {
        const barWidth = (chartWidth / data.length) * 0.7;
        const barX = (chartWidth / data.length) * index + (chartWidth / data.length - barWidth) / 2;

        const lowHeight = (d.low / maxTotal) * chartHeight;
        const mediumHeight = (d.medium / maxTotal) * chartHeight;
        const highHeight = (d.high / maxTotal) * chartHeight;

        return (
          <g key={index}>
            {/* Low Anxiety */}
            <rect
              x={barX}
              y={chartHeight - lowHeight}
              width={barWidth}
              height={lowHeight}
              fill="#22c55e"
              className="transition-all duration-300"
            />
            {/* Medium Anxiety */}
            <rect
              x={barX}
              y={chartHeight - lowHeight - mediumHeight}
              width={barWidth}
              height={mediumHeight}
              fill="#f97316"
              className="transition-all duration-300"
            />
            {/* High Anxiety */}
            <rect
              x={barX}
              y={chartHeight - lowHeight - mediumHeight - highHeight}
              width={barWidth}
              height={highHeight}
              fill="#ef4444"
              className="transition-all duration-300"
            />
            {/* Label */}
            <text x={barX + barWidth / 2} y={chartHeight + 15} textAnchor="middle" fontSize="12" fill="#4b5563">
              {xAxisLabels[index]}
            </text>
          </g>
        );
      })}
    </svg>
  );
};


export default function AdminDashboard() {
  const [username, setUsername] = useState("Admin");
  // State for appointments
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [appointmentError, setAppointmentError] = useState<string | null>(null);

  // State for chart data
  const [engagementData, setEngagementData] = useState<{ newUsers: ChartDataPoint[], activeSessions: ChartDataPoint[] } | null>(null);
  const [moodData, setMoodData] = useState<AnxietyDataPoint[]>([]);
  const [resourceData, setResourceData] = useState<any[]>([]);
  const [overviewData, setOverviewData] = useState<any>(null);
  const [counselorStatus, setCounselorStatus] = useState<any>(null);
  const [forumActivity, setForumActivity] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  const languageData: PieChartDataPoint[] = [
    { label: "English", value: 70, color: "#2563eb" },
    { label: "Hindi", value: 20, color: "#f97316" },
    { label: "Other", value: 10, color: "#6b7280" },
  ];

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const fetchData = async () => {
      setLoadingAppointments(true);
      setLoadingAnalytics(true);
      setAppointmentError(null);

      const token = localStorage.getItem("authToken"); // Assuming token storage
      if (!token) {
        setAppointmentError("Authentication token not found.");
        // In dev mode, we might want to show mock data even if no token
        // setLoadingAppointments(false);
        // setLoadingAnalytics(false);
        // return;
      }

      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        // Parallel fetch for all dashboard data
        const [appointRes, engageRes, moodRes, resourceRes, overviewRes, counselorRes, forumRes] = await Promise.all([
          fetch(`${apiConfig.baseUrl}/admin/upcoming-appointments`, { headers }),
          fetch(`${apiConfig.baseUrl}/admin/analytics/engagement`, { headers }),
          fetch(`${apiConfig.baseUrl}/admin/analytics/mood`, { headers }),
          fetch(`${apiConfig.baseUrl}/admin/analytics/resources`, { headers }),
          fetch(`${apiConfig.baseUrl}/admin/analytics/overview`, { headers }),
          fetch(`${apiConfig.baseUrl}/admin/analytics/counselors-status`, { headers }),
          fetch(`${apiConfig.baseUrl}/admin/analytics/forum-activity`, { headers })
        ]);

        if (appointRes.ok) setUpcomingAppointments(await appointRes.json());
        if (engageRes.ok) setEngagementData(await engageRes.json());
        if (moodRes.ok) setMoodData(await moodRes.json());
        if (resourceRes.ok) setResourceData(await resourceRes.json());
        if (overviewRes.ok) setOverviewData(await overviewRes.json());
        if (counselorRes.ok) setCounselorStatus(await counselorRes.json());
        if (forumRes.ok) setForumActivity(await forumRes.json());

      } catch (error: any) {
        console.error("Dashboard fetch error:", error);
        setAppointmentError("Failed to load some dashboard data. Using mock data for demo.");
        // Fallback mock data if API fails (for demo purposes)
        setEngagementData({
          newUsers: [{ label: "Mon", value: 12 }, { label: "Tue", value: 19 }, { label: "Wed", value: 3 }, { label: "Thu", value: 5 }, { label: "Fri", value: 2 }, { label: "Sat", value: 3 }],
          activeSessions: [{ label: "Mon", value: 5 }, { label: "Tue", value: 10 }, { label: "Wed", value: 15 }, { label: "Thu", value: 20 }, { label: "Fri", value: 25 }, { label: "Sat", value: 30 }]
        });
        setMoodData([
          { day: "Mon", low: 10, medium: 5, high: 2 },
          { day: "Tue", low: 8, medium: 7, high: 3 },
          { day: "Wed", low: 12, medium: 4, high: 1 },
          { day: "Thu", low: 9, medium: 6, high: 2 },
          { day: "Fri", low: 11, medium: 3, high: 4 },
          { day: "Sat", low: 15, medium: 2, high: 1 },
          { day: "Sun", low: 13, medium: 4, high: 0 },
        ]);
        setResourceData([{ title: "Managing Stress", type: "Article", views: 150 }, { title: "Meditation 101", type: "Video", views: 120 }]);
        setUpcomingAppointments([{ student_username: "john_doe", appointment_time: new Date().toISOString() }]);

      } finally {
        setLoadingAppointments(false);
        setLoadingAnalytics(false);
      }
    };

    fetchData();
  }, []);

  // Fallback/Default data while loading or error
  const defaultEngagement = [
    [{ label: "Mon", value: 0 }, { label: "Sun", value: 0 }],
    [{ label: "Mon", value: 0 }, { label: "Sun", value: 0 }]
  ];

  const engagementChartColors = ["#2563eb", "#f97316"];

  return (
    <AdminLayout
      title="Admin Dashboard"
      icon={<Home className="text-blue-600" />}
      username={username}
    >
      {/* Priority Overview Section */}
      <section className="space-y-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-700">Priority Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Urgent Action Card */}
          <div className="bg-red-600 text-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold">Urgent Action Required</h3>
              <AlertTriangle size={32} className="text-red-200" />
            </div>
            <p className="text-5xl font-extrabold mt-2 hover:animate-pulse cursor-pointer">
              {loadingAnalytics ? "..." : (overviewData?.unacknowledgedAlerts || 0)}
            </p>
            <p className="opacity-90 mt-1">Unacknowledged High-Risk Alerts</p>
            <button className="mt-6 bg-white text-red-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-md">
              Review Now
            </button>
          </div>

          {/* Upcoming Appointments Card */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Upcoming Appointments</h3>
            {loadingAppointments ? (
              <p className="text-gray-500">Loading appointments...</p>
            ) : appointmentError && upcomingAppointments.length === 0 ? (
              <p className="text-red-500">{appointmentError}</p>
            ) : upcomingAppointments.length > 0 ? (
              <ul className="space-y-3">
                {upcomingAppointments.map((appointment, index) => (
                  <li key={index} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                    <span className="font-medium text-gray-700">{appointment.student_username}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(appointment.appointment_time).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No upcoming appointments.</p>
            )}
          </div>

          {/* Counselor Status Card */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Counselor Status at a Glance</h3>
            {loadingAnalytics ? <p className="text-gray-500">Loading...</p> : (
              <div className="space-y-2 text-gray-700">
                <p>
                  Counselors Online: <span className="font-bold text-green-600">{counselorStatus?.online || 0}</span>
                </p>
                <p>
                  Available Now: <span className="font-bold text-green-600">{counselorStatus?.available || 0}</span>
                </p>
                <p>
                  Avg. Wait Time: <span className="font-bold">{counselorStatus?.avgWaitTime || "~2 mins"}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Data Analytics & Insights Section */}
      <section className="space-y-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-700">Data Analytics & Insights</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Engagement Chart */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Platform Engagement Trends</h3>
            <div className="h-64 flex flex-col items-center justify-center">
              {loadingAnalytics && !engagementData ? <p>Loading...</p> : (
                <LineChart
                  data={engagementData ? [engagementData.newUsers, engagementData.activeSessions] : defaultEngagement}
                  colors={engagementChartColors}
                />
              )}
              <div className="flex justify-center space-x-6 mt-4">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-blue-600 mr-2"></span>
                  <span className="text-sm text-gray-700">New Users</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
                  <span className="text-sm text-gray-700">Active Sessions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Language Reach Chart - Keep Static for now or implement similarly */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Language Diversity & Reach</h3>
            <div className="h-64 flex items-center justify-center">
              <PieChart data={languageData} />
            </div>
          </div>
        </div>
      </section>

      {/* Anxiety Analysis Section */}
      <section className="space-y-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-700">Anxiety Analysis</h2>
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Severity of Anxiety Discussions (Past 7 Days)</h3>
          <div className="h-64 flex flex-col items-center justify-center">
            {loadingAnalytics && moodData.length === 0 ? <p>Loading...</p> : <AnxietyAnalysisChart data={moodData} />}
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                <span className="text-sm text-gray-700">Low Severity</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
                <span className="text-sm text-gray-700">Medium Severity</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                <span className="text-sm text-gray-700">High Severity</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resource & Forum Activity Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-700">Resource & Forum Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Resources Card */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Top 5 Utilized Resources</h3>
            {loadingAnalytics && resourceData.length === 0 ? <p>Loading...</p> : (
              <ul className="space-y-2 text-gray-700">
                {resourceData.map((res: any, i: number) => (
                  <li key={i} className="flex justify-between items-center">
                    <span>{res.title} ({res.type})</span>
                    <span className="text-sm text-gray-500">{res.views} Views</span>
                  </li>
                ))}
                {resourceData.length === 0 && <p className="text-gray-500">No resource data yet.</p>}
              </ul>
            )}
          </div>

          {/* Peer Support Forum Card */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Peer Support Forum Activity</h3>
            {loadingAnalytics ? <p className="text-gray-500">Loading...</p> : (
              <div className="space-y-2 text-gray-700">
                <p>New Posts (24h): <span className="font-bold text-blue-600">{forumActivity?.newPosts24h || 0}</span></p>
                <p>Unmoderated Posts: <span className="font-bold text-yellow-600">{forumActivity?.unmoderatedPosts || 0}</span></p>
                <p>Active Threads: <span className="font-bold">{forumActivity?.activeThreads || 0}</span></p>
              </div>
            )}
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
