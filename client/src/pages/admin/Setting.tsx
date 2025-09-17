import React, { useState, useEffect } from "react";
import { 
  Settings, 
  Users, 
  Shield, 
  CreditCard, 
  RefreshCcw, 
  Puzzle,
  Home, 
  AlertTriangle, 
  Stethoscope, 
  BookOpen, 
  BarChart2,
  LogOut,
} from "lucide-react";

const SettingsPage: React.FC = () => {
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
          {/* Active link for the current page */}
          <a href="/admin/settings" className="flex items-center space-x-4 p-2 rounded-lg bg-gray-800 text-blue-400">
            <Settings size={22} />
            <span className="font-semibold">Settings</span>
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
            <Settings className="text-blue-500" size={32} />
            System Settings
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

        {/* Settings Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <a
            href="/admin/settings/general"
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl hover:ring-2 hover:ring-blue-500 transition-all duration-300 flex flex-col items-start"
          >
            <Settings className="mb-3 text-blue-600" size={32} />
            <h3 className="font-bold text-gray-800 text-xl">General</h3>
            <p className="text-sm text-gray-500 mt-1">Site preferences, notifications, accessibility</p>
          </a>

          <a
            href="/admin/settings/user-management"
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl hover:ring-2 hover:ring-blue-500 transition-all duration-300 flex flex-col items-start"
          >
            <Users className="mb-3 text-blue-600" size={32} />
            <h3 className="font-bold text-gray-800 text-xl">User Management</h3>
            <p className="text-sm text-gray-500 mt-1">Roles, permissions, and passwords</p>
          </a>

          <a
            href="/admin/settings/admin-accounts"
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl hover:ring-2 hover:ring-blue-500 transition-all duration-300 flex flex-col items-start"
          >
            <Shield className="mb-3 text-blue-600" size={32} />
            <h3 className="font-bold text-gray-800 text-xl">Admin Accounts</h3>
            <p className="text-sm text-gray-500 mt-1">Audit logs, 2FA, access control</p>
          </a>

          <a
            href="/admin/settings/subscriptions-billing"
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl hover:ring-2 hover:ring-blue-500 transition-all duration-300 flex flex-col items-start"
          >
            <CreditCard className="mb-3 text-blue-600" size={32} />
            <h3 className="font-bold text-gray-800 text-xl">Subscriptions & Billing</h3>
            <p className="text-sm text-gray-500 mt-1">Billing info and plan management</p>
          </a>

          <a
            href="/admin/settings/system-updates"
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl hover:ring-2 hover:ring-blue-500 transition-all duration-300 flex flex-col items-start"
          >
            <RefreshCcw className="mb-3 text-blue-600" size={32} />
            <h3 className="font-bold text-gray-800 text-xl">System Updates</h3>
            <p className="text-sm text-gray-500 mt-1">Version control, backup & restore</p>
          </a>

          <a
            href="/admin/settings/integrations"
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl hover:ring-2 hover:ring-blue-500 transition-all duration-300 flex flex-col items-start"
          >
            <Puzzle className="mb-3 text-blue-600" size={32} />
            <h3 className="font-bold text-gray-800 text-xl">Integrations</h3>
            <p className="text-sm text-gray-500 mt-1">Third-party tools and API keys</p>
          </a>

          <a
            href="/admin/settings/security"
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl hover:ring-2 hover:ring-blue-500 transition-all duration-300 flex flex-col items-start"
          >
            <Shield className="mb-3 text-blue-600" size={32} />
            <h3 className="font-bold text-gray-800 text-xl">Security</h3>
            <p className="text-sm text-gray-500 mt-1">Data privacy and session management</p>
          </a>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;