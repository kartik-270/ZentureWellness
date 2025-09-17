"use client";
import { useState } from "react";
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

export default function CounsellorSidebar() {
  const [open, setOpen] = useState(true);

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
      className={`flex-shrink-0 ${
        open ? "w-64" : "w-20"
      } transition-all duration-300 bg-gray-900 text-white min-h-screen flex flex-col`}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="logo" className="w-8 h-8 rounded-full" />
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
      <nav className="mt-6 flex-1 space-y-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = item.href === "/counsellor/dashboard"; // Example for active state

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
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center justify-center">
          {open ? (
            <div className="text-xs text-gray-400 text-center">
              Signed in as <br />
              <strong className="text-white">Dr. Lena</strong>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
              DL
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}