import React, { useState, useEffect } from "react";
import {
  Home,
  Users,
  AlertTriangle,
  Stethoscope,
  BookOpen,
  BarChart2,
  Settings,
  Phone,
  Mail,
  LogOut,
} from "lucide-react";

export default function CrisisEscalation() {
  const [username, setUsername] = useState("Admin");

  useEffect(() => {
    // Retrieve username from local storage, as in the main dashboard.
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    // Clear authentication data and redirect to login
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Reusing the dashboard's design */}
      <aside className="w-66 bg-gray-900 text-gray-100 p-6 flex flex-col justify-between">
        <nav className="space-y-6">
          <h1 className="text-2xl font-bold text-white mb-8">Zenture Admin</h1>
          <a href="/admin/dashboard" className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800 transition-colors">
            <Home size={22} />
            <span>Dashboard Home</span>
          </a>
          <a href="/admin/students" className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800 transition-colors">
            <Users size={22} />
            <span>Student Directory</span>
          </a>
          {/* Active link for the current page */}
          <a href="/admin/crisis-escalation" className="flex items-center space-x-4 p-2 rounded-lg bg-gray-800 text-red-400">
            <AlertTriangle size={22} />
            <span className="font-semibold">Crisis & Escalation</span>
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
        {/* Header - Consistent with the dashboard layout */}
        <header className="flex justify-between items-center pb-4 border-b border-gray-300 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <AlertTriangle className="text-red-500" size={32} />
            Crisis & Escalation
          </h1>
          <div className="flex items-center space-x-3">
            <span className="text-lg text-gray-600">
              Welcome, <span className="font-semibold text-gray-900">{username}</span>!
            </span>
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {username.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <p className="text-gray-600 mt-2">
          Immediate support channels and standard escalation procedures.
        </p>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Phone className="text-green-500" size={20} />
              Emergency Contacts
            </h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-center gap-3">
                <span className="font-medium">24x7 Helpline:</span>
                <span className="font-semibold text-green-600">‪+91 98765 43210‬</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="font-medium">Email Support:</span>
                <span className="font-semibold text-blue-600">support@collegehelpdesk.com</span>
              </li>
            </ul>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="text-red-500" size={20} />
              Escalation Steps
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li className="font-medium">Contact the student's assigned counselor immediately.</li>
              <li className="font-medium">If unavailable or urgent, call the 24x7 Helpline.</li>
              <li className="font-medium">Log the incident in the official escalation portal.</li>
              <li className="font-medium">College administration will be notified for severe cases.</li>
            </ol>
          </div>
        </section>
      </main>
    </div>
  );
}