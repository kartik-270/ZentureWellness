import React, { useState, useEffect } from "react";
import {
  Stethoscope,
  Clock,
  Phone,
  Plus,
  X,
  Edit2
} from "lucide-react";
import { apiConfig } from "@/lib/config";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "../../components/AdminLayout";

// TypeScript interface for a counselor's details
interface Counselor {
  id: number;
  user_id: number;
  name: string;
  specialization: string;
  availability: {
    days: string[];
    timeRange: string;
  };
  contact: string;
  image: string;
}

const CounselorAvailability: React.FC = () => {
  const [username, setUsername] = useState("Admin");
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCounselorId, setCurrentCounselorId] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    username: "",
    password: "", // Only for creating or resetting
    email: "",
    specialization: "",
    days: [] as string[],
    startTime: "09:00",
    endTime: "17:00"
  });

  const { toast } = useToast();

  const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
    fetchCounselors();
  }, []);

  const fetchCounselors = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${apiConfig.baseUrl}/counselors`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Normalize availability data if it comes in legacy format
        const normalizedData = data.map((c: any) => ({
          ...c,
          availability: typeof c.availability === 'object' && c.availability.days
            ? c.availability
            : { days: ["Mon", "Fri"], timeRange: "09:00-17:00" } // Fallback/Default
        }));
        setCounselors(normalizedData);
      }
    } catch (error) {
      console.error("Failed to fetch counselors", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setFormData({
      username: "",
      password: "",
      email: "",
      specialization: "",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      startTime: "09:00",
      endTime: "17:00"
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (counselor: Counselor) => {
    setIsEditing(true);
    setCurrentCounselorId(counselor.id);

    const [start, end] = (counselor.availability.timeRange || "09:00-17:00").split("-");

    setFormData({
      username: counselor.name,
      password: "", // Leave empty to not change
      email: counselor.contact || "",
      specialization: counselor.specialization,
      days: counselor.availability.days || [],
      startTime: start || "09:00",
      endTime: end || "17:00"
    });
    setIsModalOpen(true);
  };

  const handleDayToggle = (day: string) => {
    setFormData(prev => {
      const days = prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day];
      return { ...prev, days };
    });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const url = isEditing
        ? `${apiConfig.baseUrl}/admin/counselors/${currentCounselorId}`
        : `${apiConfig.baseUrl}/admin/counselors`;

      const method = isEditing ? "PUT" : "POST";

      const body: any = {
        username: formData.username,
        email: formData.email,
        specialization: formData.specialization,
        availability: {
          days: formData.days,
          timeRange: `${formData.startTime}-${formData.endTime}`
        }
      };

      if (formData.password) {
        body.password = formData.password;
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        toast({ title: `Counselor ${isEditing ? 'updated' : 'added'} successfully` });
        setIsModalOpen(false);
        fetchCounselors();
      } else {
        const err = await res.json();
        toast({ title: "Error", description: err.msg, variant: "destructive" });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Failed to save counselor", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  return (
    <AdminLayout
      title="Counselor Availability"
      icon={<Stethoscope className="text-blue-500" />}
      username={username}
    >
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Check and update the availability of counselors.
        </p>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
        >
          <Plus size={20} /> Add Counselor
        </button>
      </div>

      {loading ? (
        <p>Loading counselors...</p>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {counselors.map((counselor) => (
            <div
              key={counselor.id}
              className="bg-white shadow-lg rounded-xl p-6 flex flex-col space-y-4 hover:shadow-xl transition-shadow duration-300 border border-gray-200 relative group"
            >
              {/* Edit Button */}
              <button
                onClick={() => handleOpenEditModal(counselor)}
                className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit2 size={20} />
              </button>

              <div className="flex items-center gap-4">
                <img src={counselor.image} alt={counselor.name} className="w-16 h-16 rounded-full object-cover bg-gray-200" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {counselor.name}
                  </h2>
                  <p className="text-blue-600 font-medium">{counselor.specialization}</p>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex flex-col gap-1 text-gray-700">
                  <div className="flex items-center gap-2 font-semibold">
                    <Clock size={16} className="text-green-500" /> Availability
                  </div>
                  <div className="pl-6 text-sm">
                    <div className="flex flex-wrap gap-1 mb-1">
                      {counselor.availability.days.map(day => (
                        <span key={day} className="px-2 py-0.5 bg-gray-100 rounded text-xs border border-gray-300">
                          {day}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">{counselor.availability.timeRange}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone size={18} className="text-blue-500" />
                  <span className="text-sm">{counselor.contact}</span>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Counselor Modal (Add/Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                {isEditing ? `Edit ${formData.username}` : "Register New Counselor"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password {isEditing && <span className="text-xs text-gray-400">(Leave blank to keep current)</span>}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Availability Section */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-800 mb-2">Availability</h4>

                <label className="block text-sm font-medium text-gray-700 mb-2">Available Days</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {DAYS_OF_WEEK.map(day => (
                    <button
                      key={day}
                      onClick={() => handleDayToggle(day)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${formData.days.includes(day)
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={formData.days.length === 0}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isEditing ? "Update Counselor" : "Register Counselor"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default CounselorAvailability;
