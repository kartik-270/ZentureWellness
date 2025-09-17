import React, { useState, useEffect } from "react";
import {
  Home,
  Users,
  AlertTriangle,
  Stethoscope,
  BookOpen,
  BarChart2,
  Settings,
  LogOut,
} from "lucide-react";

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

// Simple Line Chart Component for demonstration
const LineChart = ({ data, colors }: { data: ChartDataPoint[][]; colors: string[] }) => {
  const chartHeight = 200;
  const chartWidth = 500;
  const allValues = data.flatMap(series => series.map(d => d.value));
  const yAxisMax = Math.max(...allValues);
  const yAxisMin = 0;
  const yRatio = chartHeight / (yAxisMax - yAxisMin);
  const xRatio = chartWidth / (data[0].length - 1);
  const days = data[0].map(d => d.label);

  return (
    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full">
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
            <tspan x="60" y={`${15 + index * 15}`} className="ml-2">{slice.label} ({slice.value / total * 100}%)</tspan>
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
  const maxTotal = Math.max(...data.map(d => d.low + d.medium + d.high));

  return (
    <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 20}`} className="w-full">
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
  
  // Sample data for the charts
  const newUsersData: ChartDataPoint[] = [
    { label: "Mon", value: 10 },
    { label: "Tue", value: 15 },
    { label: "Wed", value: 25 },
    { label: "Thu", value: 20 },
    { label: "Fri", value: 35 },
    { label: "Sat", value: 30 },
    { label: "Sun", value: 45 },
  ];

  const activeSessionsData: ChartDataPoint[] = [
    { label: "Mon", value: 50 },
    { label: "Tue", value: 55 },
    { label: "Wed", value: 65 },
    { label: "Thu", value: 60 },
    { label: "Fri", value: 80 },
    { label: "Sat", value: 75 },
    { label: "Sun", value: 90 },
  ];

  const languageData: PieChartDataPoint[] = [
    { label: "English", value: 70, color: "#2563eb" },
    { label: "Hindi", value: 20, color: "#f97316" },
    { label: "Other", value: 10, color: "#6b7280" },
  ];

  const anxietyData: AnxietyDataPoint[] = [
    { day: "Mon", low: 40, medium: 25, high: 10 },
    { day: "Tue", low: 50, medium: 20, high: 15 },
    { day: "Wed", low: 60, medium: 15, high: 5 },
    { day: "Thu", low: 30, medium: 35, high: 20 },
    { day: "Fri", low: 45, medium: 15, high: 5 },
    { day: "Sat", low: 70, medium: 10, high: 5 },
    { day: "Sun", low: 65, medium: 20, high: 10 },
  ];

  const engagementChartData = [newUsersData, activeSessionsData];
  const engagementChartColors = ["#2563eb", "#f97316"]; // Blue for new users, orange for active sessions

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-66 bg-gray-900 text-gray-100 p-6 flex flex-col justify-between">
        <nav className="space-y-6">
          <h1 className="text-2xl font-bold text-white mb-8">Zenture Admin</h1>
          <a href="/admin/dashboard" className="flex items-center space-x-4 p-2 rounded-lg bg-gray-800 text-blue-400">
            <Home size={22} />
            <span className="font-semibold">Dashboard Home</span>
          </a>
          <a href="/admin/students" className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800 transition-colors">
            <Users size={22} />
            <span>Student Directory</span>
          </a>
          <a href="/admin/crisis-escalation" className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800 transition-colors">
            <AlertTriangle size={22} />
            <span>Crisis & Escalation</span>
          </a>
          <a href="/admin/counselor-availability" className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800 transition-colors">
            <Stethoscope size={22} />
            <span>Counselor Availability</span>
          </a>
          <a href="/admin/resources" className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800 transition-colors">
            <BookOpen size={22} />
            <span>Resource Management</span>
          </a>
          <a href="/admin/reports" className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800 transition-colors">
            <BarChart2 size={22} />
            <span>Reporting & Analytics</span>
          </a>
          <a href="/admin/settings" className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800 transition-colors">
            <Settings size={22} />
            <span>Settings</span>
          </a>
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-4 p-2 rounded-lg text-red-400 hover:bg-gray-800 transition-colors w-full"
        >
          <LogOut size={22} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto space-y-8">
        {/* Header */}
        <header className="flex justify-between items-center pb-4 border-b border-gray-300">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex items-center space-x-3">
            <span className="text-lg text-gray-600">
              Welcome, <span className="font-semibold text-gray-900">{username}</span>!
            </span>
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {username.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Priority Overview Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-700">Priority Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Urgent Action Card */}
            <div className="bg-red-600 text-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold">Urgent Action Required</h3>
                <AlertTriangle size={32} className="text-red-200" />
              </div>
              <p className="text-5xl font-extrabold mt-2">5</p>
              <p className="opacity-90 mt-1">Unacknowledged High-Risk Alerts</p>
              <button className="mt-6 bg-white text-red-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-md">
                Review Now
              </button>
            </div>

            {/* Upcoming Appointments Card */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Upcoming Appointments</h3>
              <ul className="space-y-3">
                <li className="flex items-center justify-between border-b pb-2 last:border-b-0">
                  <span className="font-medium text-gray-700">BrightSky705</span>
                  <span className="text-sm text-gray-500">10:30 AM</span>
                </li>
                <li className="flex items-center justify-between border-b pb-2 last:border-b-0">
                  <span className="font-medium text-gray-700">HappyStar545</span>
                  <span className="text-sm text-gray-500">11:30 AM</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">BlueRiver303</span>
                  <span className="text-sm text-gray-500">12:00 PM</span>
                </li>
              </ul>
            </div>

            {/* Counselor Status Card */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Counselor Status at a Glance</h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  Counselors Online: <span className="font-bold text-green-600">4</span>
                </p>
                <p>
                  Available Now: <span className="font-bold text-green-600">3</span>
                </p>
                <p>
                  Avg. Wait Time: <span className="font-bold">~2 mins</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Analytics & Insights Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-700">Data Analytics & Insights</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Engagement Chart */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Platform Engagement Trends</h3>
              <div className="h-64 flex flex-col items-center justify-center">
                <LineChart data={engagementChartData} colors={engagementChartColors} />
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

            {/* Language Reach Chart */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Language Diversity & Reach</h3>
              <div className="h-64 flex items-center justify-center">
                <PieChart data={languageData} />
              </div>
            </div>
          </div>
        </section>

        {/* Anxiety Analysis Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-700">Anxiety Analysis</h2>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Severity of Anxiety Discussions (Past 7 Days)</h3>
            <div className="h-64 flex flex-col items-center justify-center">
              <AnxietyAnalysisChart data={anxietyData} />
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
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Top 5 Utilized Resources</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex justify-between items-center">
                  <span>Anxiety Management (PDF)</span>
                  <span className="text-sm text-gray-500">2,145 Views</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Mindfulness 101 (Video)</span>
                  <span className="text-sm text-gray-500">1,892 Views</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Peer Support Guide</span>
                  <span className="text-sm text-gray-500">1,501 Views</span>
                </li>
              </ul>
            </div>

            {/* Peer Support Forum Card */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Peer Support Forum Activity</h3>
              <div className="space-y-2 text-gray-700">
                <p>New Posts (24h): <span className="font-bold text-blue-600">24</span></p>
                <p>Unmoderated Posts: <span className="font-bold text-yellow-600">6</span></p>
                <p>Active Threads: <span className="font-bold">12</span></p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}