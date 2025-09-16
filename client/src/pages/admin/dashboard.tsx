import {
  Home,
  Users,
  AlertTriangle,
  Stethoscope,
  BookOpen,
  BarChart2,
  Settings,
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-100 p-6 space-y-6">
        <h1 className="text-xl font-bold mb-4">Dashboard</h1>
        <nav className="space-y-3">
          <a href="/admin/dashboard" className="flex items-center space-x-8 hover:text-blue-400 cursor-pointer">
            <Home size={26} /> <span>Dashboard Home</span>
          </a>
          <a href="/admin/students" className="flex items-center space-x-8 hover:text-blue-400 cursor-pointer">
            <Users size={26} /> <span>Student Directory</span>
          </a>
          <a href="/admin/crisis-escalation" className="flex items-center space-x-8 hover:text-blue-400 cursor-pointer">
            <AlertTriangle size={26} /> <span>Crisis & Escalation</span>
          </a>
          <a href="/admin/counselor-availability" className="flex items-center space-x-8 hover:text-blue-400 cursor-pointer">
            <Stethoscope size={26} /> <span>Counselor Availability</span>
          </a>
          <a href="/admin/resources" className="flex items-center space-x-8 hover:text-blue-400 cursor-pointer">
            <BookOpen size={26} /> <span>Resource Management</span>
          </a>
          <a href="/admin/reports" className="flex items-center space-x-8 hover:text-blue-400 cursor-pointer">
            <BarChart2 size={26} /> <span>Reporting & Analytics</span>
          </a>
          <a href="/admin/settings" className="flex items-center space-x-8 hover:text-blue-400 cursor-pointer">
            <Settings size={26} /> <span>Settings</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto space-y-6">
        <h2 className="text-2xl font-bold">Priority Overview</h2>

        {/* Top Row */}
        <div className="grid grid-cols-3 gap-6">
          {/* Urgent Action */}
          <div className="bg-red-500 text-white rounded-lg p-6 shadow">
            <h3 className="text-lg font-bold">Urgent Action Required</h3>
            <p className="text-4xl font-extrabold mt-2">12</p>
            <p className="opacity-90">Unacknowledged High-Risk Alerts</p>
            <button className="mt-4 bg-white text-red-600 px-8 py-2 rounded font-semibold hover:bg-gray-100">
              Review Now
            </button>
            <p className="text-xs mt-2">New High-Risk Alerts (Past 24h)</p>
          </div>

          {/* Appointments */}
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="font-bold mb-4">Upcoming Appointments</h3>
            <ul className="space-y-3">
              <li className="flex justify-between">
                <span>Student ID 1234</span>
                <span className="text-sm text-gray-500">10:30 AM</span>
              </li>
              <li className="flex justify-between">
                <span>Student ID 5678</span>
                <span className="text-sm text-gray-500">11:30 AM</span>
              </li>
              <li className="flex justify-between">
                <span>Student ID 9876</span>
                <span className="text-sm text-gray-500">12:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Counselor Status */}
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="font-bold mb-4">Counselor Status at a Glance</h3>
            <p>Counselors Online: <span className="font-bold">4</span></p>
            <p>Available Now: <span className="font-bold">3</span></p>
            <p>Avg Wait Time: <span className="font-bold text-green-600">2m</span></p>
          </div>
        </div>

        {/* Graphs */}
        <div className="grid grid-cols-2 gap-6">
          {/* Engagement */}
          <div className="bg-white rounded-lg p-6 shadow h-64 flex items-center justify-center text-gray-400">
            📊 Platform Engagement Overview
          </div>

        {/* Language Reach */}
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="font-bold mb-4">Language Diversity & Reach</h3>
            <p>English: 70%</p>
            <p>Hindi: 20%</p>
            <p>Other: 10%</p>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="font-bold mb-4">Top 5 Utilized Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>Anxiety Management — Avg. Complete</li>
              <li>Mindfulness 101 — Total Views</li>
              <li>Mrhiple Therapist — Avg. Mentors</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="font-bold mb-4">Peer Support Forum Activity</h3>
            <p>New Posts: <span className="font-bold">24</span></p>
            <p>Unmoderated Posts: <span className="font-bold">6</span></p>
            <p>Active Threads: <span className="font-bold">12</span></p>
          </div>
        </div>
      </main>
    </div>
  );
}