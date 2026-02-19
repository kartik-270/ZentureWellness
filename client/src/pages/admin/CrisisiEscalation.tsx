import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Phone,
} from "lucide-react";
import AdminLayout from "../../components/AdminLayout";

export default function CrisisEscalation() {
  const [username, setUsername] = useState("Admin");

  useEffect(() => {
    // Retrieve username from local storage, as in the main dashboard.
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <AdminLayout
      title="Crisis & Escalation"
      icon={<AlertTriangle className="text-red-500" />}
      username={username}
    >
      <p className="text-gray-600 mb-6">
        Immediate support channels and standard escalation procedures.
      </p>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Phone className="text-green-500" size={24} />
            Emergency Contacts
          </h2>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">24x7 Helpline:</span>
              <span className="font-bold text-green-600 text-lg">‪+91 98765 43210‬</span>
            </li>
            <li className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Email Support:</span>
              <span className="font-bold text-blue-600">support@collegehelpdesk.com</span>
            </li>
          </ul>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={24} />
            Escalation Steps
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li className="p-2 bg-red-50 rounded-lg border-l-4 border-red-400">
              <span className="font-medium">Contact the student's assigned counselor immediately.</span>
            </li>
            <li className="p-2 bg-orange-50 rounded-lg border-l-4 border-orange-400">
              <span className="font-medium">If unavailable or urgent, call the 24x7 Helpline.</span>
            </li>
            <li className="p-2 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
              <span className="font-medium">Log the incident in the official escalation portal.</span>
            </li>
            <li className="p-2 bg-gray-50 rounded-lg border-l-4 border-gray-400">
              <span className="font-medium">College administration will be notified for severe cases.</span>
            </li>
          </ol>
        </div>
      </section>
    </AdminLayout>
  );
}
