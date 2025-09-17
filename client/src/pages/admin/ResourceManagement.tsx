"use client";
import { useState, useEffect } from "react";
import {
  FileText,
  Video,
  Link as LinkIcon,
  Plus,
  Trash2,
  X,
  Home,
  Users,
  AlertTriangle,
  Stethoscope,
  BookOpen,
  BarChart2,
  Settings,
  LogOut,
} from "lucide-react";

type Resource = {
  id: number;
  title: string;
  type: "Document" | "Video" | "Article";
  date: string;
};

// Simplified Sidebar Component integrated into the same file
const CounsellorSidebar = () => {
  const [username, setUsername] = useState("Admin");

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
        <a href="/admin/resources" className="flex items-center space-x-4 p-2 rounded-lg bg-gray-800 text-blue-400">
          <BookOpen size={22} />
          <span className="font-semibold">Resource Management</span>
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
  );
};

// Simplified CounsellorHeader component integrated into the same file
const CounsellorHeader = ({ name }: { name: string }) => {
  return (
    <header className="flex justify-between items-center pb-4 border-b border-gray-300">
      <h1 className="text-3xl font-bold text-gray-800">Resource Management</h1>
      <div className="flex items-center space-x-3">
        <span className="text-lg text-gray-600">
          Welcome, <span className="font-semibold text-gray-900">{name}</span>!
        </span>
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
          {name.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([
    { id: 1, title: "Coping with Stress.pdf", type: "Document", date: "Sep 12, 2025" },
    { id: 2, title: "Mindfulness Session.mp4", type: "Video", date: "Sep 10, 2025" },
    { id: 3, title: "Healthy Habits Blog", type: "Article", date: "Sep 8, 2025" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newResource, setNewResource] = useState({
    title: "",
    type: "Document",
  });

  const handleDelete = (id: number) => {
    setResources(resources.filter((r) => r.id !== id));
  };
    const [username, setUsername] = useState("Admin");
  
useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);
  const onAddResource = () => {
    if (newResource.title.trim() === "") return;
    const newId = resources.length > 0 ? Math.max(...resources.map(r => r.id)) + 1 : 1;
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const newEntry: Resource = {
      id: newId,
      title: newResource.title,
      type: newResource.type as "Document" | "Video" | "Article",
      date: formattedDate,
    };

    setResources([...resources, newEntry]);
    setNewResource({ title: "", type: "Document" });
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900">
      {/* Sidebar */}
      
        <CounsellorSidebar />
      {/* Main Area */}
      <div className="flex-1 p-6 lg:p-10 overflow-y-auto">
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

        <div className="mt-8 bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Resource Management</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} /> Add Resource
            </button>
          </div>

          {/* Resource List */}
          <div className="space-y-4">
            {resources.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
              >
                <div className="flex items-center gap-4">
                  {r.type === "Document" && <FileText className="text-blue-600" />}
                  {r.type === "Video" && <Video className="text-green-600" />}
                  {r.type === "Article" && <LinkIcon className="text-orange-600" />}
                  <div>
                    <div className="font-medium text-gray-800">{r.title}</div>
                    <div className="text-sm text-gray-500">
                      {r.type} • {r.date}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Resource Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Add New Resource</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Resource Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newResource.title}
                  onChange={(e) =>
                    setNewResource({ ...newResource, title: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Resource Type
                </label>
                <select
                  id="type"
                  value={newResource.type}
                  onChange={(e) =>
                    setNewResource({ ...newResource, type: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="Document">Document</option>
                  <option value="Video">Video</option>
                  <option value="Article">Article</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={onAddResource}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Resource
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}