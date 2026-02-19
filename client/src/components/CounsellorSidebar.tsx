"use client";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  Calendar,
  Users,
  MessageSquare,
  BookOpen,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useLocation } from "wouter";

export default function CounsellorSidebar() {
  const [open, setOpen] = useState(true);
  const [location] = useLocation();
  const [username, setUsername] = useState("Counsellor");

  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (stored) setUsername(stored);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/counsellor/dashboard" },
    { label: "My Schedule", icon: Calendar, href: "/counsellor/schedule" },
    { label: "Clients", icon: Users, href: "/counsellor/clients" },
    { label: "Messages", icon: MessageSquare, href: "/counsellor/messages" },
    { label: "Resources", icon: BookOpen, href: "/counsellor/resources" },
    { label: "Settings", icon: Settings, href: "/counsellor/settings" },
  ];

  return (
    <aside
      className={`flex-shrink-0 ${open ? "w-64" : "w-20"
        } transition-all duration-300 bg-gray-900 text-white h-screen sticky top-0 flex flex-col z-50 shadow-xl border-r border-gray-800`}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="brain_1757354497739.jpg" alt="logo" className="w-8 h-8" />
          {open && <span className="font-bold text-lg">Zenture</span>}
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="p-1 rounded-full text-white hover:bg-gray-800 transition-colors"
        >
          {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex-1 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location === item.href;

          return (
            <a
              key={index}
              href={item.href}
              className={`flex items-center gap-4 py-3 pl-4 pr-2 rounded-lg mx-2 transition-colors duration-200 
                ${isActive ? "bg-gray-800 text-blue-400" : "hover:bg-gray-800 text-gray-400 hover:text-blue-300"}
              `}
            >
              <Icon size={22} className={isActive ? "text-blue-400" : "text-gray-400"} />
              {open && <span className="text-sm font-medium">{item.label}</span>}
            </a>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 bg-gray-900">
        <div className="flex flex-col gap-4">
          <div className={`flex items-center ${open ? "justify-start" : "justify-center"} gap-3`}>
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {username.charAt(0).toUpperCase()}
            </div>
            {open && (
              <div className="text-xs text-gray-400 overflow-hidden">
                Signed in as <br />
                <strong className="text-white truncate block max-w-[120px]" title={username}>{username}</strong>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 text-red-400 hover:text-red-300 hover:bg-gray-800 p-2 rounded-lg transition-colors ${open ? "justify-start" : "justify-center"}`}
            title="Log Out"
          >
            <LogOut size={20} />
            {open && <span className="text-sm font-medium">Log Out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
