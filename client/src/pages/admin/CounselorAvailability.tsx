import React, { useState, useEffect } from "react";
import {
  Stethoscope,
  Clock,
  Phone,
  Home,
  Users,
  AlertTriangle,
  BookOpen,
  BarChart2,
  Settings,
  LogOut,
} from "lucide-react";

// TypeScript interface for a counselor's details
interface Counselor {
  id: number;
  name: string;
  specialization: string;
  availability: string;
  contact: string;
}

// Array of counselor data
const counselors: Counselor[] = [
  {
    id: 1,
    name: "Dr. Radhika Sharma",
    specialization: "Mental Health",
    availability: "Mon - Fri, 10 AM - 4 PM",
    contact: "+91 98765 12345",
  },
  {
    id: 2,
    name: "Mr. Arjun Mehta",
    specialization: "Academic Guidance",
    availability: "Tue - Sat, 11 AM - 5 PM",
    contact: "+91 98765 54321",
  },
  {
    id: 3,
    name: "Ms. Neha Kapoor",
    specialization: "Career Counseling",
    availability: "Mon - Thu, 2 PM - 6 PM",
    contact: "+91 91234 56789",
  },
];

const CounselorAvailability: React.FC = () => {
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
          {/* Active link for the current page */}
          <a href="/admin/counselor-availability" className="flex items-center space-x-4 p-2 rounded-lg bg-gray-800 text-blue-400">
            <Stethoscope size={22} />
            <span className="font-semibold">Counselor Availability</span>
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

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto space-y-8">
        {/* Header - Consistent with the dashboard layout */}
        <header className="flex justify-between items-center pb-4 border-b border-gray-300 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Stethoscope className="text-blue-500" size={32} />
            Counselor Availability
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

        <p className="text-gray-600">
          Check the availability of our counselors and their primary contact information.
        </p>

        {/* Counselor Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {counselors.map((counselor) => (
            <div
              key={counselor.id}
              className="bg-white shadow-lg rounded-xl p-6 flex flex-col space-y-4 hover:shadow-xl transition-shadow duration-300 border border-gray-200"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
                  <Stethoscope size={32} className="text-gray-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {counselor.name}
                  </h2>
                  <p className="text-blue-600 font-medium">{counselor.specialization}</p>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <Clock size={18} className="text-green-500" />
                  <span className="text-sm">{counselor.availability}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone size={18} className="text-blue-500" />
                  <span className="text-sm">{counselor.contact}</span>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default CounselorAvailability;