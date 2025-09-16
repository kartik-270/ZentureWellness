import React from "react";
import {
  Home,
  Users,
  AlertTriangle,
  Stethoscope,
  BookOpen,
  BarChart2,
  Settings,
  Phone,
  Mail
} from "lucide-react";

const CrisisEscalation = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar from AdminDashboard */}
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
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <AlertTriangle className="text-red-500" size={32} />
            Crisis & Escalation
          </h1>
          <p className="text-gray-600 mt-2">
            Immediate support channels and standard escalation procedures.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Emergency Contacts</h2>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Phone className="text-green-500" size={20} />
                <span className="font-medium">‪+91 98765 43210‬ (24x7 Helpline)</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-blue-500" size={20} />
                <span className="font-medium">support@collegehelpdesk.com</span>
              </li>
            </ul>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Escalation Steps</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Contact the student's assigned counselor immediately.</li>
              <li>If unavailable or urgent, call the 24x7 Helpline.</li>
              <li>Log the incident in the official escalation portal.</li>
              <li>College administration will be notified for severe cases.</li>
            </ol>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CrisisEscalation;