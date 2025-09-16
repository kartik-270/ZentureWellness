import React from "react";
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
  return (
    // Corrected layout: Use flexbox for a sidebar and main content layout
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

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Stethoscope className="text-blue-500" size={32} />
            Counselor Availability
          </h1>
          <p className="text-gray-600 mt-2">
            Check when counselors are available and how to reach them.
          </p>
        </header>

        {/* Counselor Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {counselors.map((counselor) => (
            <div
              key={counselor.id}
              className="bg-white shadow-md rounded-2xl p-6 flex flex-col space-y-4 hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-xl font-bold text-gray-900">
                {counselor.name}
              </h2>
              <p className="text-blue-600 font-medium">{counselor.specialization}</p>
              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <Clock size={18} className="text-green-500" />
                  <span>{counselor.availability}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone size={18} className="text-blue-500" />
                  <span>{counselor.contact}</span>
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