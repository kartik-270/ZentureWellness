import React from "react";
import { 
  Settings, 
  Users, 
  Shield, 
  CreditCard, 
  RefreshCcw, 
  Puzzle,Home, 
  AlertTriangle, 
  Stethoscope, 
  BookOpen, 
  BarChart2
} from "lucide-react";

const SettingsPage: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
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
      

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-5 py-8">
        <a
          href="/admin/settings/general"
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg hover:ring-2 hover:ring-blue-500 transition-all duration-300"
        >
          <Settings className="mb-3 text-blue-600" size={32} />
          <h3 className="font-bold text-gray-800">General</h3>
          <p className="text-sm text-gray-500 mt-1">Site Preferences, Notifications, Accessibility</p>
        </a>

        <a
          href="/admin/settings/user-management"
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg hover:ring-2 hover:ring-blue-500 transition-all duration-300"
        >
          <Users className="mb-3 text-blue-600" size={32} />
          <h3 className="font-bold text-gray-800">User Management</h3>
          <p className="text-sm text-gray-500 mt-1">Roles, Permissions, Passwords</p>
        </a>

        <a
          href="/admin/settings/admin-accounts"
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg hover:ring-2 hover:ring-blue-500 transition-all duration-300"
        >
          <Shield className="mb-3 text-blue-600" size={32} />
          <h3 className="font-bold text-gray-800">Admin Accounts</h3>
          <p className="text-sm text-gray-500 mt-1">Audit Logs, 2FA, Access Control</p>
        </a>

        <a
          href="/admin/settings/subscriptions-billing"
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg hover:ring-2 hover:ring-blue-500 transition-all duration-300"
        >
          <CreditCard className="mb-3 text-blue-600" size={32} />
          <h3 className="font-bold text-gray-800">Subscriptions & Billing</h3>
          <p className="text-sm text-gray-500 mt-1">Billing Info, Plan Management</p>
        </a>

        <a
          href="/admin/settings/system-updates"
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg hover:ring-2 hover:ring-blue-500 transition-all duration-300"
        >
          <RefreshCcw className="mb-3 text-blue-600" size={32} />
          <h3 className="font-bold text-gray-800">System Updates</h3>
          <p className="text-sm text-gray-500 mt-1">Version Control, Backup & Restore</p>
        </a>

        <a
          href="/admin/settings/integrations"
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg hover:ring-2 hover:ring-blue-500 transition-all duration-300"
        >
          <Puzzle className="mb-3 text-blue-600" size={32} />
          <h3 className="font-bold text-gray-800">Integrations</h3>
          <p className="text-sm text-gray-500 mt-1">Third-Party Tools, API Keys</p>
        </a>

        <a
          href="/admin/settings/security"
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg hover:ring-2 hover:ring-blue-500 transition-all duration-300"
        >
          <Shield className="mb-3 text-blue-600" size={32} />
          <h3 className="font-bold text-gray-800">Security</h3>
          <p className="text-sm text-gray-500 mt-1">Data Privacy, Session Management</p>
        </a>
      </div>
    </div>
  );
};

export default SettingsPage;