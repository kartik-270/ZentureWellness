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
  CheckCircle,
  XCircle,
  Upload
} from "lucide-react";
import { apiConfig } from "@/lib/config";
import { useToast } from "@/hooks/use-toast";

type Resource = {
  id: number;
  title: string;
  type: string;
  status: string;
  author: string;
  date: string;
  url?: string;
  description?: string;
};

// Simplified Sidebar Component integrated into the same file
const CounsellorSidebar = () => {
  // ... (Use existing logic or keep simplified)
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
        <a href="/admin/resources" className="flex items-center space-x-4 p-2 rounded-lg bg-gray-800 text-blue-400">
          <BookOpen size={22} />
          <span className="font-semibold">Resource Management</span>
        </a>
        {/* ... other links simplified for brevity if needed, or keep complete list ... */}
      </nav>
      <button onClick={handleLogout} className="flex items-center space-x-4 p-2 rounded-lg text-red-400 hover:bg-gray-800 transition-colors w-full">
        <LogOut size={22} />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newResource, setNewResource] = useState({
    title: "",
    description: "",
    type: "article", // article, video, audio
    content: "", // text content for articles
    file: null as File | null,
    link: "" // external link fallback
  });
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const [username, setUsername] = useState("Admin");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${apiConfig.baseUrl}/api/admin/resources`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setResources(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${apiConfig.baseUrl}/api/admin/resource/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast({ title: `Resource ${status}` });
        fetchResources();
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleDelete = (id: number) => {
    // Implement delete or just use reject
    updateStatus(id, 'rejected'); // Soft delete via reject for now
  };

  const onAddResource = async () => {
    if (!newResource.title) return;
    setUploading(true);

    let url = newResource.link;

    try {
      const token = localStorage.getItem("authToken");

      // Upload file if exists
      if (newResource.file) {
        const formData = new FormData();
        formData.append('file', newResource.file);

        const uploadRes = await fetch(`${apiConfig.baseUrl}/api/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          url = uploadData.url;
        } else {
          throw new Error("Upload failed");
        }
      }

      // Create Resource
      const res = await fetch(`${apiConfig.baseUrl}/api/counsellor/resources`, { // Reuse endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newResource.title,
          description: newResource.description,
          type: newResource.type,
          url: url,
          content: newResource.content
        })
      });

      if (res.ok) {
        toast({ title: "Resource submitted" });
        setIsModalOpen(false);
        fetchResources();
        setNewResource({ title: "", description: "", type: "article", content: "", file: null, link: "" });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to create resource", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900">
      <CounsellorSidebar />
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

          <div className="space-y-4">
            {resources.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-4">
                  {r.type === "article" && <FileText className="text-blue-600" />}
                  {r.type === "video" && <Video className="text-green-600" />}
                  {r.type === "audio" && <LinkIcon className="text-orange-600" />}
                  <div>
                    <div className="font-medium text-gray-800 flex items-center gap-2">
                      {r.title}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${r.status === 'approved' ? 'bg-green-100 text-green-800' :
                          r.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                        {r.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {r.type} • {r.date} • By {r.author}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {r.status === 'pending' && (
                    <>
                      <button onClick={() => updateStatus(r.id, 'approved')} className="p-2 text-green-600 hover:bg-green-50 rounded-full" title="Approve">
                        <CheckCircle size={20} />
                      </button>
                      <button onClick={() => updateStatus(r.id, 'rejected')} className="p-2 text-red-600 hover:bg-red-50 rounded-full" title="Reject">
                        <XCircle size={20} />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            {resources.length === 0 && <div className="text-center text-gray-500 py-8">No resources found.</div>}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Add New Resource</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={newResource.title}
                  onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <input
                  type="text"
                  value={newResource.description}
                  onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  value={newResource.type}
                  onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                >
                  <option value="article">Article</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                </select>
              </div>

              {newResource.type === 'article' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Content</label>
                  <textarea
                    value={newResource.content}
                    onChange={(e) => setNewResource({ ...newResource, content: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border h-32"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Upload File</label>
                  <div className="mt-1 flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                        <p className="text-xs text-gray-500">{newResource.file ? newResource.file.name : "MP4, MP3, etc."}</p>
                      </div>
                      <input type="file" className="hidden" onChange={(e) => setNewResource({ ...newResource, file: e.target.files?.[0] || null })} />
                    </label>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={onAddResource}
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {uploading ? 'Uploading...' : 'Add Resource'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
